from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.utils.logging import setup_logger
from app.api.routes import health, analysis, models

logger = setup_logger("threattrace_main")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ThreatTrace AI Microservice for NLP threat classification, entity extraction, risk scoring, and correlation."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health.router)
app.include_router(analysis.router)
app.include_router(models.router)

@app.on_event("startup")
def on_startup():
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} in {settings.ENVIRONMENT} mode on port {settings.PORT}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=False)
