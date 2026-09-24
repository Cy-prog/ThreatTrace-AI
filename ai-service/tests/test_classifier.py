import pytest
from app.models.classifier import ThreatClassifier

def test_classifier_bomb_threat():
    classifier = ThreatClassifier()
    category, confidence, probs = classifier.predict("A pipe bomb has been planted in the metro station and will detonate")
    assert category == "BOMB_THREAT"
    assert confidence > 0.80
    assert "BOMB_THREAT" in probs

def test_classifier_violent_threat():
    classifier = ThreatClassifier()
    category, confidence, probs = classifier.predict("We are going to kill and murder the CEO at headquarters")
    assert category == "VIOLENT_THREAT"
    assert confidence > 0.75

def test_classifier_non_threat():
    classifier = ThreatClassifier()
    category, confidence, probs = classifier.predict("Meeting scheduled for Thursday at 2 PM in the main conference room")
    assert category == "NON_THREAT"
    assert confidence > 0.60
