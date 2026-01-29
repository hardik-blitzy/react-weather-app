#!/usr/bin/env sh

echo 'The following "npm" command builds your Node.js/React application for'
echo 'production in the local "build" directory (i.e. within the appropriate'
echo 'subdirectory of "/var/jenkins_home/workspace/"), correctly bundles React'
echo 'in production mode and optimizes the build for the best performance.'
set -x
npm run build
set +x

echo 'The following "npm" command installs all production dependencies including'
echo 'Express.js (used by the custom server) to the local "node_modules" directory'
echo '(i.e. within the appropriate subdirectory of "/var/jenkins_home/workspace/").'
echo 'The "--production" flag ensures only runtime dependencies are installed,'
echo 'which means development dependencies like testing libraries are skipped'
echo 'for a smaller deployment footprint.'
set -x
npm install --production
set +x

echo 'The following "node" command runs the custom Express server (server.js)'
echo 'which serves your Node.js/React application (built above in production'
echo 'mode) and makes it available for web browsing. The Express server provides:'
echo '  - Static file serving from the "build/" directory for the React SPA'
echo '  - A "/health" endpoint for service monitoring and health checks'
echo '  - SPA routing support (serves index.html for client-side routes)'
echo 'The "node server.js" command has a trailing ampersand so that the command'
echo 'runs as a background process (asynchronously). Otherwise, this command'
echo 'can pause running builds of CI/CD applications indefinitely. "node server.js"'
echo 'is followed by another command that retrieves the process ID (PID) value'
echo 'of the previously run process and writes this value to the file ".pidfile".'
set -x
node server.js &
echo $! > .pidfile
set +x

echo 'Now...'
echo 'Visit http://localhost:5000 to see your Node.js/React application in action.'
echo 'Visit http://localhost:5000/health to verify the service health status.'
echo '(This is why you specified the "args '\''-p 5000:5000'\''" parameter when you'
echo 'created your initial Pipeline as a Jenkinsfile.)'
