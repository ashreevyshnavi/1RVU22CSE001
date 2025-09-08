import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider
} from '@mui/material';
import { Analytics, Search } from '@mui/icons-material';
import ApiService from '../services/api';
import LoggingService from '../services/logging';

function StatisticsPage() {
  const [shortcode, setShortcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  const handleGetStats = async (e) => {
    e.preventDefault();
    
    setError('');
    setStatistics(null);
    
    if (!shortcode.trim()) {
      setError('Please enter a shortcode');
      await LoggingService.warn('frontend', 'component', 'Statistics request failed - empty shortcode');
      return;
    }

    setLoading(true);
    
    try {
      await LoggingService.info('frontend', 'api', `Requesting statistics for shortcode: ${shortcode}`);
      
      const stats = await ApiService.getStatistics(shortcode.trim());
      setStatistics(stats);
      
      await LoggingService.info('frontend', 'api', 'Statistics retrieved successfully');
      
    } catch (err) {
      setError(err.message);
      await LoggingService.error('frontend', 'api', `Failed to get statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Statistics
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Enter a shortcode to view detailed analytics and usage statistics
      </Typography>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        
        <form onSubmit={handleGetStats}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Enter Shortcode"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              placeholder="abc123"
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Loading...' : 'Get Stats'}
            </Button>
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {statistics && (
          <Box>
            <Typography variant="h6" gutterBottom startIcon={<Analytics />}>
              Statistics for: {statistics.shortcode}
            </Typography>
            
            <Divider sx={{ mb: 3 }} />

            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Original URL:
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                    {statistics.originalUrl}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Clicks:
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {statistics.clickCount}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Created: ${formatDate(statistics.createdAt)}`} 
                  size="small" 
                  color="info"
                />
                <Chip 
                  label={`Expires: ${formatDate(statistics.expiryDate)}`} 
                  size="small" 
                  color="warning"
                />
              </Box>
            </Paper>

            {statistics.clicks && statistics.clicks.length > 0 ? (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Click History ({statistics.clicks.length} clicks)
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Referer</TableCell>
                        <TableCell>User Agent</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statistics.clicks.slice(0, 10).map((click, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(click.timestamp)}</TableCell>
                          <TableCell>{click.referer || 'Direct'}</TableCell>
                          <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {click.userAgent || 'Unknown'}
                          </TableCell>
                          <TableCell>{click.location || 'Unknown'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {statistics.clicks.length > 10 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Showing latest 10 clicks out of {statistics.clicks.length} total
                  </Typography>
                )}
              </Paper>
            ) : (
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No clicks recorded yet. Share your short URL to start tracking analytics!
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default StatisticsPage;