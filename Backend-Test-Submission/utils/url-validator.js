/**
 * @param {string} url 
 * @returns {boolean} 
 */
function isValidUrl(url) {
  try {
    if (typeof url !== 'string') {
      return false;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    
    new URL(url);
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * @param {string} shortcode 
 * @returns {boolean} 
 */
function isValidShortcode(shortcode) {
  const regex = /^[a-zA-Z0-9]{3,10}$/;
  return regex.test(shortcode);
}

module.exports = { isValidUrl, isValidShortcode };
