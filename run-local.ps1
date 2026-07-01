$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm introuvable. Installez Node.js puis reessayez."
}

Write-Host "Installation des dependances (root + workspaces)..."
npm install

Write-Host "Demarrage en mode local (frontend + backend)..."
npm run dev
