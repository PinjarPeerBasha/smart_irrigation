import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Schedule = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Irrigation Schedule
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          This page will display the irrigation schedules and allow you to create and manage them.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Schedule; 