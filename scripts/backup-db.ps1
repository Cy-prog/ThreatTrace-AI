# ==============================================================================
# ThreatTrace AI — PostgreSQL Backup Script (PowerShell)
# ==============================================================================
param (
    [string]$BackupDir = "./backups",
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432,
    [string]$DbName = "threattrace",
    [string]$DbUser = "threattrace_user",
    [string]$DbPass = "threattrace_secure_pass_2026",
    [int]$RetentionDays = 7
)

$ErrorActionPreference = "Stop"

if (!(Test-Path -Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path -Path $BackupDir -ChildPath "threattrace_backup_$timestamp.sql"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " ThreatTrace AI — PostgreSQL Database Backup (PowerShell)" -ForegroundColor Cyan
Write-Host " Host: $DbHost:$DbPort | Database: $DbName | User: $DbUser" -ForegroundColor Cyan
Write-Host " Destination: $backupFile" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$hasPgDump = (Get-Command pg_dump -ErrorAction SilentlyContinue)

if ($hasPgDump) {
    Write-Host "[*] Executing pg_dump..." -NoNewline
    $env:PGPASSWORD = $DbPass
    & pg_dump -h $DbHost -p $DbPort -U $DbUser -d $DbName --format=plain --no-owner --no-privileges -f $backupFile
    Write-Host " DONE" -ForegroundColor Green
} else {
    Write-Host "[*] Looking for docker container 'threattrace-db'..." -NoNewline
    $dockerOut = docker ps --filter "name=threattrace-db" --format "{{.Names}}"
    if ($dockerOut -match "threattrace-db") {
        docker exec -t threattrace-db pg_dump -U $DbUser -d $DbName > $backupFile
        Write-Host " DONE (via Docker)" -ForegroundColor Green
    } else {
        Write-Host " FAILED! Neither local pg_dump nor threattrace-db container was found." -ForegroundColor Red
        exit 1
    }
}

Write-Host "[*] Database backup written to: $backupFile" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
