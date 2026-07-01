#!/bin/bash
# Cleanup script - Remove build artifacts and dependencies

echo "🧹 Cleaning up..."

# Remove node_modules
echo "Removing node_modules..."
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
rm -rf shared/node_modules

# Remove build outputs
echo "Removing build outputs..."
rm -rf frontend/.next
rm -rf frontend/out
rm -rf backend/dist
rm -rf backend/build

# Remove logs
echo "Removing logs..."
rm -f *.log
rm -f frontend/*.log
rm -rf backend/logs

# Remove cache
echo "Removing cache..."
rm -rf .turbo
rm -rf frontend/.cache
rm -rf backend/.cache

echo "✅ Cleanup complete!"
echo ""
echo "To reinstall dependencies, run: npm install"
