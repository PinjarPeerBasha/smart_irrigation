import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Info as InfoIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';

const FarmerAdvisoryCard = ({ advisories }) => {
  if (!advisories || !advisories.length) {
    return (
      <Card sx={{ height: '100%', bgcolor: '#e8f5e9' }}>
        <CardContent>
          <Typography variant="h6">Farmer's Advisory</Typography>
          <Typography variant="body2">No advisories at this time.</Typography>
        </CardContent>
      </Card>
    );
  }

  // Determine if an advisory is a warning (contains certain keywords)
  const isWarning = (advisory) => {
    const warningKeywords = ['high', 'low', 'extra', 'watch', 'avoid', 'caution', 'warning'];
    return warningKeywords.some(keyword => advisory.toLowerCase().includes(keyword));
  };

  return (
    <Card sx={{ height: '100%', bgcolor: '#e8f5e9' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Farmer's Advisory
        </Typography>
        
        <List dense disablePadding>
          {advisories.map((advisory, index) => (
            <ListItem key={index} disableGutters>
              <ListItemIcon sx={{ minWidth: 35 }}>
                {isWarning(advisory) ? (
                  <WarningIcon color="warning" fontSize="small" />
                ) : (
                  <InfoIcon color="info" fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={advisory} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: isWarning(advisory) ? 'medium' : 'regular'
                }} 
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default FarmerAdvisoryCard; 