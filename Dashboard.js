import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  WaterDrop as WaterIcon,
  Schedule as ScheduleIcon,
  DeviceHub as DeviceIcon
} from '@mui/icons-material';

// Import custom components
import WeatherCard from '../components/dashboard/WeatherCard';
import ForecastCard from '../components/dashboard/ForecastCard';
import IrrigationGuideCard from '../components/dashboard/IrrigationGuideCard';
import FarmerAdvisoryCard from '../components/dashboard/FarmerAdvisoryCard';
import FloodAlertCard from '../components/dashboard/FloodAlertCard';

// Import services
import weatherService from '../services/weatherService';
import irrigationService from '../services/irrigationService';

const Dashboard = () => {
  const theme = useTheme();

  // State for weather data
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  // State for irrigation data
  const [irrigationNeeds, setIrrigationNeeds] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [floodRisk, setFloodRisk] = useState(null);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for location
  const [locationStatus, setLocationStatus] = useState('pending'); // 'pending', 'granted', 'denied', 'unavailable'
  const [userLocation, setUserLocation] = useState(null);

  // Function to request location access
  const requestLocationAccess = async () => {
    setLoading(true);
    try {
      const location = await weatherService.getUserLocation();

      if (location.lat === 40.7128 && location.lon === -74.0060) {
        // Default coordinates used, meaning permission was denied or unavailable
        if (!navigator.geolocation) {
          setLocationStatus('unavailable');
        } else {
          setLocationStatus('denied');
        }
      } else {
        setLocationStatus('granted');
        setUserLocation(location);
      }

      await fetchWeatherData(location.lat, location.lon);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationStatus('error');
      setError('Error accessing location. Using default location data.');
      await fetchWeatherData();
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch weather data using given coordinates
  const fetchWeatherData = async (lat, lon) => {
    try {
      // Fetch current weather
      const weather = await weatherService.getCurrentWeather(lat, lon);
      setCurrentWeather(weather);

      // Fetch forecast data
      const forecastData = await weatherService.getDailyForecast(lat, lon);
      setForecast(forecastData);

      // Calculate irrigation needs
      const irrigationData = irrigationService.calculateIrrigationNeeds(weather);
      setIrrigationNeeds(irrigationData);

      // Generate farmer's advisory
      const advisoryData = irrigationService.generateFarmerAdvisory(weather);
      setAdvisories(advisoryData);

      // Get flood risk
      const rawForecast = await weatherService.getForecast(lat, lon);
      const floodRiskData = irrigationService.getFloodRisk(weather, rawForecast.list);
      setFloodRisk(floodRiskData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to load weather data. Please try again later.');
    }
  };

  useEffect(() => {
    requestLocationAccess();
  }, []);

  // Refresh data handler
  const handleRefresh = () => {
    requestLocationAccess();
  };

  // Render loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
        flexDirection="column"
        sx={{
          background: `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.paper})`
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Loading weather data...
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Fetching current conditions for your location
        </Typography>
      </Box>
    );
  }

  // Location permission handling
  const renderLocationAlert = () => {
    switch (locationStatus) {
      case 'denied':
        return (
          <Alert
            severity="warning"
            variant="filled"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={requestLocationAccess}>
                Try Again
              </Button>
            }
            icon={<LocationIcon />}
          >
            Location access denied. Weather data is showing for default location. Grant location permission for local weather data.
          </Alert>
        );
      case 'unavailable':
        return (
          <Alert severity="info" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
            Geolocation is not supported by your browser. Weather data is showing for default location.
          </Alert>
        );
      case 'error':
        return (
          <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        );
      default:
        return null;
    }
  };

  // Show general error if needed
  if (error && locationStatus !== 'denied' && locationStatus !== 'unavailable') {
    return (
      <Box m={3}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.paper})`
          : `linear-gradient(${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
        minHeight: '100vh',
        borderRadius: 2
      }}
    >
      {/* Header with Title and Refresh Button */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" fontWeight="600" color="primary">
          Farm Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton
            onClick={handleRefresh}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {renderLocationAlert()}

      {locationStatus === 'granted' && userLocation && (
        <Alert
          severity="success"
          variant="filled"
          icon={<LocationIcon />}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Using weather data for your current location
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Weather Section - Enhanced with Paper elevation */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 3 },
              mb: 3,
              borderRadius: 2,
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.background.paper})`
                : `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.background.paper})`
            }}
          >
            <Typography variant="h6" gutterBottom color="white" fontWeight="600">
              Weather & Irrigation
            </Typography>
            <Grid container spacing={3}>
              {/* Weather Card */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                  <WeatherCard weatherData={currentWeather} />
                </Card>
              </Grid>

              {/* Advisories */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                  <FarmerAdvisoryCard advisories={advisories} />
                </Card>
              </Grid>

              {/* Irrigation Guide */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                  <IrrigationGuideCard irrigationData={irrigationNeeds} />
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Forecast Section */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600">
              5-Day Weather Forecast
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ForecastCard forecastData={forecast} />
          </Paper>
        </Grid>

        {/* Alerts Section - Conditional rendering */}
        {floodRisk && (floodRisk.risk !== 'low' || floodRisk.warning) && (
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <FloodAlertCard floodData={floodRisk} />
            </Paper>
          </Grid>
        )}

        {/* Quick Stats Cards with Icons */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom mt={2} fontWeight="600">
            Farm Activity & Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      <DeviceIcon />
                    </Avatar>
                  }
                  title="Active Devices"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                />
                <CardContent>
                  <Typography variant="h4" align="center" color="primary" fontWeight="600">
                    6
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    Out of 10 total devices
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                      <WaterIcon />
                    </Avatar>
                  }
                  title="Water Usage Today"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                />
                <CardContent>
                  <Typography variant="h4" align="center" color="primary" fontWeight="600">
                    345 L
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    15% less than yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                      <ScheduleIcon />
                    </Avatar>
                  }
                  title="Scheduled Irrigations"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                />
                <CardContent>
                  <Typography variant="h4" align="center" color="primary" fontWeight="600">
                    4
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    Next: Today at 6:00 PM
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 