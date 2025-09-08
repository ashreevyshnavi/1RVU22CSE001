const express = require('express');
const router = express.Router();

const { generateShortcode } = require('../utils/shortcode-generator');
const { isValidUrl } = require('../utils/url-validator');
const { saveUrl, getUrlByShortcode, incrementClickCount, getUrlStats } = require('../data/urls');

const LoggingMiddleware = require('../../Logging-Middleware/logging-middleware');
const config = require('../../Logging-Middleware/config');
const logger = new LoggingMiddleware(config.ACCESS_TOKEN);

router.post('/shorturls', async (req, res) => {
  try {
    await logger.info('backend', 'controller', 'Create URL request received');
    
    const { url, validity, shortcode } = req.body;

    if (!url) {
      await logger.warn('backend', 'controller', 'Missing URL in request');
      return res.status(400).json({
        error: 'Bad Request',
        message: 'URL is required'
      });
    }

    if (!isValidUrl(url)) {
      await logger.warn('backend', 'controller', 'Invalid URL format');
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid URL format. Please provide a valid URL.'
      });
    }

    const validityMinutes = validity || 30;
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + validityMinutes);

    let finalShortcode;
    if (shortcode) {
      const existingUrl = getUrlByShortcode(shortcode);
      if (existingUrl) {
        await logger.warn('backend', 'controller', 'Shortcode already exists');
        return res.status(409).json({
          error: 'Conflict',
          message: 'Shortcode already exists. Please choose a different one.'
        });
      }
      finalShortcode = shortcode;
    } else {
      finalShortcode = generateShortcode();
    }

    const urlData = {
      shortcode: finalShortcode,
      originalUrl: url,
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      clickCount: 0,
      clicks: []
    };

    saveUrl(urlData);

    const shortLink = `http://localhost:8080/${finalShortcode}`;

    await logger.info('backend', 'controller', `URL created: ${finalShortcode}`);

    res.status(201).json({
      shortLink: shortLink,
      expiry: expiryDate.toISOString()
    });

  } catch (error) {
    await logger.error('backend', 'controller', 'Error creating short URL');
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create short URL'
    });
  }
});

router.get('/shorturls/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    
    await logger.info('backend', 'controller', `Stats request: ${shortcode}`);

    const urlData = getUrlByShortcode(shortcode);

    if (!urlData) {
      await logger.warn('backend', 'controller', 'Shortcode not found');
      return res.status(404).json({
        error: 'Not Found',
        message: 'Shortcode not found'
      });
    }

    const now = new Date();
    const expiryDate = new Date(urlData.expiryDate);
    
    if (now > expiryDate) {
      await logger.warn('backend', 'controller', 'Shortcode expired');
      return res.status(410).json({
        error: 'Gone',
        message: 'Short link has expired'
      });
    }

    const stats = getUrlStats(shortcode);

    await logger.info('backend', 'controller', `Stats retrieved: ${shortcode}`);

    res.json(stats);

  } catch (error) {
    await logger.error('backend', 'controller', 'Error getting statistics');
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve statistics'
    });
  }
});

router.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;

    await logger.info('backend', 'controller', `Redirect: ${shortcode}`);

    const urlData = getUrlByShortcode(shortcode);

    if (!urlData) {
      await logger.warn('backend', 'controller', 'Redirect failed - not found');
      return res.status(404).json({
        error: 'Not Found',
        message: 'Shortcode not found'
      });
    }

    const now = new Date();
    const expiryDate = new Date(urlData.expiryDate);
    
    if (now > expiryDate) {
      await logger.warn('backend', 'controller', 'Redirect failed - expired');
      return res.status(410).json({
        error: 'Gone',
        message: 'Short link has expired'
      });
    }

    const clickData = {
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent') || 'Unknown',
      referer: req.get('Referer') || 'Direct',
      ip: req.ip || 'Unknown',
      location: 'Unknown'
    };

    incrementClickCount(shortcode, clickData);

    await logger.info('backend', 'service', `Successful redirect: ${shortcode}`);

    res.redirect(302, urlData.originalUrl);

  } catch (error) {
    await logger.error('backend', 'controller', 'Error processing redirect');
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process redirect'
    });
  }
});

module.exports = router;