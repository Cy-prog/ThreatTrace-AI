# ==============================================================================
# ThreatTrace AI — Platform Health & Readiness Check (PowerShell)
# ==============================================================================
param (
    [string]$BackendUrl = "http://localhost:8080",
    [string]$AiUrl = "http://localhost:8000",
    [string]$FrontendUrl = "http://localhost:5173"
)

$ErrorActionPreference = "Continue"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " ThreatTrace AI — Service Health Verification (PowerShell)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$allHealthy = $true

# 1. AI Service
Write-Host "[1/3] Checking AI Microservice ($AiUrl/health)..." -NoNewline
try {
    $res = Invoke-RestMethod -Uri "$AiUrl/health" -Method Get -TimeoutSec 3
    Write-Host " ONLINE (200 OK) -> Status: $($res.status)" -ForegroundColor Green
} catch {
    Write-Host " OFFLINE or UNREACHABLE ($($_.Exception.Message))" -ForegroundColor Red
    $allHealthy = $false
}

# 2. Backend Spring Boot Service
Write-Host "[2/3] Checking Backend Spring Boot ($BackendUrl/actuator/health)..." -NoNewline
try {
    $res = Invoke-RestMethod -Uri "$BackendUrl/actuator/health" -Method Get -TimeoutSec 3
    Write-Host " ONLINE (200 OK) -> Status: $($res.status)" -ForegroundColor Green
} catch {
    try {
        # Check login endpoint
        $res = Invoke-WebRequest -Uri "$BackendUrl/api/v1/auth/login" -Method Post -Body "{}" -ContentType "application/json" -TimeoutSec 3
        Write-Host " ONLINE (HTTP $($res.StatusCode))" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -in 400, 401) {
            Write-Host " ONLINE (Core API reachable, HTTP $($_.Exception.Response.StatusCode.value__))" -ForegroundColor Green
        } else {
            Write-Host " OFFLINE or UNREACHABLE ($($_.Exception.Message))" -ForegroundColor Red
            $allHealthy = $false
        }
    }
}

# 3. Frontend Web Service
Write-Host "[3/3] Checking Frontend UI ($FrontendUrl)..." -NoNewline
try {
    $res = Invoke-WebRequest -Uri $FrontendUrl -Method Get -TimeoutSec 3
    Write-Host " ONLINE (HTTP $($res.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host " WARNING (Not yet started or non-standard port)" -ForegroundColor Yellow
}

Write-Host "======================================================================" -ForegroundColor Cyan
if ($allHealthy) {
    Write-Host "All primary ThreatTrace services are healthy and operational!" -ForegroundColor Green
} else {
    Write-Host "One or more core services failed health verification." -ForegroundColor Yellow
}
Write-Host "======================================================================" -ForegroundColor Cyan
