const express = require('express');
const cors = require('cors');
const shorturlRoutes = require('./routes/shorturls');

const LoggingMiddleware = require('../Logging-Middleware/logging-middleware');
const config = require('../Logging-Middleware/config');

const app = express();
const PORT = 8080;

const logger = new LoggingMiddleware(config.ACCESS_TOKEN);

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await logger.info('backend', 'middleware', `${req.method} ${req.path} - Request received`);
  next();
});

app.use('/', shorturlRoutes);

app.get('/', async (req, res) => {
  await logger.info('backend', 'controller', 'Health check endpoint accessed');
  res.json({ 
    message: 'URL Shortener Service is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use(async (error, req, res, next) => {
  await logger.error('backend', 'handler', `Unhandled error: ${error.message}`);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

app.use(async (req, res) => {
  await logger.warn('backend', 'handler', `404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

app.listen(PORT, async () => {
  await logger.info('backend', 'service', `URL Shortener server started on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation:`);
  console.log(`   POST http://localhost:${PORT}/shorturls - Create short URL`);
  console.log(`   GET  http://localhost:${PORT}/shorturls/:shortcode - Get statistics`);
  console.log(`   GET  http://localhost:${PORT}/:shortcode - Redirect to original URL`);
});

module.exports = app;