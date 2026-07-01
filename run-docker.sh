#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker n'est pas installe ou introuvable dans le PATH."
  exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Fichier introuvable: $COMPOSE_FILE"
  exit 1
fi

compose_cmd() {
  if docker compose version >/dev/null 2>&1; then
    docker compose -f "$COMPOSE_FILE" "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f "$COMPOSE_FILE" "$@"
  else
    echo "Ni 'docker compose' ni 'docker-compose' n'est disponible."
    exit 1
  fi
}

echo "Arret des containers existants (si presents)..."
compose_cmd down

echo "Build et demarrage des services Docker..."
compose_cmd up -d --build

echo "Services demarres."
echo "Frontend: http://localhost:3000"
echo "API:      http://localhost:3001"
echo

echo "Pour suivre les logs:"
echo "  docker compose -f docker/docker-compose.yml logs -f"
