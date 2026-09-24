from fastapi import APIRouter
from typing import List
from app.schemas.analysis import ModelMetadataResponse
from app.services.model_registry import model_registry

router = APIRouter(prefix="/api/v1/models", tags=["Model Intelligence Registry"])

@router.get("", response_model=List[ModelMetadataResponse])
def get_deployed_models():
    return model_registry.get_models()
