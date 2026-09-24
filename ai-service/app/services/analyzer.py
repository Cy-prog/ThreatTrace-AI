from app.config.settings import settings
from app.pipelines.preprocessing import normalize_text, detect_language
from app.pipelines.indicator_detection import detect_indicators
from app.pipelines.risk_scoring import calculate_risk_score
from app.services.inference import inference_engine
from app.schemas.threat import ThreatAnalysisRequest
from app.schemas.analysis import ThreatAnalysisResponse

class ThreatAnalyzerService:
    def __init__(self):
        self.engine = inference_engine

    def analyze(self, request: ThreatAnalysisRequest) -> ThreatAnalysisResponse:
        # 1. Normalization & Language
        normalized = normalize_text(request.content)
        language = detect_language(normalized)

        # 2. Multi-class Threat Classification
        predicted_category, confidence, prob_distribution = self.engine.classifier.predict(normalized)

        # 3. Entity Extraction with Character Offsets
        entities = self.engine.ner.extract_entities(normalized)

        # 4. Threat Indicator Detection with Snippets
        indicators = detect_indicators(normalized)

        # 5. Sentiment & Urgency Signal Analysis
        sentiment_label, sentiment_score, urgency_score = self.engine.sentiment.analyze(normalized)

        # 6. Transparent Risk Scoring Formula
        risk_score, severity, signal_breakdown = calculate_risk_score(
            category=predicted_category,
            confidence=confidence,
            entities=entities,
            indicators=indicators,
            urgency_score=urgency_score
        )

        # 7. Explainable Assessment Summary
        target_names = [e.entity_value for e in entities if e.entity_type in ("FACILITY", "ORGANIZATION", "PERSON")]
        loc_names = [e.entity_value for e in entities if e.entity_type in ("LOCATION", "FACILITY")]
        
        summary_parts = [
            f"Automated analytical triage classified report as {predicted_category} with {int(confidence * 100)}% model confidence.",
            f"Calculated explainable Risk Score is {risk_score}/100 ({severity})."
        ]
        if target_names:
            summary_parts.append(f"Identified targets: {', '.join(target_names[:2])}.")
        if loc_names:
            summary_parts.append(f"Geographic/facility anchors: {', '.join(loc_names[:2])}.")
        if indicators:
            summary_parts.append(f"Triggered {len(indicators)} analytical indicators.")

        summary_parts.append("Final determination requires human analyst verification.")
        explanation_summary = " ".join(summary_parts)

        return ThreatAnalysisResponse(
            threat_id=request.threat_id,
            detected_language=language,
            predicted_category=predicted_category,
            confidence=confidence,
            category_probabilities=prob_distribution,
            risk_score=risk_score,
            severity=severity,
            sentiment_label=sentiment_label,
            sentiment_score=sentiment_score,
            urgency_score=urgency_score,
            explanation_summary=explanation_summary,
            signal_breakdown=signal_breakdown,
            entities=entities,
            indicators=indicators,
            model_name=settings.CLASSIFIER_MODEL_NAME,
            model_version=settings.CLASSIFIER_MODEL_VERSION,
            human_review_required=(severity in ("CRITICAL", "HIGH", "MEDIUM"))
        )

threat_analyzer = ThreatAnalyzerService()
