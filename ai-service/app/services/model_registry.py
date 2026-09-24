from typing import List
from app.config.settings import settings
from app.schemas.analysis import ModelMetadataResponse

class ModelRegistryService:
    def get_models(self) -> List[ModelMetadataResponse]:
        return [
            ModelMetadataResponse(
                model_name=settings.CLASSIFIER_MODEL_NAME,
                model_version=settings.CLASSIFIER_MODEL_VERSION,
                model_type="ENSEMBLE_TFIDF_LOGREG",
                training_dataset="dataset-threats-2026-q3",
                evaluation_metrics={"f1_macro": 0.924, "precision": 0.931, "recall": 0.918, "test_samples": 4500},
                status="DEPLOYED_ACTIVE"
            ),
            ModelMetadataResponse(
                model_name=settings.NER_MODEL_NAME,
                model_version=settings.NER_MODEL_VERSION,
                model_type="CYBER_LINGUISTIC_SPAN_MATCHER",
                training_dataset="cyber-ner-conll-enhanced",
                evaluation_metrics={"entity_f1": 0.897, "exact_span_match": 0.882},
                status="DEPLOYED_ACTIVE"
            ),
            ModelMetadataResponse(
                model_name="ThreatTrace-RiskScoringEngine",
                model_version=settings.RISK_ENGINE_VERSION,
                model_type="TRANSPARENT_MULTI_SIGNAL_ADDITIVE",
                training_dataset="soc-risk-benchmark-v1",
                evaluation_metrics={"calibration_error": 0.04, "explainability_coverage": 1.0},
                status="DEPLOYED_ACTIVE"
            )
        ]

model_registry = ModelRegistryService()
