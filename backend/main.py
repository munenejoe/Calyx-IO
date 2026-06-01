import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from backend.api.routes import (
    catalogue,
    feedback,
    health,
    identify,
    search,
    species,
)

from backend.config import settings
from backend.main_state import vision


# 🔥 CREATE APP
app = FastAPI(
    title="Calyx API",
    version="1.0",
)

origins = settings.CORS_ORIGINS

print("✅ CORS origins:", origins)


# ADD CORS (CORRECTLY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 DEBUG IMAGE FOLDER
DEBUG_DIR = "/tmp/calyx_debug"
os.makedirs(DEBUG_DIR, exist_ok=True)

app.mount("/debug", StaticFiles(directory=DEBUG_DIR), name="debug")


# 🔥 RATE LIMITING
def rate_limit_key(request: Request) -> str:
    return get_remote_address(request)


limiter = Limiter(key_func=rate_limit_key)
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded"},
    )

# 🔥 STARTUP
@app.on_event("startup")
async def startup_event():
    await vision.load_model()
    print("✅ Vision model loaded")


# 🔥 ROUTERS
app.include_router(health.router)
app.include_router(identify.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(species.router, prefix="/api/v1")
app.include_router(catalogue.router, prefix="/api/v1")
app.include_router(feedback.router, prefix="/api/v1")


# 🔥 GLOBAL ERROR HANDLER
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)},
    )