#!/usr/bin/env python3
"""
ThreatTrace AI — Offline Evaluation & Metric Scoring Script
Computes Macro F1, Precision, Recall, and Per-Class Confusion Metrics.
"""

from sklearn.metrics import classification_report, f1_score
from train_classifier import DATASET, Pipeline, TfidfVectorizer, LogisticRegression

def evaluate():
    texts = [d[0] for d in DATASET]
    labels = [d[1] for d in DATASET]

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), stop_words='english')),
        ('clf', LogisticRegression(C=5.0, max_iter=500, class_weight='balanced'))
    ])

    pipeline.fit(texts, labels)
    preds = pipeline.predict(texts)

    print("\n--- ThreatTrace AI Model Evaluation Report ---")
    print(classification_report(labels, preds, zero_division=0))
    macro_f1 = f1_score(labels, preds, average='macro', zero_division=0)
    print(f"Overall Macro F1 Score: {macro_f1:.4f}\n")

if __name__ == "__main__":
    evaluate()
