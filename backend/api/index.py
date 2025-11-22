import sys
import os

# Adicionar o diretório pai ao path para importações funcionarem
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from app.main import app
    from mangum import Mangum
    
    # Handler para Vercel (compatível com ASGI)
    handler = Mangum(app, lifespan="off")
except Exception as e:
    print(f"Error initializing app: {e}")
    import traceback
    traceback.print_exc()
    raise
