import axios from 'axios';

// OpenWeatherMap API key - in a real app, this would be stored in environment variables
const API_KEY = '8d2de98e089f1c28e1a22fc19a24ef04'; // Free tier API key for demo purposes
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Default coordinates (New York City)
const DEFAULT_LAT = 40.7128;
const DEFAULT_LON = -74.0060;

const weatherService = {
  // Get user's location using browser geolocation API
  getUserLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
        resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error.message);
          // Fall back to default coordinates
          resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },

  getCurrentWeather: async (lat, lon) => {
    try {
      // If coordinates not provided, try to get user location
      if (!lat || !lon) {
        const location = await weatherService.getUserLocation();
        lat = location.lat;
        lon = location.lon;
      }
      
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  getForecast: async (lat, lon) => {
    try {
      // If coordinates not provided, try to get user location
      if (!lat || !lon) {
        const location = await weatherService.getUserLocation();
        lat = location.lat;
        lon = location.lon;
      }
      
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: API_KEY,
          cnt: 40 // Get 5 days of forecast data (8 data points per day)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  getDailyForecast: async (lat, lon) => {
    try {
      // If coordinates not provided, try to get user location
      if (!lat || !lon) {
        const location = await weatherService.getUserLocation();
        lat = location.lat;
        lon = location.lon;
      }
      
      // Get the 5-day forecast
      const forecastData = await weatherService.getForecast(lat, lon);
      
      // Group by day and get average values for each day
      const dailyData = [];
      const groupedByDay = {};
      
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        
        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        
        groupedByDay[date].push(item);
      });
      
      // Process each day to get a summary
      Object.keys(groupedByDay).forEach(date => {
        const dayData = groupedByDay[date];
        const totalTemp = dayData.reduce((sum, item) => sum + item.main.temp, 0);
        const avgTemp = Math.round(totalTemp / dayData.length);
        
        // Get the most common weather condition
        const weatherCounts = {};
        let maxCount = 0;
        let mostCommonWeather = null;
        
        dayData.forEach(item => {
          const weather = item.weather[0].main;
          weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
          
          if (weatherCounts[weather] > maxCount) {
            maxCount = weatherCounts[weather];
            mostCommonWeather = item.weather[0];
          }
        });
        
        dailyData.push({
          date,
          avgTemp,
          weather: mostCommonWeather,
          humidity: Math.round(dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length),
          windSpeed: Math.round(dayData.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.length * 10) / 10
        });
      });
      
      return dailyData.slice(0, 5); // Return just 5 days
    } catch (error) {
      console.error('Error processing daily forecast:', error);
      throw error;
    }
  }
};

export default weatherService; 