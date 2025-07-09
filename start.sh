#!/bin/bash

# SmartTaxPro Startup Script for Railway
# This script ensures proper initialization before starting the server

set -e  # Exit on any error

echo "🚀 Starting SmartTaxPro deployment..."

# Set environment variables
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-5000}

echo "📋 Environment Configuration:"
echo "  NODE_ENV: $NODE_ENV"
echo "  PORT: $PORT"
echo "  Platform: $(uname -s)"
echo "  Architecture: $(uname -m)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are we in the correct directory?"
    exit 1
fi

# Check if dist directory exists (for production)
if [ "$NODE_ENV" = "production" ] && [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found. Please run 'npm run build' first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p logs

# Check disk space
echo "💾 Checking disk space..."
df -h .

# Check memory
echo "🧠 Checking memory..."
free -h || true

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --only=production --no-optional
fi

# Verify critical files exist
echo "🔍 Verifying critical files..."
if [ "$NODE_ENV" = "production" ]; then
    if [ ! -f "dist/index.js" ]; then
        echo "❌ Error: dist/index.js not found. Build may have failed."
        exit 1
    fi
fi

# Check if we can connect to the database (basic check)
echo "🗄️  Checking database connectivity..."
if [ -n "$DATABASE_URL" ]; then
    echo "  Database URL is configured"
else
    echo "⚠️  Warning: DATABASE_URL not set"
fi

# Start the server
echo "🎯 Starting server..."
if [ "$NODE_ENV" = "production" ]; then
    echo "  Using production build: dist/index.js"
    exec node dist/index.js
else
    echo "  Using development mode"
    exec npm run dev
fi 