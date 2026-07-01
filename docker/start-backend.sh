#!/bin/bash
# Backend startup script

set -e

echo "🚀 Starting PME Assistant Backend..."

# Attendre PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "✓ PostgreSQL is up"

# Appliquer les migrations
echo "🔄 Running migrations..."
npm run db:migrate:prod

# Démarrer le serveur
echo "🎯 Starting server..."
npm start
