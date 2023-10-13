import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  List,
  ListItem,
} from '@mui/material';

const paperStyle = {
  padding: '20px',
  height: '100%',
};

const typographyStyle = {
  fontSize: '24px',
};

export default function Ue() {
  const apiUrl = 'http://localhost:8000/api';
  const [openModal, setOpenModal] = useState(false);
  const [newUe, setNewUe] = useState({ table_ue_id: '', classe_id: '' });
  const [tableUes, setTableUes] = useState([]);
  const [programUes, setProgramUes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');


  useEffect(() => {
    // Fetch the list of classes
    axios
      .get(`${apiUrl}/classe`)
      .then((response) => {
        setClasses(response.data.classes);
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  const fetchProgramUes = () => {
    axios
      .get(`${apiUrl}/programUe`)
      .then((response) => {
        setProgramUes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching programUes:', error);
      });
  };
  

  useEffect(() => {
    fetchProgramUes();

    // Fetch the list of tables UE
    axios
      .get(`${apiUrl}/tableUe`)
      .then((response) => {
        setTableUes(response.data.tableUes);
      })
      .catch((error) => {
        console.error('Error fetching tables UE:', error);
      });
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleAddUe = () => {
    // Add a new UE to the list
    axios
      .post(`${apiUrl}/storeProgramUe`, newUe)
      .then((response) => {
        setNewUe({ table_ue_id: '', classe_id: '' });
        setOpenModal(false);
        fetchProgramUes();
      })
      .catch((error) => {
        console.error('Error adding UE:', error);
      });
  };

  

  const filterUesByClass = () => {
    if (!selectedClass) {
      return programUes;
    }
    return programUes.filter((programUe) => programUe.classe_id === selectedClass);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  // Ajoutez ces deux constantes en haut de votre composant
const getUeNameById = (id) => {
  const ue = tableUes.find((tableUe) => tableUe.id === id);
  return ue ? ue.nomUe : '';
};

const getClassNameById = (id) => {
  const classe = classes.find((classe) => classe.id === id);
  return classe ? classe.className : '';
};


  return (
    <Grid item xs={12}>
      <Paper elevation={3} style={paperStyle}>
        <Box
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h5" style={typographyStyle}>
            Liste des Unités d'enseignement
          </Typography>

          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Programmer une UE
          </Button>
        </Box>
        <TableContainer>
        <Select
          name="classe_id"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          fullWidth
        >
          <MenuItem value="">
            Filtrer par classe 
          </MenuItem>
          {classes.map((classe) => (
            <MenuItem key={classe.id} value={classe.id}>
              {classe.className}
            </MenuItem>
          ))}
        </Select>
        <InputLabel>Filtrer par classe </InputLabel>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '20px' }}>UE</TableCell>
                <TableCell sx={{ fontSize: '20px' }}>Classe</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterUesByClass().map((programUe) => (
                <TableRow key={programUe.id}>
                  <TableCell>{getUeNameById(programUe.table_ue_id)}</TableCell>
                  <TableCell>{getClassNameById(programUe.classe_id)}</TableCell>                
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* <Grid item xs={12}>
      <Paper elevation={3} style={paperStyle}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" style={typographyStyle}>
            Liste des Modules
          </Typography>
          <Button variant="contained" color="primary" >
            Nouveau Module
          </Button>
        </Box>
        <List>
        {tableUes.map((tableUe) => (
            <ListItem key={tableUe.id}>{tableUe.nomUe}</ListItem>
          ))}
        </List>
      </Paper>
      </Grid> */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            width: '300px',
          }}
        >
          <Typography variant="h6">Programmer un UE</Typography>
          <Select
            fullWidth
            name="table_ue_id"
            onChange={(e) => setNewUe({ ...newUe, table_ue_id: e.target.value })}
          >
            <MenuItem>Sélectionner une UE</MenuItem>
            {tableUes.map((tableUe) => (
              <MenuItem key={tableUe.id} value={tableUe.id}>
                {tableUe.nomUe}
              </MenuItem>
            ))}
          </Select>
          <Select
            fullWidth
            name="classe_id"
            onChange={(e) => setNewUe({ ...newUe, classe_id: e.target.value })}
          >
            <MenuItem>Sélectionner une classe</MenuItem>
            {classes.map((classe) => (
              <MenuItem key={classe.id} value={classe.id}>
                {classe.className}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '10px' }}
            onClick={handleAddUe}
          >
            Ajouter
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
}
