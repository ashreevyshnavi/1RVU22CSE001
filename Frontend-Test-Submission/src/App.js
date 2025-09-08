import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import URLShortenerPage from './components/URLShortenerPage';
import StatisticsPage from './components/StatisticsPage';
import './App.css';

import LoggingService from './services/logging';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = async (event, newValue) => {
    const tabNames = ['URL Shortener', 'Statistics'];
    await LoggingService.info('frontend', 'component', `User switched to ${tabNames[newValue]} tab`);
    setCurrentTab(newValue);
  };

  return (
    <div className="App">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} centered>
            <Tab label="URL Shortener" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <URLShortenerPage />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <StatisticsPage />
        </TabPanel>
      </Container>
    </div>
  );
}

export default App;
