from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.schemas.threat import HistoricalThreatItem
from app.schemas.analysis import CorrelationMatch

def correlate_with_corpus(
    target_text: str,
    target_entities: List[str],
    corpus: List[HistoricalThreatItem]
) -> List[CorrelationMatch]:
    if not corpus:
        return []

    matches: List[CorrelationMatch] = []
    corpus_texts = [item.content for item in corpus]
    all_texts = [target_text] + corpus_texts

    # Calculate TF-IDF Cosine Similarity
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        sim_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
    except Exception:
        sim_scores = [0.0] * len(corpus)

    target_ents_set = set(e.lower() for e in target_entities)

    for idx, item in enumerate(corpus):
        sim = float(sim_scores[idx]) if idx < len(sim_scores) else 0.0
        shared = [e for e in item.entities if e.lower() in target_ents_set]

        # Multi-factor correlation score
        composite_score = sim * 0.55 + (min(1.0, len(shared) * 0.25) * 0.45)
        composite_score = round(min(0.99, composite_score), 3)

        if composite_score >= 0.40 or len(shared) > 0:
            reasons = []
            if sim >= 0.45:
                reasons.append(f"Semantic similarity: {int(sim * 100)}%")
            if shared:
                reasons.append(f"Shared entities ({len(shared)}): {', '.join(shared[:2])}")

            reason_str = " | ".join(reasons) if reasons else "Tactical pattern overlap"

            matches.append(CorrelationMatch(
                threat_id=item.threat_id,
                similarity_score=composite_score,
                shared_entities=shared,
                correlation_reason=reason_str
            ))

    return sorted(matches, key=lambda m: m.similarity_score, reverse=True)
