import re
from typing import Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import numpy as np

CATEGORIES = [
    "VIOLENT_THREAT",
    "BOMB_THREAT",
    "WEAPON_REFERENCE",
    "HARASSMENT",
    "EXTORTION",
    "STALKING",
    "CYBER_THREAT",
    "FRAUD",
    "PHISHING",
    "PUBLIC_SAFETY_THREAT",
    "SELF_HARM_SIGNAL",
    "NON_THREAT"
]

# Curated synthetic corpus to initialize and calibrate the multi-class model weights
TRAINING_SAMPLES = [
    # VIOLENT_THREAT
    ("I am going to kill you and everyone in that building", "VIOLENT_THREAT"),
    ("We will murder you if you step outside your house", "VIOLENT_THREAT"),
    ("Assault team ready to eliminate target and destroy family", "VIOLENT_THREAT"),
    ("Prepare to die today, there will be blood everywhere", "VIOLENT_THREAT"),
    
    # BOMB_THREAT
    ("There is a pipe bomb hidden in the metro station set to detonate", "BOMB_THREAT"),
    ("Explosive charges have been planted in the basement of headquarters", "BOMB_THREAT"),
    ("Detonation sequence has started, blast radius will destroy the facility", "BOMB_THREAT"),
    ("We placed IED devices at the terminal departure gates", "BOMB_THREAT"),
    
    # WEAPON_REFERENCE
    ("Purchased an AR-15 assault rifle and high capacity ammunition magazines", "WEAPON_REFERENCE"),
    ("Stockpiling Glock 19 handguns and tactical ceramic body armor plates", "WEAPON_REFERENCE"),
    ("Armed with machetes and serrated combat knives waiting outside", "WEAPON_REFERENCE"),
    
    # HARASSMENT
    ("You are pathetic garbage and nobody will ever love you, stop existing", "HARASSMENT"),
    ("Sending you abusive messages all day until you resign from your job", "HARASSMENT"),
    ("Spamming your inbox with humiliating photos and relentless insults", "HARASSMENT"),
    
    # EXTORTION
    ("Send 50 Bitcoin to my wallet within 24 hours or I release private tapes", "EXTORTION"),
    ("Pay $100,000 ransom or we leak all confidential customer records", "EXTORTION"),
    ("Wire funds immediately to avoid your company secrets being exposed", "EXTORTION"),
    
    # STALKING
    ("I know what car you drive and saw you walking your dog at 7 PM", "STALKING"),
    ("Watching your window right now from across the street in my black sedan", "STALKING"),
    ("Followed you home from work today, your front door lock looks fragile", "STALKING"),
    
    # CYBER_THREAT
    ("All company files encrypted with ransomware, ransom key costs 10 BTC", "CYBER_THREAT"),
    ("Launching 500 Gbps DDoS attack against your web banking APIs", "CYBER_THREAT"),
    ("Exfiltrating internal SCADA blueprints using zero-day exploit payload", "CYBER_THREAT"),
    ("Deploying cobalt strike beacon across your active directory domain", "CYBER_THREAT"),
    
    # FRAUD
    ("Your tax refund is ready, enter your bank account and SSN immediately", "FRAUD"),
    ("Guaranteed 400% return on crypto investment in 3 days, wire funds", "FRAUD"),
    ("Urgent invoice payment request, please send money to overseas account", "FRAUD"),
    
    # PHISHING
    ("Your Microsoft 365 session has expired. Click here to login: http://fake-login.com", "PHISHING"),
    ("Security alert: Unauthorized access detected. Verify your password now", "PHISHING"),
    ("Google workspace urgent alert: reset your credentials immediately at link", "PHISHING"),
    
    # PUBLIC_SAFETY_THREAT
    ("Contaminating the municipal water reservoir with toxic chemical agents", "PUBLIC_SAFETY_THREAT"),
    ("Targeting electrical power grid sub-stations to cause total city blackout", "PUBLIC_SAFETY_THREAT"),
    ("Sabotaging railway tracks during morning commuter rush hour", "PUBLIC_SAFETY_THREAT"),
    
    # SELF_HARM_SIGNAL
    ("I cannot take this pain anymore, goodbye cruel world, ending my life tonight", "SELF_HARM_SIGNAL"),
    ("Thinking about swallowing all these pills and never waking up again", "SELF_HARM_SIGNAL"),
    ("I want to end it all, there is no hope left for me", "SELF_HARM_SIGNAL"),
    
    # NON_THREAT
    ("Meeting scheduled for Thursday afternoon at 2 PM in conference room B", "NON_THREAT"),
    ("Please review the attached quarterly earnings financial report", "NON_THREAT"),
    ("System backup finished successfully with zero errors detected", "NON_THREAT"),
    ("Let us grab lunch together tomorrow around noon at the cafeteria", "NON_THREAT"),
    ("Automated notification: software patch applied to server cluster", "NON_THREAT")
]

class ThreatClassifier:
    def __init__(self):
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1, stop_words='english')),
            ('clf', LogisticRegression(C=5.0, max_iter=500, class_weight='balanced'))
        ])
        self._train_initial_model()

    def _train_initial_model(self):
        texts = [sample[0] for sample in TRAINING_SAMPLES]
        labels = [sample[1] for sample in TRAINING_SAMPLES]
        self.pipeline.fit(texts, labels)

    def predict(self, text: str) -> Tuple[str, float, Dict[str, float]]:
        cleaned = text.strip()
        if len(cleaned) < 5:
            return "UNKNOWN", 0.50, {c: 0.08 for c in CATEGORIES}

        probs = self.pipeline.predict_proba([cleaned])[0]
        classes = self.pipeline.classes_
        prob_dict = {str(c): float(p) for c, p in zip(classes, probs)}

        # Keyword heuristics boost for high-consequence edge cases
        lower = cleaned.lower()
        if any(w in lower for w in ["bomb", "explosive", "detonate", "ied", "blast radius"]):
            target_class = "BOMB_THREAT"
        elif any(w in lower for w in ["kill", "murder", "assault team", "prepare to die", "eliminate target"]):
            target_class = "VIOLENT_THREAT"
        elif any(w in lower for w in ["ransomware", "zero-day", "exfiltrat", "scada", "ddos"]):
            target_class = "CYBER_THREAT"
        elif any(w in lower for w in ["btc", "bitcoin", "ransom", "wire funds or else"]):
            target_class = "EXTORTION"
        elif any(w in lower for w in ["meeting", "lunch", "backup", "patch", "schedule"]):
            target_class = "NON_THREAT"
        else:
            target_class = None

        if target_class:
            for k in prob_dict:
                if k != target_class:
                    prob_dict[k] = prob_dict[k] * 0.1
            prob_dict[target_class] = max(prob_dict.get(target_class, 0.0), 0.85)

        # Re-normalize
        total = sum(prob_dict.values())
        prob_dict = {k: round(v / total, 4) for k, v in prob_dict.items()}

        top_category = max(prob_dict.items(), key=lambda x: x[1])
        return top_category[0], top_category[1], prob_dict
