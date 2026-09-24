from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from app.schemas.entities import ExtractedEntity, ThreatIndicator

class SignalBreakdownItem(BaseModel):
    signal: str
    points: int
    detail: str

class ThreatAnalysisResponse(BaseModel):
    threat_id: Optional[str] = None
    detected_language: str = "en"
    predicted_category: str
    confidence: float
    category_probabilities: Dict[str, float] = Field(default_factory=dict)
    risk_score: int
    severity: str
    sentiment_label: str
    sentiment_score: float
    urgency_score: float
    explanation_summary: str
    signal_breakdown: List[SignalBreakdownItem] = Field(default_factory=list)
    entities: List[ExtractedEntity] = Field(default_factory=list)
    indicators: List[ThreatIndicator] = Field(default_factory=list)
    model_name: str
    model_version: str
    human_review_required: bool = True

class CorrelationMatch(BaseModel):
    threat_id: str
    similarity_score: float
    shared_entities: List[str] = Field(default_factory=list)
    correlation_reason: str

class CorrelationResponse(BaseModel):
    target_threat_id: str
    correlations: List[CorrelationMatch] = Field(default_factory=list)

class ModelMetadataResponse(BaseModel):
    model_name: str
    model_version: str
    model_type: str
    training_dataset: str
    evaluation_metrics: Dict[str, Any]
    status: str
