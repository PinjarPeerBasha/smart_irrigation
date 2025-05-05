import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
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
  Grid,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import apiService from '../services/api';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentSchedule, setCurrentSchedule] = useState({
    name: '',
    startTime: new Date().toISOString().split('.')[0],
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().split('.')[0], // Default to 1 hour later
    status: 'scheduled',
    zoneId: '',
    recurrence: 'once' // once, daily, weekly
  });

  // Fetch schedules and zones
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch schedules
        try {
          const schedulesData = await apiService.getSchedules();
          setSchedules(schedulesData || []);
        } catch (error) {
          console.error('Error fetching schedules:', error);
          // Use sample data if API fails
          setSchedules([
            {
              id: 1,
              name: 'Daily Morning Watering',
              startTime: '2023-06-10T06:00:00',
              endTime: '2023-06-10T06:30:00',
              status: 'scheduled',
              recurrence: 'daily',
              zone: { id: 1, name: 'North Field' }
            },
            {
              id: 2,
              name: 'Weekly Deep Watering',
              startTime: '2023-06-15T07:00:00',
              endTime: '2023-06-15T08:30:00',
              status: 'scheduled',
              recurrence: 'weekly',
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
        setError('Failed to load schedules. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle schedule control
  const handleScheduleControl = async (scheduleId, action) => {
    try {
      if (action === 'execute') {
        await apiService.executeSchedule(scheduleId);
      } else if (action === 'cancel') {
        await apiService.cancelSchedule(scheduleId);
      }
      
      // Refresh schedules
      const schedulesData = await apiService.getSchedules();
      setSchedules(schedulesData || []);
    } catch (error) {
      console.error(`Error ${action}ing schedule:`, error);
      alert(`Failed to ${action} schedule. Please try again.`);
    }
  };

  // Handle dialog open
  const handleOpenDialog = (mode, schedule = null) => {
    setDialogMode(mode);
    if (schedule) {
      setCurrentSchedule({
        ...schedule,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        zoneId: schedule.zone ? schedule.zone.id : ''
      });
    } else {
      setCurrentSchedule({
        name: '',
        startTime: new Date().toISOString().split('.')[0],
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().split('.')[0],
        status: 'scheduled',
        recurrence: 'once',
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
    const { name, value } = e.target;
    setCurrentSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'scheduled': return 'info';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Handle save schedule
  const handleSaveSchedule = async () => {
    try {
      // Validate end time is after start time
      if (new Date(currentSchedule.endTime) <= new Date(currentSchedule.startTime)) {
        alert('End time must be after start time');
        return;
      }

      const start = new Date(currentSchedule.startTime);
      const end = new Date(currentSchedule.endTime);
      const durationMinutes = Math.floor((end - start) / (1000 * 60));

      const isRecurring = currentSchedule.recurrence !== "once";
      const recurringTime = isRecurring ? currentSchedule.startTime.slice(11, 16) : null;

      const scheduleData = {
        scheduledStartTime: currentSchedule.startTime,
        durationMinutes: durationMinutes,
        name: currentSchedule.name,
        status: currentSchedule.status,
        zoneId: currentSchedule.zoneId,
        isRecurring: isRecurring,
        recurringDays: isRecurring ? currentSchedule.recurrence : "once",
        recurringTime: recurringTime,
        isAutomated: false,
        zone: { id: currentSchedule.zoneId }
      };


      /* const localStart = new Date(currentSchedule.startTime);
       const localEnd = new Date(currentSchedule.endTime);

       // Convert to UTC ISO strings
       const scheduledStartTimeUTC = new Date(localStart.getTime() - localStart.getTimezoneOffset() * 60000).toISOString();
       const scheduledEndTimeUTC = new Date(localEnd.getTime() - localEnd.getTimezoneOffset() * 60000).toISOString();

       // Validate
       if (localEnd <= localStart) {
         alert('End time must be after start time');
         return;
       }

       const durationMinutes = Math.floor((localEnd - localStart) / (1000 * 60));

       const isRecurring = currentSchedule.recurrence !== "once";

       // Get recurring time in UTC "HH:mm" format
       const utcHours = localStart.getUTCHours();
       const utcMinutes = localStart.getUTCMinutes();
       const recurringTime = isRecurring
           ? `${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}`
           : null;

       const scheduleData = {
         scheduledStartTime: scheduledStartTimeUTC,
         durationMinutes: durationMinutes,
         name: currentSchedule.name,
         status: currentSchedule.status,
         zoneId: currentSchedule.zoneId,
         isRecurring: isRecurring,
         recurringDays: isRecurring ? currentSchedule.recurrence : "once",
         recurringTime: recurringTime,
         isAutomated: false,
         zone: { id: currentSchedule.zoneId }
       };
 */
     /* // Prepare schedule data
      const scheduleData = {
        ...currentSchedule,
        zone: { id: currentSchedule.zoneId }
      };*/
      //delete scheduleData.zoneId;
      
      let savedSchedule;
      if (dialogMode === 'add') {
        savedSchedule = await apiService.createSchedule(scheduleData);
      } else {
        savedSchedule = await apiService.updateSchedule(currentSchedule.id, scheduleData);
      }
      
      // Refresh schedules
      const schedulesData = await apiService.getSchedules();
      setSchedules(schedulesData || []);
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule. Please try again.');
    }
  };

  // Handle delete schedule
  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await apiService.deleteSchedule(scheduleId);
        setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Failed to delete schedule. Please try again.');
      }
    }
  };

  // Format date/time
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);

      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours-1}:${minutes}`;

     /* const [datePart, timePart] = dateString.split('T') ?? dateString.split(' ');
      const [hour, minute] = timePart?.split(':') ?? [];

      return `${datePart} ${hour}:${minute}`;*/
    /*  return date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });*/
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Irrigation Schedules</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Add Schedule
        </Button>
      </Box>
      
      {schedules.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            No irrigation schedules found. Add your first schedule to get started.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Recurrence</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {schedule.name}
                    </Box>
                  </TableCell>
                  <TableCell>{schedule.zone?.name || 'Unknown'}</TableCell>
                  <TableCell>{formatDateTime(schedule.startTime)}</TableCell>
                  <TableCell>{formatDateTime(schedule.endTime)}</TableCell>
                  <TableCell style={{ textTransform: 'capitalize' }}>{schedule.recurrence}</TableCell>
                  <TableCell>
                    <Chip 
                      label={schedule.status} 
                      color={getStatusColor(schedule.status)} 
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog('edit', schedule)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                    {schedule.status === 'scheduled' ? (
                      <>
                        <IconButton 
                          color="success" 
                          onClick={() => handleScheduleControl(schedule.id, 'execute')}
                          size="small"
                          title="Execute now"
                        >
                          <StartIcon />
                        </IconButton>
                        <IconButton 
                          color="warning" 
                          onClick={() => handleScheduleControl(schedule.id, 'cancel')}
                          size="small"
                          title="Cancel schedule"
                        >
                          <StopIcon />
                        </IconButton>
                      </>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Schedule Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Schedule' : 'Edit Schedule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Schedule Name"
                fullWidth
                value={currentSchedule.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Zone</InputLabel>
                <Select
                  name="zoneId"
                  value={currentSchedule.zoneId}
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
                name="startTime"
                label="Start Time"
                type="datetime-local"
                fullWidth
                value={currentSchedule.startTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="endTime"
                label="End Time"
                type="datetime-local"
                fullWidth
                value={currentSchedule.endTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Recurrence</InputLabel>
                <Select
                  name="recurrence"
                  value={currentSchedule.recurrence}
                  label="Recurrence"
                  onChange={handleInputChange}
                >
                  <MenuItem value="once">Once</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSchedule} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Schedules; 