#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting SmartTaxPro deployment..."

# Check if we're in production
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Production environment detected"
    
    # Ensure uploads directory exists
    mkdir -p uploads
    echo "✅ Uploads directory ready"
    
    # Start the server
    echo "🔧 Starting server with npm start..."
    exec npm start
else
    echo "🔧 Development environment detected"
    exec npm run dev
fi 