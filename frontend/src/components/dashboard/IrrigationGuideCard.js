import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  WaterDrop as WaterIcon,
  ArrowUpward as MoreWaterIcon,
  ArrowDownward as LessWaterIcon,
  Grass as PlantIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const IrrigationGuideCard = ({ irrigationData }) => {
  if (!irrigationData) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6">Irrigation Guide</Typography>
          <Typography variant="body2">Loading irrigation data...</Typography>
        </CardContent>
      </Card>
    );
  }

  const { recommendation, needsMoreWater, reasons } = irrigationData;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Irrigation Guide
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom>
          Today's Irrigation Recommendation
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          color: needsMoreWater ? 'warning.main' : 'success.main'
        }}>
          {needsMoreWater ? (
            <WarningIcon sx={{ mr: 1 }} />
          ) : (
            <WaterIcon sx={{ mr: 1 }} />
          )}
          <Typography variant="subtitle1" fontWeight="medium">
            {needsMoreWater ? 'Needs more water' : 'Normal watering'}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center', 
          py: 2, 
          mb: 2,
          bgcolor: 'primary.light',
          color: 'white',
          borderRadius: 1
        }}>
          <WaterIcon sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h4" component="div">
            {recommendation} liters/square meter
          </Typography>
        </Box>
        
        {reasons.length > 0 && (
          <>
            <List dense disablePadding>
              {reasons.map((reason, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <PlantIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={reason} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
          </>
        )}
        
        <Typography variant="subtitle1" gutterBottom>
          Best time of day to water
        </Typography>
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1" fontWeight="medium">
            6-8 am
          </Typography>
          <List dense disablePadding>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <WaterIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Low evaporation" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <WaterIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Good water absorption" />
            </ListItem>
          </List>
        </Box>
        
        <Box>
          <Typography variant="body1" fontWeight="medium">
            4-6 pm
          </Typography>
          <List dense disablePadding>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <WaterIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Cool weather" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <WaterIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Less sunlight" />
            </ListItem>
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IrrigationGuideCard; 