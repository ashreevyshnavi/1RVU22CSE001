/**
 * @returns {string} 
 */
function generateShortcode() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortcode = '';
  
  for (let i = 0; i < 6; i++) {
    shortcode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return shortcode;
}

module.exports = { generateShortcode };
