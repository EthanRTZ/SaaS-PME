@echo off
setlocal

cd /d "%~dp0"

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker introuvable dans le PATH.
  exit /b 1
)

if not exist "docker\docker-compose.yml" (
  echo Fichier introuvable: docker\docker-compose.yml
  exit /b 1
)

echo Arret des containers existants (si presents)...
docker compose -f docker\docker-compose.yml down
if errorlevel 1 (
  echo Echec avec 'docker compose'. Tentative avec 'docker-compose'...
  docker-compose -f docker\docker-compose.yml down || exit /b 1
)

echo Build et demarrage des services Docker...
docker compose -f docker\docker-compose.yml up -d --build
if errorlevel 1 (
  echo Echec avec 'docker compose'. Tentative avec 'docker-compose'...
  docker-compose -f docker\docker-compose.yml up -d --build || exit /b 1
)

echo Services demarres.
echo Frontend: http://localhost:3000
echo API:      http://localhost:3001
