$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker introuvable dans le PATH."
}

$composeFile = Join-Path $PSScriptRoot 'docker/docker-compose.yml'
if (-not (Test-Path $composeFile)) {
    Write-Error "Fichier introuvable: $composeFile"
}

function Invoke-Compose {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Args
    )

    try {
        & docker compose -f $composeFile @Args
    }
    catch {
        & docker-compose -f $composeFile @Args
    }
}

Write-Host "Arret des containers existants (si presents)..."
Invoke-Compose down

Write-Host "Build et demarrage des services Docker..."
Invoke-Compose up -d --build

Write-Host "Services demarres."
Write-Host "Frontend: http://localhost:3000"
Write-Host "API:      http://localhost:3001"
