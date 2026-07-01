#!/bin/bash
# Development startup script

echo "🚀 Starting PME Assistant Development Environment"
echo "=================================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✓ Node.js $(node -v)"
echo "✓ npm $(npm -v)"

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
fi

# Setup backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Setup frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Check environment files
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local not found!"
    echo "Creating from template..."
    cp .env.example .env.local
    echo "Please edit .env.local with your configuration"
fi

echo ""
echo "✅ Prerequisites check passed!"
echo ""
echo "Starting development servers..."
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start development servers
npm run dev
