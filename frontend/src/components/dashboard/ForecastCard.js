import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Divider
} from '@mui/material';
import { 
  WbSunny as SunnyIcon,
  Cloud as CloudyIcon,
  Opacity as RainIcon,
  AcUnit as SnowIcon,
  Thunderstorm as StormIcon,
  Grain as MistIcon
} from '@mui/icons-material';

const ForecastCard = ({ forecastData }) => {
  if (!forecastData || !forecastData.length) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6">5-Day Forecast</Typography>
          <Typography variant="body2">Loading forecast data...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Get weather icon based on weather condition
  const getWeatherIcon = (condition) => {
    if (!condition) return <SunnyIcon />;
    
    condition = condition.toLowerCase();
    const iconProps = { fontSize: 'medium' };
    
    switch (condition) {
      case 'clear':
        return <SunnyIcon sx={iconProps} />;
      case 'clouds':
        return <CloudyIcon sx={iconProps} />;
      case 'rain':
      case 'drizzle':
        return <RainIcon sx={iconProps} />;
      case 'snow':
        return <SnowIcon sx={iconProps} />;
      case 'thunderstorm':
        return <StormIcon sx={iconProps} />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <MistIcon sx={iconProps} />;
      default:
        return <SunnyIcon sx={iconProps} />;
    }
  };

  // Format date to display day of week
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get weather description
  const getWeatherDescription = (weather) => {
    if (!weather) return 'N/A';
    return weather.description.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          5-Day Forecast
        </Typography>
        
        <Grid container spacing={1}>
          {forecastData.map((day, index) => (
            <React.Fragment key={day.date}>
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  py: 1 
                }}>
                  <Box sx={{ minWidth: 100 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(day.date)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getWeatherIcon(day.weather.main)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {getWeatherDescription(day.weather)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right', minWidth: 50 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {Math.round(day.avgTemp)}°C
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              {index < forecastData.length - 1 && (
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ForecastCard; 