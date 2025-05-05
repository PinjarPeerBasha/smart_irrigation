import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle } from '@mui/icons-material';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#4caf50' 
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Smart Irrigation System
          </Typography>
          
          <Box sx={{ display: 'flex' }}>
            <IconButton color="inherit" size="large">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" size="large">
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Sidebar open={open} onClose={handleDrawerToggle} />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* This creates space for the AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 