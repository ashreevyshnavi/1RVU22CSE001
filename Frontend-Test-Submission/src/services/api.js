const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  
  /**
   * @param {string} url 
   * @param {number} validity 
   * @param {string} shortcode
   * @returns {Promise<object>} 
   */
  static async createShortUrl(url, validity = 30, shortcode = '') {
    try {
      const requestBody = { url, validity };
      
      if (shortcode.trim()) {
        requestBody.shortcode = shortcode.trim();
      }

      const response = await fetch(`${API_BASE_URL}/shorturls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create short URL');
      }

      return data;
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  }

  /**
   * @param {string} shortcode
   * @returns {Promise<object>}
   */
  static async getStatistics(shortcode) {
    try {
      const response = await fetch(`${API_BASE_URL}/shorturls/${shortcode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get statistics');
      }

      return data;
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  }

  /**
   * @returns {Promise<boolean>} 
   */
  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default ApiService;
