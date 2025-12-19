#!/usr/bin/env bash
set -euo pipefail


# Debug helpers: print versions and workspace to help diagnose early failures
echo "--- docker-entrypoint debug ---"
bash --version 2>/dev/null || true
node --version 2>/dev/null || true
echo "Contents of /app:"
ls -la /app || true
echo "-------------------------------"

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
node /app/scripts/wait-for-mongo.js

# If no arguments are provided, default to starting the app
if [ "$#" -eq 0 ]; then
  echo "No command provided. Starting frontend server by default..."
  exec npm start
else
  echo "Starting command: $*"
  exec "$@"
fi
