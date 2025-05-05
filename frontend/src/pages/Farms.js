import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Landscape as LandscapeIcon,
  Grass as GrassIcon,
  ExpandMore as ExpandMoreIcon,
  Place as PlaceIcon,
  WaterDrop as WaterIcon 
} from '@mui/icons-material';
import apiService from '../services/api';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [openFarmDialog, setOpenFarmDialog] = useState(false);
  const [openZoneDialog, setOpenZoneDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentFarm, setCurrentFarm] = useState({
    name: '',
    location: '',
    size: '',
    description: ''
  });
  const [currentZone, setCurrentZone] = useState({
    name: '',
    description: '',
    size: '',
    soilType: '',
    farmId: null
  });

  // Fetch farms
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch farms with their zones
        try {

          console.info("Allallllllllllllllllllllllll Forms.js fetchData");
          const farmsData = await apiService.getFarms();
          const farmsWithZones = await Promise.all(
            farmsData.map(async (farm) => {
             //const farmId = typeof farm.id === 'object' ? farm.id.value : farm.id;
              //console.info('formID Befpre getZones ', farmId);
              const zones = await apiService.getZones({ farmId : farm.id });
              console.info('formID ', farm.id);
              console.info('zones ', zones);
              return { ...farm, zones: zones || [] };
            })
          );
          setFarms(farmsWithZones);
        } catch (error) {
          console.error('Error fetching farms:', error);
          // Use sample data if API fails
          setFarms([
            {
              id: 1,
              name: 'Main Farm',
              location: '123 Farm Road, Farmville',
              size: '50 acres',
              description: 'Our main production farm with diverse crops.',
              zones: [
                {
                  id: 1,
                  name: 'North Field',
                  size: '15 acres',
                  soilType: 'Clay loam',
                  description: 'Field for wheat and barley.'
                },
                {
                  id: 2,
                  name: 'Greenhouse',
                  size: '5 acres',
                  soilType: 'Potting mix',
                  description: 'Climate controlled greenhouse for vegetables.'
                }
              ]
            },
            {
              id: 2,
              name: 'South Orchard',
              location: '456 Orchard Lane, Farmville',
              size: '30 acres',
              description: 'Fruit orchard with apple, pear, and peach trees.',
              zones: [
                {
                  id: 3,
                  name: 'Apple Section',
                  size: '10 acres',
                  soilType: 'Loamy',
                  description: 'Section devoted to apple trees.'
                }
              ]
            }
          ]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load farms. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle farm dialog open
  const handleOpenFarmDialog = (mode, farm = null) => {
    setDialogMode(mode);
    if (farm) {
      setCurrentFarm({
        ...farm,
        // Exclude zones array
        zones: undefined
      });
    } else {
      setCurrentFarm({
        name: '',
        location: '',
        size: '',
        description: ''
      });
    }
    setOpenFarmDialog(true);
  };

  // Handle farm dialog close
  const handleCloseFarmDialog = () => {
    setOpenFarmDialog(false);
  };

  // Handle zone dialog open
  const handleOpenZoneDialog = (mode, farmId = null, zone = null) => {
    setDialogMode(mode);
    if (zone) {
      setCurrentZone({
        ...zone,
        farmId: farmId
      });
    } else {
      setCurrentZone({
        name: '',
        description: '',
        size: '',
        soilType: '',
        farmId: farmId
      });
    }
    setOpenZoneDialog(true);
  };

  // Handle zone dialog close
  const handleCloseZoneDialog = () => {
    setOpenZoneDialog(false);
  };

  // Handle form input change for farm
  const handleFarmInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFarm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form input change for zone
  const handleZoneInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentZone(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save farm
  const handleSaveFarm = async () => {
    try {
      // Validate required fields
      if (!currentFarm.name || !currentFarm.location) {
        alert('Please fill in all required fields');
        return;
      }
      
      let savedFarm;
      if (dialogMode === 'add') {
        savedFarm = await apiService.createFarm(currentFarm);
        savedFarm.zones = []; // Initialize empty zones array
        setFarms(prev => [...prev, savedFarm]);
      } else {
        savedFarm = await apiService.updateFarm(currentFarm.id, currentFarm);
        // Preserve zones array from previous state
        const existingFarm = farms.find(f => f.id === currentFarm.id);
        savedFarm.zones = existingFarm?.zones || [];
        setFarms(prev => 
          prev.map(farm => farm.id === savedFarm.id ? savedFarm : farm)
        );
      }
      
      handleCloseFarmDialog();
    } catch (error) {
      console.error('Error saving farm:', error);
      alert('Failed to save farm. Please try again.');
    }
  };

  // Handle save zone
  const handleSaveZone = async () => {
    try {
      // Validate required fields
      if (!currentZone.name || !currentZone.farmId) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Prepare zone data with farm reference
      const zoneData = {
        ...currentZone,
        farm: { id: currentZone.farmId }
      };
      delete zoneData.farmId;
      
      let savedZone;
      if (dialogMode === 'add') {
        savedZone = await apiService.createZone(zoneData);
        
        // Update local state by adding the new zone
        setFarms(prev => 
          prev.map(farm => 
            farm.id === savedZone.farm.id 
              ? { ...farm, zones: [...farm.zones, savedZone] }
              : farm
          )
        );
      } else {
        savedZone = await apiService.updateZone(currentZone.id, zoneData);
        
        // Update local state by replacing the existing zone
        setFarms(prev => 
          prev.map(farm => 
            farm.id === savedZone.farm.id 
              ? { 
                  ...farm, 
                  zones: farm.zones.map(zone => 
                    zone.id === savedZone.id ? savedZone : zone
                  ) 
                }
              : farm
          )
        );
      }
      
      handleCloseZoneDialog();
    } catch (error) {
      console.error('Error saving zone:', error);
      alert('Failed to save zone. Please try again.');
    }
  };

  // Handle delete farm
  const handleDeleteFarm = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm? This will also delete all associated zones.')) {
      try {
        await apiService.deleteFarm(farmId);
        setFarms(prev => prev.filter(farm => farm.id !== farmId));
      } catch (error) {
        console.error('Error deleting farm:', error);
        alert('Failed to delete farm. Please try again.');
      }
    }
  };

  // Handle delete zone
  const handleDeleteZone = async (zoneId, farmId) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      try {
        await apiService.deleteZone(zoneId);
        
        // Update local state
        setFarms(prev => 
          prev.map(farm => 
            farm.id === farmId
              ? { ...farm, zones: farm.zones.filter(zone => zone.id !== zoneId) }
              : farm
          )
        );
      } catch (error) {
        console.error('Error deleting zone:', error);
        alert('Failed to delete zone. Please try again.');
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
        <Typography variant="h4">Farms & Zones</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenFarmDialog('add')}
        >
          Add Farm
        </Button>
      </Box>
      
      {farms.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            No farms found. Add your first farm to get started.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {farms.map((farm) => (
            <Grid item xs={12} key={farm.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LandscapeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                      <Typography variant="h5" component="div">
                        {farm.name}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenFarmDialog('edit', farm)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteFarm(farm.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography color="text.secondary" gutterBottom>
                        <PlaceIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'text-bottom' }} />
                        {farm.location}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {farm.description}
                      </Typography>
                      <Chip 
                        label={farm.size} 
                        size="small" 
                        variant="outlined" 
                        sx={{ mr: 1 }} 
                      />
                      <Chip 
                        label={`${farm.zones?.length || 0} Zones`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1">
                          Zones
                        </Typography>
                        <Button 
                          size="small" 
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenZoneDialog('add', farm.id)}
                        >
                          Add Zone
                        </Button>
                      </Box>
                      <Divider sx={{ mb: 1 }} />
                      
                      {farm.zones?.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No zones defined for this farm yet.
                        </Typography>
                      ) : (
                        <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                          {farm.zones?.map((zone) => (
                            <Accordion key={zone.id} disableGutters>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`zone-${zone.id}-content`}
                                id={`zone-${zone.id}-header`}
                              >
                                <GrassIcon sx={{ mr: 1, color: 'success.main' }} />
                                <Typography>{zone.name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {zone.description || 'No description provided.'}
                                </Typography>
                                <Grid container spacing={1} sx={{ mb: 1 }}>
                                  <Grid item>
                                    <Chip 
                                      label={zone.size} 
                                      size="small" 
                                      variant="outlined" 
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Chip 
                                      icon={<WaterIcon />}
                                      label={zone.soilType} 
                                      size="small" 
                                      variant="outlined" 
                                    />
                                  </Grid>
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleOpenZoneDialog('edit', farm.id, zone)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteZone(zone.id, farm.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </List>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Farm Form Dialog */}
      <Dialog open={openFarmDialog} onClose={handleCloseFarmDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Farm' : 'Edit Farm'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Farm Name *"
                fullWidth
                value={currentFarm.name}
                onChange={handleFarmInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location *"
                fullWidth
                value={currentFarm.location}
                onChange={handleFarmInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="size"
                label="Size (e.g., 50 acres)"
                fullWidth
                value={currentFarm.size}
                onChange={handleFarmInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={currentFarm.description}
                onChange={handleFarmInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFarmDialog}>Cancel</Button>
          <Button onClick={handleSaveFarm} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Zone Form Dialog */}
      <Dialog open={openZoneDialog} onClose={handleCloseZoneDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Zone' : 'Edit Zone'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Zone Name *"
                fullWidth
                value={currentZone.name}
                onChange={handleZoneInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="size"
                label="Size (e.g., 10 acres)"
                fullWidth
                value={currentZone.size}
                onChange={handleZoneInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="soilType"
                label="Soil Type"
                fullWidth
                value={currentZone.soilType}
                onChange={handleZoneInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={currentZone.description}
                onChange={handleZoneInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseZoneDialog}>Cancel</Button>
          <Button onClick={handleSaveZone} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Farms; 