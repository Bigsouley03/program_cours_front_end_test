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
      .then((response) => {
        // Close the modal and reset the form
        setOpenModalM(false);
        setNewModule({ moduleName: '' });

        // Update the modules state with the new module
        setModules([...modules, response.data]);

        // Alternatively, you can directly access the moduleName
        // and add it to the list without another API call like this:
        // const { moduleName } = response.data;
        // setModules([...modules, { moduleName }]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Fetch the list of modules from the API
    axios
      .get(`${apiUrl}/module`)
      .then((response) => {
        setModules(response.data.modules);
      })
      .catch((error) => {
        console.error('Error fetching modules:', error);
      });
  }, []);

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
