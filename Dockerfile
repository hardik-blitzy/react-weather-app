# =============================================================================
# Dockerfile - Security-Hardened Container Configuration
# React Weather Application
# =============================================================================
#
# This Dockerfile implements security best practices:
# - Node.js 20 LTS Alpine base image with latest security patches
# - Non-root user execution to prevent privilege escalation
# - npm ci for reproducible, tamper-resistant builds
# - Proper layer ordering for efficient Docker caching
#
# Security Improvements (vs original Dokerfile):
# - Updated from node:18-alpine to node:20-alpine (current LTS)
# - Added USER directive to run as non-root 'node' user
# - Changed npm install to npm ci for deterministic builds
# - Reordered COPY and RUN commands for optimal layer caching
# - Added EXPOSE directive for documentation
#
# Build: docker build -t react-weather-app .
# Run:   docker run -p 3000:3000 --env-file .env react-weather-app
# =============================================================================

# Base image: Node.js 20 LTS on Alpine Linux for minimal attack surface
# Alpine provides a smaller image size and fewer potential vulnerabilities
FROM node:20-alpine

# Set working directory for all subsequent commands
WORKDIR /app

# Copy package files FIRST for optimal layer caching
# This layer only rebuilds when package files change, not on every code change
COPY package.json package-lock.json ./

# Install dependencies using npm ci for:
# - Reproducible builds (uses exact versions from package-lock.json)
# - Tamper-resistant installation (fails if lock file is out of sync)
# - Faster installation (skips package resolution)
# --legacy-peer-deps flag required for this project's dependency tree
RUN npm ci --legacy-peer-deps

# Copy application source code AFTER npm ci
# This ensures dependency installation is cached and only invalidated
# when package files change, not when source code changes
COPY . .

# Security: Run container as non-root 'node' user
# The 'node' user is created by the official Node.js Docker image
# This prevents privilege escalation attacks if the container is compromised
# Reference: CIS Docker Benchmark - 4.1 Ensure a user for the container has been created
USER node

# Document the port the application listens on
# This is informational and does not actually publish the port
EXPOSE 3000

# Start the React development server
# For production deployments, consider:
# - Building static assets with 'npm run build'
# - Serving with nginx or a static file server
# - Using a multi-stage build for smaller production images
CMD ["npm", "run", "start"]
