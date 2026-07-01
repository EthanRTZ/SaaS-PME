#!/bin/bash

echo "📊 PME Assistant - Project Structure"
echo "======================================"
echo ""

echo "📁 Project Layout:"
tree -L 2 -I 'node_modules|.next|dist' --charset ascii

echo ""
echo "📝 Key Files:"
echo "  Frontend:"
find frontend/src -type f -name "*.tsx" -o -name "*.ts" | head -10 | sed 's/^/    /'
echo ""
echo "  Backend:"
find backend/src -type f -name "*.ts" | head -10 | sed 's/^/    /'

echo ""
echo "✅ Structure complete!"
