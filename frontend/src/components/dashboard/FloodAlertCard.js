import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip
} from '@mui/material';
import { 
  WaterDrop as WaterIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const FloodAlertCard = ({ floodData }) => {
  if (!floodData) {
    return null;
  }

  const { risk, warning } = floodData;
  
  // If risk is low and no warning, don't display the card
  if (risk === 'low' && !warning) {
    return null;
  }

  // Set color based on risk level
  const getRiskColor = () => {
    switch (risk) {
      case 'high':
        return 'error';
      case 'moderate':
        return 'warning';
      default:
        return 'info';
    }
  };

  // Get risk icon based on risk level
  const getRiskIcon = () => {
    if (risk === 'high') {
      return <WarningIcon />;
    }
    return <WaterIcon />;
  };

  return (
    <Card sx={{ 
      height: '100%', 
      bgcolor: risk === 'high' ? '#ffebee' : '#e3f2fd',
      borderLeft: 5,
      borderColor: getRiskColor() + '.main'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 1, color: getRiskColor() + '.main' }}>
            {getRiskIcon()}
          </Box>
          <Typography variant="h6">
            Flood Alert
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Chip 
            label={risk.toUpperCase()} 
            color={getRiskColor()} 
            size="small" 
            variant="filled" 
          />
        </Box>
        
        {warning && (
          <Typography variant="body2" color="text.secondary">
            {warning}
          </Typography>
        )}
        
        <Typography variant="body2" sx={{ mt: 1 }}>
          Flood forecasts and warnings
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FloodAlertCard; 