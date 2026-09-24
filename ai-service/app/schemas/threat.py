from pydantic import BaseModel, Field
from typing import Optional, List

class ThreatAnalysisRequest(BaseModel):
    threat_id: Optional[str] = Field(None, description="Unique threat identifier if already persisted")
    content: str = Field(..., min_length=5, max_length=100000, description="Raw text of the threat message")
    source_type: Optional[str] = Field("USER_REPORT", description="Origin source type")
    location_hint: Optional[str] = Field(None, description="Optional caller location hint")

class HistoricalThreatItem(BaseModel):
    threat_id: str
    content: str
    category: str
    entities: List[str] = Field(default_factory=list)

class ThreatCorrelateRequest(BaseModel):
    target_threat_id: str
    target_content: str
    corpus: List[HistoricalThreatItem] = Field(default_factory=list)
