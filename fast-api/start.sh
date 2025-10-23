#!/bin/bash

echo "================================"
echo "Financial Manager API - Setup"
echo "================================"
echo ""

echo "[1/4] Ativando ambiente virtual..."
source venv/bin/activate

echo "[2/4] Instalando dependências..."
pip install -r requirements.txt

echo "[3/4] Criando banco de dados..."
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine); print('Banco de dados criado com sucesso!')"

echo "[4/4] Iniciando servidor..."
echo ""
echo "================================"
echo "Servidor rodando em: http://localhost:8000"
echo "Documentação: http://localhost:8000/docs"
echo "================================"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
