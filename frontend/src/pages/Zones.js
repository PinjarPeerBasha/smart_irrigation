import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Grid,
    Chip,
    Alert,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    Sensors as SensorsIcon
} from '@mui/icons-material';
import apiService from '../services/api';

const Zones = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchZonesWithDevices = async () => {
            try {
                const zonesData = await apiService.getZones();
                const zonesWithDevices = await Promise.all(
                    zonesData.map(async (zone) => {
                        const devices = await apiService.getDevices({ zoneId: zone.id });
                        return { ...zone, devices: devices || [] };
                    })
                );
                setZones(zonesWithDevices);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching zones:', err);
                setError('Failed to load zones.');
                setLoading(false);
            }
        };

        fetchZonesWithDevices();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">{error}</Alert>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Zones & Devices</Typography>
                <Button variant="contained" startIcon={<AddIcon />}>Add Zone</Button>
            </Box>

            <Grid container spacing={3}>
                {zones.map((zone) => (
                    <Grid item xs={12} key={zone.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">{zone.name}</Typography>
                                    <Box>
                                        <IconButton size="small" color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {zone.description || 'No description provided.'}
                                </Typography>
                                <Chip label={zone.size} size="small" sx={{ mr: 1 }} />
                                <Chip label={zone.soilType} size="small" />

                                <Box mt={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1">Devices</Typography>
                                        <Button size="small" startIcon={<AddIcon />}>Add Device</Button>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />

                                    {zone.devices.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">
                                            No devices added in this zone.
                                        </Typography>
                                    ) : (
                                        <List dense>
                                            {zone.devices.map((device) => (
                                                <Accordion key={device.id} disableGutters>
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                        <SensorsIcon sx={{ mr: 1, color: 'info.main' }} />
                                                        <Typography>{device.name}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography variant="body2">{device.description || 'No description'}</Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            <IconButton size="small" color="primary">
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton size="small" color="error">
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))}
                                        </List>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Zones;
