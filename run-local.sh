#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm est introuvable. Installez Node.js puis reessayez."
  exit 1
fi

echo "Installation des dependances (root + workspaces)..."
npm install

echo "Demarrage en mode local (frontend + backend)..."
npm run dev
