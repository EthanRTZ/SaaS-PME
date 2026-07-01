#!/bin/bash
# Database initialization script

set -e

echo "🗄️ Initializing Database"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
    echo "Please set DATABASE_URL environment variable"
    exit 1
fi

# Extract database name from URL
DB_NAME=$(echo $DATABASE_URL | grep -oP '(?<=/)[^?]*$')
echo -e "${GREEN}✓ Using database: $DB_NAME${NC}"

# Run migrations
echo ""
echo "📋 Running migrations..."
cd backend
npm run db:migrate:prod || npm run db:migrate:dev
cd ..

# Seed database (optional)
echo ""
read -p "Do you want to seed the database with test data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    cd backend
    npm run db:seed
    cd ..
fi

echo ""
echo -e "${GREEN}✅ Database initialization complete!${NC}"
