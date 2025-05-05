import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  useTheme
} from '@mui/material';
import {
  DeviceHub as DeviceIcon,
  WaterDrop as WaterIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
//import apiService from '../services/apiService';
import apiService from '../services/api';

const Dashboard = () => {
  const theme = useTheme();

  const [stats, setStats] = useState({
    activeDevices: 0,
    totalDevices: 0,
    waterUsageToday: 0,
    waterChangePercent: 0,
    scheduledCount: 0,
    nextSchedule: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
      /*  const [devicesRes, waterRes, scheduleRes] = await Promise.all([
          apiService.getActiveDevices(),
          apiService.getWaterUsageToday(),
          apiService.getScheduledIrrigations()
        ]);

        setStats({
          activeDevices: devicesRes.active,
          totalDevices: devicesRes.total,
          waterUsageToday: waterRes.usage,
          waterChangePercent: waterRes.changePercent,
          scheduledCount: scheduleRes.count,
          nextSchedule: scheduleRes.next
        });*/

        console.info("calling getDashboardStats");

        const res = await apiService.getDashboardStats(); // This will call /api/stats/dashboard
        const stats = res;

        console.info("received getDashboardStats", stats);

        setStats({
          activeDevices: stats.activeDevices,
          totalDevices: stats.totalDevices,
          waterUsageToday: stats.waterUsageToday,
          waterChangePercent: stats.waterChangePercent,
          scheduledCount: stats.scheduledCount,
          nextSchedule: stats.nextSchedule
        });


      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setStats({
          activeDevices: 0,
          totalDevices: 0,
          waterUsageToday: 0,
          waterChangePercent: 0,
          scheduledCount: 0,
          nextSchedule: null
        });
      }
    };

    fetchData();
  }, []);

  return (
      <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
        <Typography variant="h5" fontWeight="600" color="primary" gutterBottom>
          Farm Activity & Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
              <CardHeader
                  avatar={<Avatar sx={{ bgcolor: theme.palette.success.main }}><DeviceIcon /></Avatar>}
                  title="Active Devices"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
              />
              <CardContent>
                <Typography variant="h4" align="center" color="primary" fontWeight="600">
                  {stats.activeDevices}
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary">
                  Out of {stats.totalDevices} total devices
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
              <CardHeader
                  avatar={<Avatar sx={{ bgcolor: theme.palette.info.main }}><WaterIcon /></Avatar>}
                  title="Water Usage Today"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
              />
              <CardContent>
                <Typography variant="h4" align="center" color="primary" fontWeight="600">
                  {stats.waterUsageToday} L
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary">
                  {stats.waterChangePercent > 0 ? `${stats.waterChangePercent}% more` : `${Math.abs(stats.waterChangePercent)}% less`} than yesterday
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
              <CardHeader
                  avatar={<Avatar sx={{ bgcolor: theme.palette.warning.main }}><ScheduleIcon /></Avatar>}
                  title="Scheduled Irrigations"
                  titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
              />
              <CardContent>
                <Typography variant="h4" align="center" color="primary" fontWeight="600">
                  {stats.scheduledCount}
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary">
                  Next: {stats.nextSchedule ? stats.nextSchedule : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
  );
};

export default Dashboard;
