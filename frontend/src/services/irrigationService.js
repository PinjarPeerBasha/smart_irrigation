const irrigationService = {
  /**
   * Calculate irrigation recommendation based on weather data
   * 
   * Formula based on:
   * - Temperature (higher temp = more water needed)
   * - Humidity (lower humidity = more water needed)
   * - Wind speed (higher wind = more water needed due to evaporation)
   * - Rain forecast (if rain is expected, less water is needed)
   */
  calculateIrrigationNeeds: (weather) => {
    // Base water needs in liters per square meter
    const baseWaterNeeds = 5;
    
    if (!weather || !weather.main) {
      return {
        recommendation: baseWaterNeeds,
        needsMoreWater: false,
        reasons: []
      };
    }
    
    // Temperature factor (higher temp = more water)
    const temp = weather.main.temp;
    let tempFactor = 1;
    let reasons = [];
    
    if (temp > 30) {
      tempFactor = 1.5;
      reasons.push("Extra water is needed due to high temperatures.");
    } else if (temp > 25) {
      tempFactor = 1.3;
      reasons.push("Additional water is needed due to warm temperatures.");
    }
    
    // Humidity factor (lower humidity = more water)
    const humidity = weather.main.humidity;
    let humidityFactor = 1;
    
    if (humidity < 30) {
      humidityFactor = 1.5;
      reasons.push("Additional water is needed due to low humidity.");
    } else if (humidity < 40) {
      humidityFactor = 1.2;
      reasons.push("Slightly more water is needed due to moderate humidity.");
    }
    
    // Wind factor (higher wind = more water due to evaporation)
    const windSpeed = weather.wind ? weather.wind.speed : 0;
    let windFactor = 1;
    
    if (windSpeed > 5) {
      windFactor = 1.2;
      reasons.push("More water is needed due to high wind speeds causing evaporation.");
    }
    
    // Calculating total water needs
    const totalWaterNeeds = baseWaterNeeds * tempFactor * humidityFactor * windFactor;
    
    // Round to one decimal place
    const roundedWaterNeeds = Math.round(totalWaterNeeds * 10) / 10;
    
    // Determine if additional water is needed compared to the baseline
    const needsMoreWater = roundedWaterNeeds > baseWaterNeeds;
    
    return {
      recommendation: roundedWaterNeeds,
      needsMoreWater,
      reasons
    };
  },
  
  /**
   * Get the best time of day to water plants based on weather conditions
   */
  getBestWateringTimes: (weather) => {
    // Default recommendation
    const defaultTimes = [
      {
        timeRange: "6-8 am",
        reasons: [
          "Low evaporation",
          "Good water absorption",
          "Water plants early in the day"
        ]
      },
      {
        timeRange: "4-6 pm",
        reasons: [
          "Cool weather",
          "Moisture in the soil throughout the night",
          "Less sunlight"
        ]
      }
    ];
    
    if (!weather) {
      return defaultTimes;
    }
    
    // Adjust based on specific conditions
    const adjustedTimes = [...defaultTimes];
    
    // If it's very hot, adjust morning time to be earlier
    if (weather.main && weather.main.temp > 32) {
      adjustedTimes[0].timeRange = "5-7 am";
      adjustedTimes[0].reasons.push("Earlier watering recommended due to extreme heat");
    }
    
    // If it's very windy, adjust to times when wind is typically lower
    if (weather.wind && weather.wind.speed > 6) {
      adjustedTimes[1].timeRange = "5-7 pm";
      adjustedTimes[1].reasons.push("Later evening watering to avoid high winds");
    }
    
    return adjustedTimes;
  },
  
  /**
   * Determine flood risk based on current weather and forecast
   */
  getFloodRisk: (currentWeather, forecast) => {
    if (!currentWeather || !forecast || !forecast.length) {
      return {
        risk: 'low',
        warning: null
      };
    }
    
    // Check if there's heavy rain in the current weather
    const isCurrentlyRaining = currentWeather.weather && 
      currentWeather.weather[0] && 
      currentWeather.weather[0].main === 'Rain';
    
    // Check forecast for continuous rain
    let consecutiveRainPeriods = 0;
    let heavyRainPeriods = 0;
    
    forecast.forEach(period => {
      if (period.weather && period.weather[0] && period.weather[0].main === 'Rain') {
        consecutiveRainPeriods++;
        
        // Check for heavy rain (rainfall > 7mm per 3h is considered heavy)
        if (period.rain && period.rain['3h'] && period.rain['3h'] > 7) {
          heavyRainPeriods++;
        }
      }
    });
    
    // Determine risk level
    let risk = 'low';
    let warning = null;
    
    if (heavyRainPeriods >= 2) {
      risk = 'high';
      warning = 'Heavy rainfall expected. High risk of flooding in low-lying areas.';
    } else if (consecutiveRainPeriods >= 3 || (isCurrentlyRaining && consecutiveRainPeriods >= 2)) {
      risk = 'moderate';
      warning = 'Continuous rain may cause localized flooding. Monitor water levels.';
    } else if (isCurrentlyRaining && heavyRainPeriods >= 1) {
      risk = 'moderate';
      warning = 'Current heavy rain may lead to quick water accumulation.';
    }
    
    return {
      risk,
      warning
    };
  },
  
  /**
   * Generate farmer's advisory based on current conditions
   */
  generateFarmerAdvisory: (weather) => {
    if (!weather || !weather.main) {
      return [];
    }
    
    const advisories = [];
    
    // Temperature-based advisories
    if (weather.main.temp > 30) {
      advisories.push("High Temperature - Extra irrigation needed");
      advisories.push("Consider shade for sensitive crops");
    }
    
    // Humidity-based advisories
    if (weather.main.humidity < 30) {
      advisories.push("Low Humidity - Extra irrigation needed");
    } else if (weather.main.humidity > 80) {
      advisories.push("High Humidity - Watch for fungal diseases");
    }
    
    // Wind-based advisories
    if (weather.wind && weather.wind.speed > 5) {
      advisories.push("High evaporation - Use mulching");
    }
    
    // Weather condition advisories
    if (weather.weather && weather.weather[0]) {
      const condition = weather.weather[0].main;
      
      if (condition === 'Rain') {
        advisories.push("Rainfall - Reduce irrigation accordingly");
      } else if (condition === 'Clear' && weather.main.temp > 28) {
        advisories.push("Sunny and hot - Monitor soil moisture closely");
      }
    }
    
    return advisories;
  }
};

export default irrigationService; 