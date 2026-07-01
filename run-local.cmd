@echo off
setlocal

cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo npm introuvable. Installez Node.js puis reessayez.
  exit /b 1
)

echo Installation des dependances (root + workspaces)...
call npm install
if errorlevel 1 exit /b %errorlevel%

echo Demarrage en mode local (frontend + backend)...
call npm run dev
exit /b %errorlevel%
