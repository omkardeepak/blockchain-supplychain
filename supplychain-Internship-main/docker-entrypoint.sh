#!/bin/sh
# Entrypoint: wait for MongoDB, then exec the provided command
set -e

echo "Waiting for MongoDB..."
node /app/scripts/wait-for-mongo.js

echo "Starting command: $@"
exec "$@"
