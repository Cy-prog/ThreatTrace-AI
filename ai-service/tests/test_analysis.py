from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"

def test_analyze_pipeline_endpoint():
    payload = {
        "threat_id": "test-thr-001",
        "content": "Explosive charges planted at Central Metro Station Chicago. Detonation tomorrow at 9:00 AM.",
        "source_type": "EMAIL"
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_category"] == "BOMB_THREAT"
    assert data["risk_score"] >= 80
    assert data["severity"] == "CRITICAL"
    assert len(data["entities"]) > 0
    assert len(data["signal_breakdown"]) > 0
    assert data["human_review_required"] is True

def test_models_registry_endpoint():
    response = client.get("/api/v1/models")
    assert response.status_code == 200
    models = response.json()
    assert len(models) >= 3
