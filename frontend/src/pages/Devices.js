import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  CircularProgress, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  WaterDrop as WaterDropIcon
} from '@mui/icons-material';
import apiService from '../services/api';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentDevice, setCurrentDevice] = useState({
    name: '',
    deviceId: '',
    type: 'sprinkler',
    status: 'inactive',
    flowRate: 0,
    zoneId: ''
  });

  // Fetch devices and zones
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch devices
        try {
          const devicesData = await apiService.getDevices();
          setDevices(devicesData || []);
        } catch (error) {
          console.error('Error fetching devices:', error);
          // Use sample data if API fails
          setDevices([
            {
              id: 1,
              deviceId: 'SPR-001',
              name: 'North Field Sprinkler',
              type: 'sprinkler',
              status: 'active',
              isActive: true,
              flowRate: 20.5,
              zone: { id: 1, name: 'North Field' }
            },
            {
              id: 2,
              deviceId: 'DRP-002',
              name: 'Greenhouse Drip System',
              type: 'drip',
              status: 'inactive',
              isActive: false,
              flowRate: 5.2,
              zone: { id: 2, name: 'Greenhouse' }
            }
          ]);
        }
        
        // Fetch zones
        try {
          const zonesData = await apiService.getZones();
          setZones(zonesData || []);
        } catch (error) {
          console.error('Error fetching zones:', error);
          // Use sample data if API fails
          setZones([
            { id: 1, name: 'North Field' },
            { id: 2, name: 'Greenhouse' },
            { id: 3, name: 'South Orchard' }
          ]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load devices. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle device control
  const handleDeviceControl = async (deviceId, action) => {
    try {
      await apiService.controlDevice(deviceId, action);
      
      // Update the device in the local state
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId
            ? { 
                ...device, 
                isActive: action === 'start', 
                status: action === 'start' ? 'active' : 'inactive' 
              }
            : device
        )
      );
    } catch (error) {
      console.error(`Error ${action === 'start' ? 'starting' : 'stopping'} device:`, error);
      alert(`Failed to ${action} device. Please try again.`);
    }
  };

  // Handle dialog open
  const handleOpenDialog = (mode, device = null) => {
    setDialogMode(mode);
    if (device) {
      setCurrentDevice({
        ...device,
        zoneId: device.zone ? device.zone.id : ''
      });
    } else {
      setCurrentDevice({
        name: '',
        deviceId: '',
        type: 'sprinkler',
        status: 'inactive',
        flowRate: 0,
        zoneId: zones.length > 0 ? zones[0].id : ''
      });
    }
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentDevice(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle save device
  const handleSaveDevice = async () => {
    try {
      // Prepare device data
      const deviceData = {
        ...currentDevice,
        zone: { id: currentDevice.zoneId }
      };
      
      let savedDevice;
      if (dialogMode === 'add') {
        savedDevice = await apiService.createDevice(deviceData);
      } else {
        savedDevice = await apiService.updateDevice(currentDevice.id, deviceData);
      }
      
      // Update local state
      if (dialogMode === 'add') {
        setDevices(prev => [...prev, savedDevice]);
      } else {
        setDevices(prev => 
          prev.map(device => device.id === savedDevice.id ? savedDevice : device)
        );
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving device:', error);
      alert('Failed to save device. Please try again.');
    }
  };

  // Handle delete device
  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await apiService.deleteDevice(deviceId);
        setDevices(prev => prev.filter(device => device.id !== deviceId));
      } catch (error) {
        console.error('Error deleting device:', error);
        alert('Failed to delete device. Please try again.');
      }
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Irrigation Devices</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Add Device
        </Button>
      </Box>
      
      {devices.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            No irrigation devices found. Add your first device to get started.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Flow Rate (L/min)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.deviceId}</TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WaterDropIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {device.type}
                    </Box>
                  </TableCell>
                  <TableCell>{device.zone?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: device.isActive ? 'success.main' : 'text.secondary'
                    }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: device.isActive ? 'success.main' : 'text.disabled',
                          mr: 1,
                        }}
                      />
                      {device.status || (device.isActive ? 'active' : 'inactive')}
                    </Box>
                  </TableCell>
                  <TableCell>{device.flowRate}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog('edit', device)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteDevice(device.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                    {device.isActive ? (
                      <IconButton 
                        color="warning" 
                        onClick={() => handleDeviceControl(device.id, 'stop')}
                        size="small"
                      >
                        <StopIcon />
                      </IconButton>
                    ) : (
                      <IconButton 
                        color="success" 
                        onClick={() => handleDeviceControl(device.id, 'start')}
                        size="small"
                      >
                        <StartIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Device Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Device' : 'Edit Device'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Device Name"
                fullWidth
                value={currentDevice.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="deviceId"
                label="Device ID"
                fullWidth
                value={currentDevice.deviceId}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={currentDevice.type}
                  label="Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="sprinkler">Sprinkler</MenuItem>
                  <MenuItem value="drip">Drip System</MenuItem>
                  <MenuItem value="pivot">Center Pivot</MenuItem>
                  <MenuItem value="micro">Micro Irrigation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Zone</InputLabel>
                <Select
                  name="zoneId"
                  value={currentDevice.zoneId}
                  label="Zone"
                  onChange={handleInputChange}
                >
                  {zones.map(zone => (
                    <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="flowRate"
                label="Flow Rate (L/min)"
                type="number"
                fullWidth
                value={currentDevice.flowRate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={currentDevice.isActive}
                    onChange={handleInputChange}
                  />
                }
                label="Device Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveDevice} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Devices; 