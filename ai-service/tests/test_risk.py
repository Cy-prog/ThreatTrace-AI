import pytest
from app.pipelines.risk_scoring import calculate_risk_score
from app.schemas.entities import ExtractedEntity, ThreatIndicator

def test_risk_scoring_critical_bomb_threat():
    entities = [
        ExtractedEntity(entity_type="FACILITY", entity_value="Station Alpha", confidence=0.95, start_offset=0, end_offset=13, source_span="Station Alpha"),
        ExtractedEntity(entity_type="LOCATION", entity_value="Chicago", confidence=0.98, start_offset=14, end_offset=21, source_span="Chicago"),
        ExtractedEntity(entity_type="TIME", entity_value="tomorrow", confidence=0.90, start_offset=22, end_offset=30, source_span="tomorrow")
    ]
    indicators = [
        ThreatIndicator(indicator_type="WEAPON_REFERENCE", label="Explosive marker", weight=0.95, evidence_snippet="bomb"),
        ThreatIndicator(indicator_type="IMMINENCE_SIGNAL", label="Imminent horizon", weight=0.88, evidence_snippet="tomorrow")
    ]

    score, severity, breakdown = calculate_risk_score(
        category="BOMB_THREAT",
        confidence=0.95,
        entities=entities,
        indicators=indicators,
        urgency_score=0.90
    )

    assert score >= 80, f"Expected critical score, got {score}"
    assert severity == "CRITICAL"
    assert len(breakdown) > 0
    total_breakdown_pts = sum(b.points for b in breakdown)
    assert score == min(100, total_breakdown_pts)

def test_risk_scoring_benign_report():
    score, severity, breakdown = calculate_risk_score(
        category="NON_THREAT",
        confidence=0.95,
        entities=[],
        indicators=[],
        urgency_score=0.0
    )

    assert score < 35
    assert severity == "LOW"
