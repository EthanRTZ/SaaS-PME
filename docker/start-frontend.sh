#!/bin/bash
# Frontend startup script

set -e

echo "🚀 Starting PME Assistant Frontend..."

# Build if not already done
if [ ! -d ".next" ]; then
  echo "🔨 Building application..."
  npm run build
fi

# Start the server
echo "🎯 Starting server on port 3000..."
npm start
