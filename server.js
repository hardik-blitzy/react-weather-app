/**
 * Express.js Production Server
 * 
 * This server provides:
 * - Health check endpoint (/health) for service availability monitoring
 * - Static file serving for the React SPA production build
 * - SPA client-side routing support via fallback to index.html
 * 
 * The health endpoint enables integration with:
 * - Kubernetes liveness/readiness probes
 * - Load balancer health checks
 * - External monitoring services (e.g., Jenkins, Prometheus)
 * 
 * @module server
 */

'use strict';

const express = require('express');
const path = require('path');

// Initialize Express application
const app = express();

// Configuration constants
const PORT = process.env.PORT || 5000;
const BUILD_DIRECTORY = path.join(__dirname, 'build');
const INDEX_HTML_PATH = path.join(BUILD_DIRECTORY, 'index.html');

// Record server start time for uptime calculation
const serverStartTime = Date.now();

// Variable to hold the server instance for graceful shutdown
let server = null;

/**
 * Calculate server uptime in seconds
 * @returns {number} Uptime in seconds with two decimal precision
 */
function calculateUptime() {
  const uptimeMs = Date.now() - serverStartTime;
  return Math.round((uptimeMs / 1000) * 100) / 100;
}

/**
 * Health Check Endpoint
 * 
 * GET /health
 * 
 * Returns JSON response indicating service health status.
 * This endpoint is designed for use with:
 * - Kubernetes liveness probes
 * - Load balancer health checks
 * - Monitoring and alerting systems
 * 
 * Success Response (200 OK):
 * {
 *   "status": "ok",
 *   "uptime": 123.45,
 *   "timestamp": "2024-01-15T10:30:00.000Z"
 * }
 * 
 * Error Response (503 Service Unavailable):
 * {
 *   "status": "error",
 *   "message": "Health check failed",
 *   "timestamp": "2024-01-15T10:30:00.000Z"
 * }
 */
app.get('/health', (req, res) => {
  try {
    const healthResponse = {
      status: 'ok',
      uptime: calculateUptime(),
      timestamp: new Date().toISOString()
    };

    res.status(200).json(healthResponse);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Health check error:', error.message);

    const errorResponse = {
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    };

    res.status(503).json(errorResponse);
  }
});

/**
 * Static File Middleware
 * 
 * Serves the production React build from the 'build/' directory.
 * This middleware handles serving:
 * - JavaScript bundles
 * - CSS stylesheets
 * - Static assets (images, fonts, etc.)
 * - manifest.json and other PWA files
 */
app.use(express.static(BUILD_DIRECTORY, {
  // Enable caching for production performance
  maxAge: '1d',
  // Set proper ETag for cache validation
  etag: true,
  // Enable last-modified header
  lastModified: true
}));

/**
 * SPA Fallback Route
 * 
 * For all GET requests that don't match a static file or the health endpoint,
 * serve the index.html file. This enables React Router client-side navigation
 * to work correctly when users:
 * - Directly access deep links (e.g., /settings, /saved-locations)
 * - Refresh the page on a client-side route
 * - Navigate using browser back/forward buttons
 */
app.get('*', (req, res) => {
  res.sendFile(INDEX_HTML_PATH, (err) => {
    if (err) {
      console.error('Error serving index.html:', err.message);
      res.status(500).json({
        status: 'error',
        message: 'Failed to load application',
        timestamp: new Date().toISOString()
      });
    }
  });
});

/**
 * Start the server and listen for incoming connections
 */
server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  React Weather App - Production Server`);
  console.log(`=================================================`);
  console.log(`  Status:    Running`);
  console.log(`  Port:      ${PORT}`);
  console.log(`  Health:    http://localhost:${PORT}/health`);
  console.log(`  App:       http://localhost:${PORT}/`);
  console.log(`  Build:     ${BUILD_DIRECTORY}`);
  console.log(`  Started:   ${new Date().toISOString()}`);
  console.log(`=================================================`);
});

/**
 * Graceful Shutdown Handler
 * 
 * Handles SIGTERM signal for graceful server shutdown.
 * This is essential for:
 * - Zero-downtime deployments in orchestrated environments
 * - Proper connection draining during rolling updates
 * - Clean shutdown during container termination
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully...');
  
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('Error during server shutdown:', err.message);
        process.exit(1);
      }
      
      console.log('HTTP server closed successfully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

/**
 * SIGINT Handler (Ctrl+C)
 * 
 * Handles SIGINT signal for development/manual termination.
 * Provides the same graceful shutdown behavior as SIGTERM.
 */
process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server gracefully...');
  
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('Error during server shutdown:', err.message);
        process.exit(1);
      }
      
      console.log('HTTP server closed successfully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

/**
 * Uncaught Exception Handler
 * 
 * Catches uncaught exceptions to prevent silent failures.
 * Logs the error and exits with error code for container restart.
 */
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  console.error(error.stack);
  
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/**
 * Unhandled Promise Rejection Handler
 * 
 * Catches unhandled promise rejections.
 * Logs the error for debugging purposes.
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});
