import sys
import os

# Adicionar o diretório pai ao path para importações funcionarem
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from app.main import app
    
    # Vercel detecta automaticamente aplicações ASGI/FastAPI
    # Basta exportar a instância 'app'
except Exception as e:
    print(f"Error initializing app: {e}")
    import traceback
    traceback.print_exc()
    raise
