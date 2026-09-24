# ==============================================================================
# ThreatTrace AI — Synthetic Demo Threat Intelligence Seeder (PowerShell)
# Ingests realistic threat signals into the running ThreatTrace backend.
# ==============================================================================
param (
    [string]$BackendUrl = "http://localhost:8080",
    [string]$Username = "admin",
    [string]$Password = "Admin@ThreatTrace2026!"
)

$ErrorActionPreference = "Stop"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " ThreatTrace AI — Threat Intelligence Ingestion Seeder (PowerShell)" -ForegroundColor Cyan
Write-Host " Target Backend: $BackendUrl" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

Write-Host "[*] Authenticating as '$Username'..." -NoNewline
$loginBody = @{
    username = $Username
    password = $Password
} | ConvertTo-Json

try {
    $loginRes = Invoke-RestMethod -Uri "$BackendUrl/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.token
    Write-Host " SUCCESS (JWT acquired)" -ForegroundColor Green
} catch {
    Write-Host " FAILED!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

function Ingest-Threat {
    param (
        [string]$Title,
        [string]$Source,
        [string]$SourceRef,
        [string]$Content,
        [string]$Location
    )

    Write-Host "[+] Ingesting: '$Title'..." -NoNewline
    $body = @{
        title = $Title
        source = $Source
        sourceReference = $SourceRef
        rawContent = $Content
        location = $Location
    } | ConvertTo-Json

    try {
        $res = Invoke-RestMethod -Uri "$BackendUrl/api/v1/threats/ingest" -Method Post -Body $body -Headers $headers
        Write-Host " INGESTED (ID: $($res.id.Substring(0, 8))..., Risk: $($res.riskScore))" -ForegroundColor Green
    } catch {
        Write-Host " FAILED ($($_.Exception.Message))" -ForegroundColor Yellow
    }
}

Write-Host "`n--- INGESTING DIVERSE THREAT DOMAIN SIGNALS ---" -ForegroundColor Cyan

Ingest-Threat -Title "Improvised Explosive Device Warning — Central Railway Terminus" `
              -Source "Dark Web Monitor" `
              -SourceRef "TOR-FORUM-NODE-891" `
              -Content "IED bomb placed in central railway station terminal locker 44. Detonation set for 18:00 UTC today. Evacuate immediately or suffer casualties." `
              -Location "Central Railway Station, New York"

Ingest-Threat -Title "SCADA Telemetry Disruption & Ransomware Demand — Regional Power Substation" `
              -Source "SIGINT Feed" `
              -SourceRef "CERT-ADVISORY-2026-99" `
              -Content "We have penetrated substation 4 SCADA telemetry controls. Blackout protocol will initiate within 3 hours unless 50 BTC ransom is transferred to wallet bc1qthreat994827." `
              -Location "Substation 4 Grid, Chicago, IL"

Ingest-Threat -Title "Active Shooter Threat Target — Metropolitan University Campus" `
              -Source "Social Media Scraping" `
              -SourceRef "TELEGRAM-CHAN-SEC404" `
              -Content "Bringing an assault rifle to the university science hall at 14:00 today. Everyone will pay for what they did. Stand back or get eliminated." `
              -Location "Metropolitan University, Boston, MA"

Ingest-Threat -Title "Aerosolized Biological Agent Dispersal Claim — Airport Terminal 3" `
              -Source "Anonymous Tip Line" `
              -SourceRef "TIP-INTEL-2026-883" `
              -Content "Ricin and weaponized anthrax spores aerosolized through HVAC vent system at Terminal 3 international departure lounge. Fatal dispersion active." `
              -Location "International Airport Terminal 3, Los Angeles, CA"

Ingest-Threat -Title "Synthetic Deepfake Disinformation Campaign — Election Voting Machines" `
              -Source "OSINT Feed" `
              -SourceRef "TWITTER-ANALYTICS-X4" `
              -Content "Coordinated disinformation cluster deploying AI deepfake audio claiming municipal ballot machines in district 7 have been corrupted and offline." `
              -Location "District 7 Election Center, Philadelphia, PA"

Ingest-Threat -Title "Routine Infrastructure Fire Suppression Drill — Municipal Datacenter" `
              -Source "Public Safety Wire" `
              -SourceRef "FDNY-SCHEDULE-2026-04" `
              -Content "Scheduled annual fire alarm, halon suppression testing, and building evacuation exercise at Municipal Datacenter tomorrow morning between 09:00 and 11:00 EST. Benign routine test." `
              -Location "Municipal Datacenter, Brooklyn, NY"

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host " Threat intelligence seed ingestion completed successfully!" -ForegroundColor Green
Write-Host " Navigate to the UI or call GET /api/v1/threats to review signals." -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
