import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid 
} from '@mui/material';
import { 
  WbSunny as SunnyIcon,
  Cloud as CloudyIcon,
  Opacity as RainIcon,
  AcUnit as SnowIcon,
  Thunderstorm as StormIcon,
  Grain as MistIcon
} from '@mui/icons-material';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData || !weatherData.main) {
    return (
      <Card sx={{ 
        height: '100%', 
        bgcolor: '#4285f4', 
        color: 'white',
        backgroundImage: 'linear-gradient(135deg, #4285f4 0%, #34a0f5 100%)'
      }}>
        <CardContent>
          <Typography variant="h6">Current Weather</Typography>
          <Typography variant="body2">Loading weather data...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Get weather icon based on weather condition
  const getWeatherIcon = () => {
    if (!weatherData.weather || !weatherData.weather[0]) {
      return <SunnyIcon fontSize="large" />;
    }

    const condition = weatherData.weather[0].main.toLowerCase();
    const iconSize = { fontSize: 64 };

    switch (condition) {
      case 'clear':
        return <SunnyIcon sx={iconSize} />;
      case 'clouds':
        return <CloudyIcon sx={iconSize} />;
      case 'rain':
      case 'drizzle':
        return <RainIcon sx={iconSize} />;
      case 'snow':
        return <SnowIcon sx={iconSize} />;
      case 'thunderstorm':
        return <StormIcon sx={iconSize} />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <MistIcon sx={iconSize} />;
      default:
        return <SunnyIcon sx={iconSize} />;
    }
  };

  // Format weather description
  const getWeatherDescription = () => {
    if (!weatherData.weather || !weatherData.weather[0]) {
      return 'N/A';
    }
    
    // Convert to lowercase and capitalize first letter
    const desc = weatherData.weather[0].description;
    return desc.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Round temperature to nearest integer
  const temperature = Math.round(weatherData.main.temp);

  return (
    <Card sx={{ 
      height: '100%', 
      bgcolor: '#4285f4', 
      color: 'white',
      backgroundImage: 'linear-gradient(135deg, #4285f4 0%, #34a0f5 100%)'
    }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="medium">Current Weather</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
            {temperature}°C
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            {getWeatherIcon()}
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {getWeatherDescription()}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              Humidity
            </Typography>
            <Typography variant="h6">
              {weatherData.main.humidity}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              Wind Speed
            </Typography>
            <Typography variant="h6">
              {weatherData.wind ? `${weatherData.wind.speed} m/s` : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard; 