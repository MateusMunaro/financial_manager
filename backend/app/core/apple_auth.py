"""
Serviço de autenticação com Apple (Sign in with Apple)
"""
import jwt
import time
import requests
from typing import Dict, Optional
from fastapi import HTTPException, status
from app.config import settings


class AppleAuthService:
    """Serviço para autenticação com Apple"""
    
    APPLE_TOKEN_URL = "https://appleid.apple.com/auth/token"
    APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys"
    APPLE_AUTH_URL = "https://appleid.apple.com/auth/authorize"
    
    @staticmethod
    def generate_client_secret() -> str:
        """
        Gera o client_secret JWT para autenticação com Apple.
        A Apple exige um JWT assinado com a private key.
        """
        headers = {
            "kid": settings.APPLE_KEY_ID,
            "alg": "ES256"
        }
        
        payload = {
            "iss": settings.APPLE_TEAM_ID,
            "iat": int(time.time()),
            "exp": int(time.time()) + 86400 * 180,  # 180 dias
            "aud": "https://appleid.apple.com",
            "sub": settings.APPLE_CLIENT_ID,
        }
        
        try:
            # A chave privada da Apple usa algoritmo ES256
            client_secret = jwt.encode(
                payload,
                settings.APPLE_PRIVATE_KEY,
                algorithm="ES256",
                headers=headers
            )
            return client_secret
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao gerar client_secret: {str(e)}"
            )
    
    @staticmethod
    def get_authorization_url(state: Optional[str] = None) -> str:
        """
        Gera URL de autorização da Apple
        """
        params = {
            "client_id": settings.APPLE_CLIENT_ID,
            "redirect_uri": settings.APPLE_REDIRECT_URI,
            "response_type": "code id_token",
            "scope": "name email",
            "response_mode": "form_post",
        }
        
        if state:
            params["state"] = state
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{AppleAuthService.APPLE_AUTH_URL}?{query_string}"
    
    @staticmethod
    async def exchange_code_for_token(code: str) -> Dict:
        """
        Troca o authorization code por tokens
        """
        client_secret = AppleAuthService.generate_client_secret()
        
        data = {
            "client_id": settings.APPLE_CLIENT_ID,
            "client_secret": client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.APPLE_REDIRECT_URI,
        }
        
        try:
            response = requests.post(
                AppleAuthService.APPLE_TOKEN_URL,
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Erro ao obter token da Apple: {response.text}"
                )
            
            return response.json()
        except requests.RequestException as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao comunicar com Apple: {str(e)}"
            )
    
    @staticmethod
    def decode_id_token(id_token: str) -> Dict:
        """
        Decodifica e valida o ID token da Apple
        """
        try:
            # Buscar as chaves públicas da Apple
            keys_response = requests.get(AppleAuthService.APPLE_KEYS_URL)
            keys = keys_response.json()["keys"]
            
            # Decodificar header do token para pegar o 'kid'
            unverified_header = jwt.get_unverified_header(id_token)
            kid = unverified_header["kid"]
            
            # Encontrar a chave correspondente
            public_key = None
            for key in keys:
                if key["kid"] == kid:
                    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                    break
            
            if not public_key:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Chave pública da Apple não encontrada"
                )
            
            # Verificar e decodificar o token
            decoded = jwt.decode(
                id_token,
                public_key,
                algorithms=["RS256"],
                audience=settings.APPLE_CLIENT_ID,
                issuer="https://appleid.apple.com"
            )
            
            return decoded
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expirado"
            )
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token inválido: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao validar token: {str(e)}"
            )
    
    @staticmethod
    def extract_user_info(id_token_data: Dict, user_data: Optional[Dict] = None) -> Dict:
        """
        Extrai informações do usuário do ID token e dos dados fornecidos
        """
        email = id_token_data.get("email")
        apple_user_id = id_token_data.get("sub")
        
        if not email or not apple_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dados inválidos do token da Apple"
            )
        
        # Nome só vem na primeira vez que o usuário faz login
        name = None
        if user_data:
            name_obj = user_data.get("name", {})
            first_name = name_obj.get("firstName", "")
            last_name = name_obj.get("lastName", "")
            name = f"{first_name} {last_name}".strip() or email.split("@")[0]
        else:
            # Se não tiver nome, usar parte do email
            name = email.split("@")[0]
        
        return {
            "apple_id": apple_user_id,
            "email": email,
            "name": name,
            "email_verified": id_token_data.get("email_verified", False)
        }
