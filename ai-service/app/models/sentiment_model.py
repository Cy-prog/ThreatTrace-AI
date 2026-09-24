import re
from typing import Tuple
from textblob import TextBlob

AGGRESSION_KEYWORDS = [
    "kill", "murder", "destroy", "detonate", "annihilate", "retaliation",
    "blood", "die", "assault", "strike", "eliminate", "slaughter", "payback"
]

URGENCY_KEYWORDS = [
    "immediately", "now", "tonight", "tomorrow", "deadline", "urgent",
    "hours", "seconds", "minutes", "countdown", "expire", "without warning"
]

class ThreatSentimentModel:
    def analyze(self, text: str) -> Tuple[str, float, float]:
        blob = TextBlob(text)
        polarity = round(blob.sentiment.polarity, 3)

        lower = text.lower()
        
        # Calculate Aggression signal
        aggression_count = sum(1 for kw in AGGRESSION_KEYWORDS if kw in lower)
        aggression_score = min(1.0, round(aggression_count * 0.25, 2))

        # Calculate Urgency signal
        urgency_count = sum(1 for kw in URGENCY_KEYWORDS if kw in lower)
        urgency_score = min(1.0, round(urgency_count * 0.30, 2))

        # Label determination
        if aggression_score >= 0.5 or polarity <= -0.4:
            label = "HOSTILE"
        elif polarity < -0.1:
            label = "NEGATIVE"
        elif polarity > 0.2:
            label = "POSITIVE"
        else:
            label = "NEUTRAL"

        return label, polarity, urgency_score
