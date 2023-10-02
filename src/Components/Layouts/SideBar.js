import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';

function Sidebar( ) {
  return (
    <div>
      <Divider />
      <List>
        <ListItemButton component={Link} to="/"  >
          <ListItemIcon>
          <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/semestre"  >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Semestres" />
        </ListItemButton>
        <ListItemButton component={Link} to="/ue" >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="U.E" />
        </ListItemButton>
        <ListItemButton component={Link} to="/modules" >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Modules" />
        </ListItemButton>
        <ListItemButton component={Link} to="/programmes">
          <ListItemIcon>
          <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Programmes" />
        </ListItemButton>
        <ListItemButton component={Link} to="/professeurs">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Professeurs" />
        </ListItemButton>
        <ListItemButton component={Link} to="/classes" >
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Classes" />
        </ListItemButton>
        <ListItemButton component={Link} to="/courses" >
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Cours" />
        </ListItemButton>


      </List>
    </div>
  );
}

export default Sidebar;
