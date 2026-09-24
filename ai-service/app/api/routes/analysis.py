from fastapi import APIRouter, Depends
from app.schemas.threat import ThreatAnalysisRequest, ThreatCorrelateRequest
from app.schemas.analysis import ThreatAnalysisResponse, CorrelationResponse
from app.services.analyzer import threat_analyzer
from app.pipelines.correlation import correlate_with_corpus
from app.api.dependencies import require_api_key

router = APIRouter(prefix="/api/v1", tags=["Threat Intelligence Analysis"])

@router.post("/analyze", response_model=ThreatAnalysisResponse, dependencies=[Depends(require_api_key)])
def analyze_threat(request: ThreatAnalysisRequest):
    return threat_analyzer.analyze(request)

@router.post("/correlate", response_model=CorrelationResponse, dependencies=[Depends(require_api_key)])
def correlate_threat(request: ThreatCorrelateRequest):
    matches = correlate_with_corpus(
        target_text=request.target_content,
        target_entities=[],
        corpus=request.corpus
    )
    return CorrelationResponse(
        target_threat_id=request.target_threat_id,
        correlations=matches
    )
