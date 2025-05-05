import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

const Settings = () => {
  const [tab, setTab] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // User settings
  const [userSettings, setUserSettings] = useState({
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '555-123-4567',
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    enableNotifications: true,
    enableSmsAlerts: true,
    enableEmailAlerts: true,
    moistureThreshold: 30,
    temperatureThreshold: 32,
    measurementIntervalMinutes: 15,
  });

  // API settings
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Weather API', key: 'wth_87dys82jduw82js', createdAt: '2023-01-15' },
    { id: 2, name: 'Sensor Integration', key: 'sen_29sjd92jsd2js', createdAt: '2023-03-22' }
  ]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleUserChange = (e) => {
    setUserSettings({
      ...userSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleSystemChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSystemSettings({
      ...systemSettings,
      [e.target.name]: value
    });
  };

  const handleSaveSettings = () => {
    // Here you would actually save the settings to your backend
    console.log('Saving settings:', { userSettings, systemSettings });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteApiKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleAddApiKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: 'New API Key',
      key: `key_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="User Profile" />
          <Tab label="System Settings" />
          <Tab label="API Keys" />
        </Tabs>
        <Divider />

        {/* User Profile Settings */}
        {tab === 0 && (
          <Box p={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={userSettings.email}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={userSettings.phoneNumber}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={userSettings.firstName}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={userSettings.lastName}
                  onChange={handleUserChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                >
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* System Settings */}
        {tab === 1 && (
          <Box p={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      name="enableNotifications"
                      checked={systemSettings.enableNotifications}
                      onChange={handleSystemChange}
                      color="primary"
                    />
                  }
                  label="Enable Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="enableSmsAlerts"
                      checked={systemSettings.enableSmsAlerts}
                      onChange={handleSystemChange}
                      color="primary"
                    />
                  }
                  label="SMS Alerts for Critical Issues"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="enableEmailAlerts"
                      checked={systemSettings.enableEmailAlerts}
                      onChange={handleSystemChange}
                      color="primary"
                    />
                  }
                  label="Email Alerts"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Thresholds
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Moisture Threshold (%)"
                  name="moistureThreshold"
                  type="number"
                  value={systemSettings.moistureThreshold}
                  onChange={handleSystemChange}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Temperature Threshold (°C)"
                  name="temperatureThreshold"
                  type="number"
                  value={systemSettings.temperatureThreshold}
                  onChange={handleSystemChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Measurement Interval (minutes)"
                  name="measurementIntervalMinutes"
                  type="number"
                  value={systemSettings.measurementIntervalMinutes}
                  onChange={handleSystemChange}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* API Keys */}
        {tab === 2 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                API Keys
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleAddApiKey}
              >
                Generate New Key
              </Button>
            </Box>
            <List>
              {apiKeys.map((apiKey) => (
                <ListItem key={apiKey.id} divider>
                  <ListItemText 
                    primary={apiKey.name} 
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {apiKey.key}
                        </Typography>
                        <br />
                        <Typography component="span" variant="caption">
                          Created: {apiKey.createdAt}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleDeleteApiKey(apiKey.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {savedSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}
    </Box>
  );
};

export default Settings; 