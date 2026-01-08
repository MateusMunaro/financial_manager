from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    ChangePassword,
    AuthResponse,
    AppleAuthRequest,
    AppleCallbackRequest,
)
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
)
from app.core.apple_auth import AppleAuthService
import json
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registrar novo usuário."""
    # Verificar se email já existe
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado",
        )
    
    # Criar usuário
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Criar token
    access_token = create_access_token(data={"sub": db_user.id})
    
    return AuthResponse(
        user=UserResponse.model_validate(db_user),
        token=access_token,
    )


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Fazer login."""
    # Buscar usuário
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token
    access_token = create_access_token(data={"sub": user.id})
    
    return AuthResponse(
        user=UserResponse.model_validate(user),
        token=access_token,
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Fazer logout."""
    # Como estamos usando JWT stateless, apenas retornamos sucesso
    # O cliente deve remover o token
    return {"message": "Logout realizado com sucesso"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obter informações do usuário atual."""
    return UserResponse.model_validate(current_user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar perfil do usuário."""
    # Verificar se email já está em uso por outro usuário
    if user_data.email and user_data.email != current_user.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já está em uso",
            )
    
    # Atualizar campos
    if user_data.name is not None:
        current_user.name = user_data.name
    if user_data.email is not None:
        current_user.email = user_data.email
    if user_data.avatar is not None:
        current_user.avatar = user_data.avatar
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse.model_validate(current_user)


@router.post("/change-password")
async def change_password(
    password_data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Alterar senha do usuário."""
    # Verificar senha atual
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha atual incorreta",
        )
    
    # Verificar se as novas senhas coincidem
    if password_data.new_password != password_data.confirm_new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="As senhas não coincidem",
        )
    
    # Atualizar senha
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Senha alterada com sucesso"}


# ============================================
# Apple OAuth Endpoints
# ============================================

@router.get("/apple/login")
async def apple_login():
    """
    Inicia o fluxo de autenticação com Apple.
    Retorna a URL para redirecionar o usuário.
    """
    auth_url = AppleAuthService.get_authorization_url()
    return {"url": auth_url}


@router.post("/apple/callback", response_model=AuthResponse)
async def apple_callback(
    callback_data: AppleCallbackRequest,
    db: Session = Depends(get_db)
):
    """
    Callback da autenticação com Apple.
    Recebe o código de autorização e processa o login.
    """
    try:
        # Trocar código por tokens
        token_data = await AppleAuthService.exchange_code_for_token(callback_data.code)
        id_token = token_data.get("id_token") or callback_data.id_token
        
        if not id_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ID token não fornecido pela Apple"
            )
        
        # Decodificar e validar ID token
        id_token_data = AppleAuthService.decode_id_token(id_token)
        
        # Parse user data se fornecido (primeira vez)
        user_data = None
        if callback_data.user:
            try:
                user_data = json.loads(callback_data.user)
            except json.JSONDecodeError:
                pass
        
        # Extrair informações do usuário
        user_info = AppleAuthService.extract_user_info(id_token_data, user_data)
        
        # Buscar ou criar usuário
        user = db.query(User).filter(User.apple_id == user_info["apple_id"]).first()
        
        if not user:
            # Verificar se email já existe
            existing_user = db.query(User).filter(User.email == user_info["email"]).first()
            if existing_user:
                # Vincular conta Apple à conta existente
                existing_user.apple_id = user_info["apple_id"]
                db.commit()
                user = existing_user
            else:
                # Criar novo usuário
                user = User(
                    name=user_info["name"],
                    email=user_info["email"],
                    apple_id=user_info["apple_id"],
                    hashed_password=None,  # Sem senha para login social
                )
                db.add(user)
                db.commit()
                db.refresh(user)
        
        # Criar token JWT
        access_token = create_access_token(data={"sub": user.id})
        
        return AuthResponse(
            user=UserResponse.model_validate(user),
            token=access_token,
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar login com Apple: {str(e)}"
        )


@router.post("/apple", response_model=AuthResponse)
async def apple_auth(
    auth_data: AppleAuthRequest,
    db: Session = Depends(get_db)
):
    """
    Endpoint alternativo para login com Apple (para uso direto do frontend).
    Recebe o código de autorização diretamente.
    """
    try:
        # Trocar código por tokens
        token_data = await AppleAuthService.exchange_code_for_token(auth_data.code)
        id_token = token_data.get("id_token") or auth_data.id_token
        
        if not id_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ID token não fornecido"
            )
        
        # Decodificar e validar ID token
        id_token_data = AppleAuthService.decode_id_token(id_token)
        
        # Extrair informações do usuário
        user_info = AppleAuthService.extract_user_info(id_token_data, auth_data.user_data)
        
        # Buscar ou criar usuário
        user = db.query(User).filter(User.apple_id == user_info["apple_id"]).first()
        
        if not user:
            # Verificar se email já existe
            existing_user = db.query(User).filter(User.email == user_info["email"]).first()
            if existing_user:
                # Vincular conta Apple à conta existente
                existing_user.apple_id = user_info["apple_id"]
                db.commit()
                user = existing_user
            else:
                # Criar novo usuário
                user = User(
                    name=user_info["name"],
                    email=user_info["email"],
                    apple_id=user_info["apple_id"],
                    hashed_password=None,
                )
                db.add(user)
                db.commit()
                db.refresh(user)
        
        # Criar token JWT
        access_token = create_access_token(data={"sub": user.id})
        
        return AuthResponse(
            user=UserResponse.model_validate(user),
            token=access_token,
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar autenticação Apple: {str(e)}"
        )
