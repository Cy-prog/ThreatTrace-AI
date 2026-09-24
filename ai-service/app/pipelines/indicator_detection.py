import re
from typing import List
from app.schemas.entities import ThreatIndicator

def _snippet(text: str, start: int, end: int, window: int = 35) -> str:
    s = max(0, start - window)
    e = min(len(text), end + window)
    prefix = "..." if s > 0 else ""
    suffix = "..." if e < len(text) else ""
    return prefix + text[s:e].strip() + suffix

def detect_indicators(text: str) -> List[ThreatIndicator]:
    indicators: List[ThreatIndicator] = []
    lower = text.lower()

    # 1. WEAPON_REFERENCE
    weapon_m = re.search(r'\b(bomb|explosive|detonate|ied|pipe bomb|ar-15|rifle|gun|glock|knife|blade|toxic|chemical)\b', lower)
    if weapon_m:
        indicators.append(ThreatIndicator(
            indicator_type="WEAPON_REFERENCE",
            label="Lethal Weapon / Explosive Device Reference",
            weight=0.95,
            evidence_snippet=_snippet(text, weapon_m.start(), weapon_m.end())
        ))

    # 2. THREAT_LANGUAGE
    threat_m = re.search(r'\b(kill|murder|assault|eliminate|destroy|slaughter|retaliation|there will be blood)\b', lower)
    if threat_m:
        indicators.append(ThreatIndicator(
            indicator_type="THREAT_LANGUAGE",
            label="Direct Violent Intent Rhetoric",
            weight=0.90,
            evidence_snippet=_snippet(text, threat_m.start(), threat_m.end())
        ))

    # 3. DEMAND_LANGUAGE
    demand_m = re.search(r'\b(if\s+.*not\s+transferred|pay\s+.*\b(btc|bitcoin|\$|ransom)|wire funds|or else|ransom demand)\b', lower)
    if demand_m:
        indicators.append(ThreatIndicator(
            indicator_type="DEMAND_LANGUAGE",
            label="Coercive Ransom / Extortion Ultimatums",
            weight=0.88,
            evidence_snippet=_snippet(text, demand_m.start(), demand_m.end())
        ))

    # 4. IMMINENCE_SIGNAL
    imminent_m = re.search(r'\b(tomorrow|tonight|within\s+\d+\s+hours|at\s+\d{1,2}:\d{2}|deadline|countdown|without.*warning)\b', lower)
    if imminent_m:
        indicators.append(ThreatIndicator(
            indicator_type="IMMINENCE_SIGNAL",
            label="Narrow Temporal Action Horizon",
            weight=0.85,
            evidence_snippet=_snippet(text, imminent_m.start(), imminent_m.end())
        ))

    # 5. TARGET_REFERENCE
    target_m = re.search(r'\b(target\s+confirmed|targeting|headquarters|station|metro|plant|office|executives?)\b', lower)
    if target_m:
        indicators.append(ThreatIndicator(
            indicator_type="TARGET_REFERENCE",
            label="Explicit Organizational / Physical Target",
            weight=0.82,
            evidence_snippet=_snippet(text, target_m.start(), target_m.end())
        ))

    # 6. LOCATION_REFERENCE
    loc_m = re.search(r'\b(in\s+[A-Z][a-z]+|at\s+[A-Z][a-z]+|\d+\s+[A-Za-z]+\s+Avenue|chicago|new york|seattle|frankfurt)\b', text, re.IGNORECASE)
    if loc_m:
        indicators.append(ThreatIndicator(
            indicator_type="LOCATION_REFERENCE",
            label="Explicit Geographic / Facility Anchor",
            weight=0.80,
            evidence_snippet=_snippet(text, loc_m.start(), loc_m.end())
        ))

    # 7. CYBER_THREAT
    cyber_m = re.search(r'\b(malware|ransomware|zero-day|ddos|exfiltrat|scada|cobalt strike)\b', lower)
    if cyber_m:
        indicators.append(ThreatIndicator(
            indicator_type="CYBER_THREAT",
            label="Cyber Exploit / Attack Signal",
            weight=0.88,
            evidence_snippet=_snippet(text, cyber_m.start(), cyber_m.end())
        ))

    # 8. ESCALATION_SIGNAL
    escalate_m = re.search(r'\b(tracking|watching you|know where you live|syndicate|follow.*home)\b', lower)
    if escalate_m:
        indicators.append(ThreatIndicator(
            indicator_type="ESCALATION_SIGNAL",
            label="Surveillance / Stalking Escalation Marker",
            weight=0.84,
            evidence_snippet=_snippet(text, escalate_m.start(), escalate_m.end())
        ))

    return indicators
