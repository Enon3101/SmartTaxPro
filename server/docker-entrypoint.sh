#!/bin/sh
set -e

# Optionally run DB migrations unless disabled
if [ "$SKIP_DB_MIGRATIONS" != "true" ]; then
  echo "Running Drizzle migrations..."
  npx drizzle-kit push || echo "⚠️  migrations failed (continuing)"
fi

exec "$@" 