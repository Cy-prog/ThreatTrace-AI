from app.models.classifier import ThreatClassifier
from app.models.ner_model import ThreatNERModel
from app.models.sentiment_model import ThreatSentimentModel

class InferenceEngine:
    _instance = None

    def __init__(self):
        self.classifier = ThreatClassifier()
        self.ner = ThreatNERModel()
        self.sentiment = ThreatSentimentModel()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

inference_engine = InferenceEngine.get_instance()
