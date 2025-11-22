from app.main import app
from mangum import Mangum

# Handler para Vercel (compatível com ASGI)
handler = Mangum(app)
