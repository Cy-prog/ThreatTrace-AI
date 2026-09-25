# ThreatTrace AI — Intelligence Microservice

FastAPI microservice providing real-time natural language threat intelligence, entity extraction, indicator detection, and risk scoring.

## Features
- **Threat Classifier**: TF-IDF + Logistic Regression / Naive Bayes ensemble for multi-class threat taxonomy.
- **Named Entity Recognition**: Regex & linguistic extraction of facilities, locations, dates/times, URLs, and crypto wallets.
- **Indicator Detection**: Threat vectors, attack tactics, and suspicious keyword detection with bounded non-backtracking regular expressions.
- **Risk Scoring**: Transparent multi-signal weighted scoring (0-100) calibrated across keyword severity, target specificity, urgency, and sentiment.

## Running Tests
```bash
python -m pytest tests -v
```
