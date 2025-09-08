import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Divider
} from '@mui/material';
import { Link as LinkIcon, Timer, ContentCopy } from '@mui/icons-material';
import ApiService from '../services/api';
import LoggingService from '../services/logging';

function URLShortenerPage() {
  const [url, setUrl] = useState('');
  const [customShortcode, setCustomShortcode] = useState('');
  const [validity, setValidity] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const isValidUrl = (urlString) => {
    try {
      return urlString.startsWith('http://') || urlString.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setResult(null);
    
    if (!url.trim()) {
      setError('Please enter a URL');
      await LoggingService.warn('frontend', 'component', 'URL submission failed - empty URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      await LoggingService.warn('frontend', 'component', 'URL submission failed - invalid URL format');
      return;
    }

    if (validity < 1 || validity > 1440) {
      setError('Validity must be between 1 and 1440 minutes (24 hours)');
      await LoggingService.warn('frontend', 'component', 'URL submission failed - invalid validity period');
      return;
    }

    if (customShortcode && !/^[a-zA-Z0-9]{3,10}$/.test(customShortcode)) {
      setError('Custom shortcode must be 3-10 characters (letters and numbers only)');
      await LoggingService.warn('frontend', 'component', 'URL submission failed - invalid custom shortcode');
      return;
    }

    setLoading(true);
    
    try {
      await LoggingService.info('frontend', 'api', 'Attempting to create short URL');
      
      const response = await ApiService.createShortUrl(url, validity, customShortcode);
      
      setResult(response);
      await LoggingService.info('frontend', 'api', 'Short URL created successfully');
      
      // Clear form
      setUrl('');
      setCustomShortcode('');
      setValidity(30);
      
    } catch (err) {
      setError(err.message);
      await LoggingService.error('frontend', 'api', `Failed to create short URL: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      await LoggingService.info('frontend', 'component', 'Short URL copied to clipboard');
    } catch (err) {
      await LoggingService.error('frontend', 'component', 'Failed to copy to clipboard');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Shortener
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Enter a long URL to create a shortened version that's easy to share
      </Typography>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <TextField
              label="Enter URL to shorten"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              fullWidth
              required
              error={url && !isValidUrl(url)}
              helperText={url && !isValidUrl(url) ? 'URL must start with http:// or https://' : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Validity Period (minutes)"
              type="number"
              value={validity}
              onChange={(e) => setValidity(parseInt(e.target.value) || 30)}
              inputProps={{ min: 1, max: 1440 }}
              helperText="How long the short link should remain active (max 24 hours)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Timer />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Custom Shortcode (optional)"
              value={customShortcode}
              onChange={(e) => setCustomShortcode(e.target.value)}
              placeholder="mycode123"
              helperText="3-10 characters, letters and numbers only. Leave empty for random code."
              error={customShortcode && !/^[a-zA-Z0-9]{3,10}$/.test(customShortcode)}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !url || !isValidUrl(url)}
              startIcon={loading ? <CircularProgress size={20} /> : <LinkIcon />}
            >
              {loading ? 'Creating...' : 'Shorten URL'}
            </Button>
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Paper elevation={1} sx={{ mt: 3, p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="h6" gutterBottom>
              Success! Your short URL is ready:
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                value={result.shortLink}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => copyToClipboard(result.shortLink)}
                        startIcon={<ContentCopy />}
                        size="small"
                      >
                        Copy
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Expires: ${new Date(result.expiry).toLocaleString()}`} 
                size="small" 
                color="info"
              />
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
}

export default URLShortenerPage;

