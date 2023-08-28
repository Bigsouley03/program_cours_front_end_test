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
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/semestre"  >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Semestres" />
        </ListItemButton>
        <ListItemButton component={Link} to="/modules" >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Modules" />
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
        <ListItemButton component={Link} to="/integrations" >
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Integrations" />
        </ListItemButton>
        <ListItemButton component={Link} to="/createcourse" >
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Creer Cours" />
        </ListItemButton>

      </List>
    </div>
  );
}

export default Sidebar;
