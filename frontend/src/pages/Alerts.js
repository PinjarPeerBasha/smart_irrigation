import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert as MuiAlert,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { 
  WarningAmber as WarningIcon, 
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as ResolvedIcon,
  Visibility as ViewIcon,
  DoneAll as MarkReadIcon,
  Build as ResolveIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import apiService from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    severity: '',
    read: '',
    resolved: 'false', // Default to showing unresolved alerts
    farmId: '',
    zoneId: ''
  });
  
  // For resolve dialog
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [currentAlertId, setCurrentAlertId] = useState(null);
  const [resolvedBy, setResolvedBy] = useState('');

  // For farms and zones
  const [farms, setFarms] = useState([]);
  const [zones, setZones] = useState([]);

  // Fetch alerts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch alerts
        try {
          const alertsData = await apiService.getAlerts({
            resolved: filters.resolved === 'true' ? true : 
                      filters.resolved === 'false' ? false : undefined
          });
          setAlerts(alertsData || []);
        } catch (error) {
          console.error('Error fetching alerts:', error);
          // Use sample data if API fails
          setAlerts([
            {
              id: 1,
              title: 'Soil Moisture Low',
              message: 'Soil moisture in North Field has dropped below threshold.',
              severity: 'warning',
              timestamp: '2023-06-10T14:30:00',
              read: false,
              resolved: false,
              zone: { id: 1, name: 'North Field' },
              farm: { id: 1, name: 'Main Farm' }
            },
            {
              id: 2,
              title: 'Irrigation System Failure',
              message: 'Sprinkler system in Greenhouse has failed to start.',
              severity: 'error',
              timestamp: '2023-06-09T08:15:00',
              read: true,
              resolved: false,
              zone: { id: 2, name: 'Greenhouse' },
              farm: { id: 1, name: 'Main Farm' }
            },
            {
              id: 3,
              title: 'Weather Alert',
              message: 'Heavy rain expected in the next 24 hours. Consider adjusting irrigation schedule.',
              severity: 'info',
              timestamp: '2023-06-08T17:45:00',
              read: false,
              resolved: false,
              farm: { id: 1, name: 'Main Farm' }
            }
          ]);
        }
        
        // Fetch farms and zones for filters
        try {
          const [farmsData, zonesData] = await Promise.all([
            apiService.getFarms(),
            apiService.getZones()
          ]);
          setFarms(farmsData || []);
          setZones(zonesData || []);
        } catch (error) {
          console.error('Error fetching farms and zones:', error);
          // Sample data
          setFarms([{ id: 1, name: 'Main Farm' }]);
          setZones([
            { id: 1, name: 'North Field', farm: { id: 1 } },
            { id: 2, name: 'Greenhouse', farm: { id: 1 } }
          ]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load alerts. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.resolved]);

  // Apply filters
  useEffect(() => {
    let filtered = [...alerts];
    
    if (filters.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }
    
    if (filters.read === 'true') {
      filtered = filtered.filter(alert => alert.read);
    } else if (filters.read === 'false') {
      filtered = filtered.filter(alert => !alert.read);
    }
    
    if (filters.farmId) {
      filtered = filtered.filter(alert => alert.farm?.id === parseInt(filters.farmId));
    }
    
    if (filters.zoneId) {
      filtered = filtered.filter(alert => alert.zone?.id === parseInt(filters.zoneId));
    }
    
    setFilteredAlerts(filtered);
  }, [alerts, filters]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      severity: '',
      read: '',
      resolved: 'false',
      farmId: '',
      zoneId: ''
    });
  };

  // Handle mark as read
  const handleMarkAsRead = async (alertId) => {
    try {
      await apiService.markAlertAsRead(alertId);
      
      // Update local state
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, read: true } : alert
        )
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
      alert('Failed to mark alert as read. Please try again.');
    }
  };

  // Open resolve dialog
  const openResolveDialog = (alertId) => {
    setCurrentAlertId(alertId);
    setResolveDialogOpen(true);
  };

  // Close resolve dialog
  const closeResolveDialog = () => {
    setResolveDialogOpen(false);
    setCurrentAlertId(null);
    setResolvedBy('');
  };

  // Handle resolve
  const handleResolve = async () => {
    if (!resolvedBy.trim()) {
      alert('Please enter who resolved this alert');
      return;
    }
    
    try {
      await apiService.markAlertAsResolved(currentAlertId, resolvedBy);
      
      // Update local state
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === currentAlertId ? { ...alert, resolved: true, resolvedBy } : alert
        )
      );
      
      closeResolveDialog();
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Failed to resolve alert. Please try again.');
    }
  };

  // Get icon based on severity
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'info': return <InfoIcon color="info" />;
      default: return <InfoIcon color="info" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <MuiAlert severity="error">{error}</MuiAlert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Alert Center</Typography>
        <Button 
          variant="outlined" 
          startIcon={<FilterIcon />}
          onClick={toggleFilters}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>
      
      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Filter Alerts</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Severity</InputLabel>
                <Select
                  name="severity"
                  value={filters.severity}
                  label="Severity"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Read Status</InputLabel>
                <Select
                  name="read"
                  value={filters.read}
                  label="Read Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Read</MenuItem>
                  <MenuItem value="false">Unread</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Resolution</InputLabel>
                <Select
                  name="resolved"
                  value={filters.resolved}
                  label="Resolution"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Resolved</MenuItem>
                  <MenuItem value="false">Unresolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Farm</InputLabel>
                <Select
                  name="farmId"
                  value={filters.farmId}
                  label="Farm"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Farms</MenuItem>
                  {farms.map(farm => (
                    <MenuItem key={farm.id} value={farm.id}>{farm.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Zone</InputLabel>
                <Select
                  name="zoneId"
                  value={filters.zoneId}
                  label="Zone"
                  onChange={handleFilterChange}
                  disabled={!filters.farmId}
                >
                  <MenuItem value="">All Zones</MenuItem>
                  {zones
                    .filter(zone => !filters.farmId || zone.farm?.id === parseInt(filters.farmId))
                    .map(zone => (
                      <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button fullWidth variant="outlined" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {filteredAlerts.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            No alerts found matching your criteria.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredAlerts.map((alert) => (
            <Grid item xs={12} key={alert.id}>
              <Card 
                sx={{ 
                  borderLeft: 4, 
                  borderColor: 
                    alert.severity === 'error' ? 'error.main' : 
                    alert.severity === 'warning' ? 'warning.main' : 'info.main',
                  opacity: alert.read ? 0.8 : 1,
                  bgcolor: alert.read ? 'action.hover' : 'background.paper'
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getSeverityIcon(alert.severity)}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {alert.title}
                        </Typography>
                        {!alert.read && (
                          <Chip size="small" label="New" color="primary" sx={{ ml: 1 }} />
                        )}
                        {alert.resolved && (
                          <Chip 
                            size="small" 
                            label="Resolved" 
                            color="success" 
                            icon={<ResolvedIcon />} 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {alert.message}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          size="small" 
                          label={alert.severity} 
                          color={
                            alert.severity === 'error' ? 'error' : 
                            alert.severity === 'warning' ? 'warning' : 'info'
                          }
                          sx={{ textTransform: 'capitalize' }}
                        />
                        {alert.farm && (
                          <Chip size="small" label={`Farm: ${alert.farm.name}`} />
                        )}
                        {alert.zone && (
                          <Chip size="small" label={`Zone: ${alert.zone.name}`} />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary" align="right">
                        {formatDate(alert.timestamp)}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="default" 
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton>
                        {!alert.read && (
                          <IconButton 
                            size="small" 
                            color="primary" 
                            title="Mark as Read"
                            onClick={() => handleMarkAsRead(alert.id)}
                          >
                            <MarkReadIcon />
                          </IconButton>
                        )}
                        {!alert.resolved && (
                          <IconButton 
                            size="small" 
                            color="success" 
                            title="Resolve Alert"
                            onClick={() => openResolveDialog(alert.id)}
                          >
                            <ResolveIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onClose={closeResolveDialog}>
        <DialogTitle>Resolve Alert</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Please provide the name of the person who resolved this issue:
          </Typography>
          <TextField
            fullWidth
            label="Resolved By"
            value={resolvedBy}
            onChange={(e) => setResolvedBy(e.target.value)}
            margin="normal"
            variant="outlined"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResolveDialog}>Cancel</Button>
          <Button onClick={handleResolve} variant="contained" color="primary">
            Resolve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Alerts; 