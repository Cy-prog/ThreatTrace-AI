import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "ThreatTrace AI Inference Service"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    API_KEY: str = os.getenv("API_KEY", "ThreatTrace-Internal-AI-Key-2026-Secure")
    PORT: int = int(os.getenv("PORT", "8000"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # Model metadata
    CLASSIFIER_MODEL_NAME: str = "ThreatClassifier-MultiClass"
    CLASSIFIER_MODEL_VERSION: str = "v1.4.2"
    NER_MODEL_NAME: str = "ThreatNER-CyberLinguistic"
    NER_MODEL_VERSION: str = "v2.1.0"
    RISK_ENGINE_VERSION: str = "v1.0.0"

settings = Settings()
