from pydantic import BaseModel, Field
from typing import Optional

class ExtractedEntity(BaseModel):
    entity_type: str = Field(..., description="PERSON, ORGANIZATION, LOCATION, FACILITY, DATE, TIME, PHONE, EMAIL, URL, VEHICLE, EVENT")
    entity_value: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    start_offset: int
    end_offset: int
    source_span: str

class ThreatIndicator(BaseModel):
    indicator_type: str = Field(..., description="THREAT_LANGUAGE, TARGET_REFERENCE, TEMPORAL_REFERENCE, LOCATION_REFERENCE, WEAPON_REFERENCE, DEMAND_LANGUAGE, IMMINENCE_SIGNAL, REPEATED_CONTACT, ESCALATION_SIGNAL")
    label: str
    weight: float = Field(..., ge=0.0, le=1.0)
    evidence_snippet: str
