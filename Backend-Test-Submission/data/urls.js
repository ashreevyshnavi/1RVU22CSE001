let urlDatabase = {};

/**
 * @param {object} urlData
 */
function saveUrl(urlData) {
  urlDatabase[urlData.shortcode] = urlData;
}

/**
 * @param {string} shortcode 
 * @returns {object|null} 
 */
function getUrlByShortcode(shortcode) {
  return urlDatabase[shortcode] || null;
}

/**
 * @param {string} shortcode
 * @param {object} clickData - Click information
 */
function incrementClickCount(shortcode, clickData) {
  if (urlDatabase[shortcode]) {
    urlDatabase[shortcode].clickCount++;
    urlDatabase[shortcode].clicks.push(clickData);
  }
}

/**
 * @param {string} shortcode
 * @returns {object}
 */
function getUrlStats(shortcode) {
  const urlData = urlDatabase[shortcode];
  
  if (!urlData) {
    return null;
  }

  return {
    shortcode: urlData.shortcode,
    originalUrl: urlData.originalUrl,
    createdAt: urlData.createdAt,
    expiryDate: urlData.expiryDate,
    clickCount: urlData.clickCount,
    clicks: urlData.clicks.map(click => ({
      timestamp: click.timestamp,
      referer: click.referer,
      userAgent: click.userAgent,
      location: click.location
    }))
  };
}

/**
 * @returns {object} All stored URLs
 */
function getAllUrls() {
  return urlDatabase;
}

module.exports = {
  saveUrl,
  getUrlByShortcode,
  incrementClickCount,
  getUrlStats,
  getAllUrls
};