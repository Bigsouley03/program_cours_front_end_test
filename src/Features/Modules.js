import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Modal,
  TextField,
} from '@mui/material';
import axios from 'axios';

export default function Modules() {
  const apiUrl = 'http://localhost:8000/api';

  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ moduleName: '' });
  const [openModalM, setOpenModalM] = useState(false);

  const paperStyle = {
    padding: '20px',
    height: '100%',
  };

  const typographyStyle = {
    fontSize: '24px',
  };

  const fetchModuleData = () => {
    // Fetch the list of modules from the API
    axios
      .get(`${apiUrl}/module`)
      .then((response) => {
        setModules(response.data.modules);
      })
      .catch((error) => {
        console.error('Error fetching modules:', error);
      });
  };

  // Function to open the modal for creating a new module
  const handleNewModule = () => {
    setOpenModalM(true);
  };

  // Function to handle the creation of a new module
  const handleCreateModule = () => {
    // Add the "status" attribute with the initial value of 0 to the newModule object
    const moduleData = { ...newModule, status: 0 };

    // Send the data to your API endpoint for module creation
    axios
      .post(`${apiUrl}/storeModule`, moduleData)
      .then(() => {
        // Close the modal and reset the form
        setOpenModalM(false);
        setNewModule({ moduleName: '' });

        // Call fetchModuleData to update the modules list
        fetchModuleData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Initial fetch of module data
    fetchModuleData();
  }, []); // Empty dependency array to fetch data only once

  return (
    <Grid item xs={12}>
      <Paper elevation={3} style={paperStyle}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" style={typographyStyle}>
            Liste des Modules
          </Typography>
          <Button variant="contained" color="primary" onClick={handleNewModule}>
            Nouveau Module
          </Button>
        </Box>
        <List>
          {modules.map((module) => (
            <ListItem key={module.id}>{module.moduleName}</ListItem>
          ))}
        </List>
      </Paper>
      <Modal open={openModalM} onClose={() => setOpenModalM(false)}>
        <Paper
          elevation={3}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            width: '300px',
          }}
        >
          <Typography variant="h5" style={typographyStyle}>
            Créer un nouveau module
          </Typography>
          <TextField
            label="Nom du module"
            variant="outlined"
            fullWidth
            value={newModule.moduleName}
            onChange={(e) => setNewModule({ moduleName: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleCreateModule}>
            Créer
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
}
