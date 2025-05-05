import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Drawer,
  Toolbar,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Landscape as FarmsIcon,
  Grass as ZonesIcon,
  WaterDrop as DevicesIcon,
  Schedule as SchedulesIcon,
  NotificationsActive as AlertsIcon,
  Settings as SettingsIcon,
  ChevronLeft as CollapseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Farms', icon: <FarmsIcon />, path: '/farms' },
    { text: 'Zones', icon: <ZonesIcon />, path: '/zones' },
    { text: 'Devices', icon: <DevicesIcon />, path: '/devices' },
    { text: 'Schedules', icon: <SchedulesIcon />, path: '/schedules' },
    { text: 'Alerts', icon: <AlertsIcon />, path: '/alerts' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          position: 'fixed',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center', 
        p: 2,
        mt: 0
      }}>
        <Box 
          component="div" 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            flex: 1
          }}
        >
          <DevicesIcon sx={{ color: '#4caf50', mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              color: '#4caf50', 
              fontWeight: 600,
              fontSize: '1.1rem',
              lineHeight: '1.2'
            }}
          >
            Irrigation<br />System
          </Typography>
        </Box>
        
        <IconButton 
          onClick={onClose}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <CollapseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? '#4caf50' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'medium' : 'regular',
                  color: location.pathname === item.path ? '#4caf50' : 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 