from typing import List, Tuple
from app.schemas.analysis import SignalBreakdownItem
from app.schemas.entities import ExtractedEntity, ThreatIndicator

CATEGORY_WEIGHTS = {
    "BOMB_THREAT": 35,
    "VIOLENT_THREAT": 30,
    "CYBER_THREAT": 25,
    "PUBLIC_SAFETY_THREAT": 25,
    "EXTORTION": 22,
    "STALKING": 20,
    "WEAPON_REFERENCE": 20,
    "HARASSMENT": 15,
    "FRAUD": 10,
    "PHISHING": 8,
    "SELF_HARM_SIGNAL": 20,
    "NON_THREAT": 0,
    "UNKNOWN": 10
}

def calculate_risk_score(
    category: str,
    confidence: float,
    entities: List[ExtractedEntity],
    indicators: List[ThreatIndicator],
    urgency_score: float
) -> Tuple[int, str, List[SignalBreakdownItem]]:
    breakdown: List[SignalBreakdownItem] = []
    total_score = 0

    # 1. Base Threat Category Weight
    base_weight = CATEGORY_WEIGHTS.get(category, 10)
    if base_weight > 0:
        total_score += base_weight
        breakdown.append(SignalBreakdownItem(
            signal=f"Threat Classification ({category})",
            points=base_weight,
            detail=f"Base risk for detected category {category}"
        ))

    # 2. Model Confidence Weight (up to +10 pts)
    if confidence >= 0.75:
        conf_points = int(confidence * 10)
        total_score += conf_points
        breakdown.append(SignalBreakdownItem(
            signal="Model High Confidence",
            points=conf_points,
            detail=f"Classification confidence of {int(confidence * 100)}%"
        ))

    # 3. Explicit Target Named (+15 pts)
    target_entities = [e for e in entities if e.entity_type in ("FACILITY", "ORGANIZATION", "PERSON")]
    if target_entities:
        total_score += 15
        val = target_entities[0].entity_value
        breakdown.append(SignalBreakdownItem(
            signal="Explicit Target Reference",
            points=15,
            detail=f"Named entity target identified: {val}"
        ))

    # 4. Explicit Location / Facility Anchor (+12 pts)
    loc_entities = [e for e in entities if e.entity_type in ("LOCATION", "FACILITY")]
    if loc_entities:
        total_score += 12
        loc_val = loc_entities[0].entity_value
        breakdown.append(SignalBreakdownItem(
            signal="Specific Location Anchor",
            points=12,
            detail=f"Identified physical location: {loc_val}"
        ))

    # 5. Temporal Imminence (+14 pts)
    time_entities = [e for e in entities if e.entity_type in ("DATE", "TIME")]
    has_imminence_ind = any(i.indicator_type == "IMMINENCE_SIGNAL" for i in indicators)
    if time_entities or has_imminence_ind:
        total_score += 14
        breakdown.append(SignalBreakdownItem(
            signal="Temporal Specificity & Imminence",
            points=14,
            detail="Narrow operational timeframe or explicit deadline identified"
        ))

    # 6. Lethal Weapon / Explosive Reference (+12 pts)
    has_weapon = any(i.indicator_type == "WEAPON_REFERENCE" for i in indicators)
    if has_weapon:
        total_score += 12
        breakdown.append(SignalBreakdownItem(
            signal="Weapon / Hazardous Payload",
            points=12,
            detail="Reference to firearms, explosive charges, or biological agents"
        ))

    # 7. Extortion & Demand Language (+10 pts)
    has_demand = any(i.indicator_type == "DEMAND_LANGUAGE" for i in indicators)
    if has_demand:
        total_score += 10
        breakdown.append(SignalBreakdownItem(
            signal="Coercive Demands / Ransom",
            points=10,
            detail="Ultimatum or financial ransom demand present"
        ))

    # 8. High Emotional Urgency Signal (+6 pts)
    if urgency_score >= 0.70:
        total_score += 6
        breakdown.append(SignalBreakdownItem(
            signal="High Emotional Urgency Signal",
            points=6,
            detail=f"Urgency score index {int(urgency_score * 100)}%"
        ))

    # Guard against benign non-threat score inflation
    if category == "NON_THREAT" and not has_weapon and not has_demand:
        final_score = min(15, total_score)
        severity = "LOW"
    else:
        # Floor and Cap between 0 and 100
        final_score = max(0, min(100, total_score))

        # Determine Severity Tier
        if final_score >= 80:
            severity = "CRITICAL"
        elif final_score >= 60:
            severity = "HIGH"
        elif final_score >= 35:
            severity = "MEDIUM"
        else:
            severity = "LOW"

    return final_score, severity, breakdown
