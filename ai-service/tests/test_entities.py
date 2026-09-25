import pytest
from app.models.ner_model import ThreatNERModel

def test_extract_entities_accuracy_and_spans():
    ner = ThreatNERModel()
    text = "Assault scheduled at Central Metro Station in Chicago tomorrow at 9:00 AM. Send BTC to bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh or check https://leak.onion/proof"
    entities = ner.extract_entities(text)

    entity_types = [e.entity_type for e in entities]
    assert "FACILITY" in entity_types
    assert "LOCATION" in entity_types
    assert "TIME" in entity_types
    assert "CRYPTO_WALLET" in entity_types
    assert "URL" in entity_types

    # Verify that source spans match text exactly
    for e in entities:
        assert text[e.start_offset:e.end_offset] == e.source_span
        assert e.confidence > 0.8
