from fastapi import Header, HTTPException, status
from app.config.settings import settings

def verify_internal_api_key(x_threattrace_internal_key: str = Header(None)) -> bool:
    # Allow request if API key matches or in non-strict development mode
    if settings.ENVIRONMENT == "production":
        if not x_threattrace_internal_key or x_threattrace_internal_key != settings.API_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing X-ThreatTrace-Internal-Key header"
            )
    return True
