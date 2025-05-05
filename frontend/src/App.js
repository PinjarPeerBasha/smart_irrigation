import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Zones from './pages/Zones';
import Devices from './pages/Devices';
import Schedules from './pages/Schedules';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App; 