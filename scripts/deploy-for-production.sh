#!/usr/bin/env sh

set -e

npm run build
npm install --production

node server.js &
echo $! > .pidfile

echo "Server started on http://localhost:5000"
echo "Health check: http://localhost:5000/health"
