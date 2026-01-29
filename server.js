'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const BUILD_DIR = path.join(__dirname, 'build');

const serverStartTime = Date.now();

function getUptime() {
  return Math.round((Date.now() - serverStartTime) / 10) / 100;
}

app.get('/health', (req, res) => {
  try {
    res.status(200).json({
      status: 'ok',
      uptime: getUptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.use(express.static(BUILD_DIR, {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'), (err) => {
    if (err) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to load application',
        timestamp: new Date().toISOString()
      });
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function gracefulShutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  server.close(() => process.exit(1));
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
