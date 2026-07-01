#!/bin/bash

# SaaS PME - Script de setup initial

set -e

echo "🚀 PME Assistant - Setup Initial"
echo "=================================="
echo ""

# Vérifier Node.js
echo "✓ Vérification de Node.js..."
node_version=$(node -v)
echo "  Node.js version: $node_version"

# Vérifier npm
echo "✓ Vérification de npm..."
npm_version=$(npm -v)
echo "  npm version: $npm_version"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
npm install

# Setup des variables d'environnement
echo ""
echo "🔧 Configuration des variables d'environnement..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "  ✓ .env.local créé (À remplir avec vos clés API)"
else
  echo "  ✓ .env.local existe déjà"
fi

# Setup de la base de données
echo ""
echo "🗄️  Setup de la base de données..."
if command -v psql &> /dev/null; then
  echo "  PostgreSQL détecté"
  # À adapter selon votre setup
  echo "  ✓ Veuillez configurer votre DATABASE_URL"
else
  echo "  ⚠️  PostgreSQL non trouvé"
  echo "  ℹ️  Utilisez Docker Compose si vous n'avez pas PostgreSQL installé"
fi

# Setup Docker Compose (optionnel)
echo ""
echo "🐳 Docker Compose disponible?"
if command -v docker-compose &> /dev/null; then
  echo "  ✓ Docker Compose détecté"
  echo "  Pour démarrer: npm run docker:up"
else
  echo "  ⚠️  Docker Compose non trouvé"
fi

echo ""
echo "=================================="
echo "✅ Setup initial terminé!"
echo ""
echo "Prochaines étapes:"
echo "1. Éditer .env.local avec vos clés API"
echo "2. Setup la base de données:"
echo "   - Localement: psql -U postgres -d saas_pme"
echo "   - Docker: npm run docker:up"
echo "3. Appliquer les migrations: npm run db:migrate"
echo "4. Démarrer le développement: npm run dev"
echo ""
echo "📚 Documentation: docs/SETUP.md"
echo "🚀 Guide de démarrage: docs/ARCHITECTURE.md"
