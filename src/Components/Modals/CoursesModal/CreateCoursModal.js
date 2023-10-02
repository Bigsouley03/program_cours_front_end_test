import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';


const apiUrl = 'http://localhost:8000/api';

function CreateCoursModal({ open, onClose, onAdd, modules, classes, professeurs, Semestres }) {
  const [newCourse, setNewCourse] = useState({
    moduleName: '',
    className: '',
    heureTotal: '',
    heureDeroule: 0, // Initialisé à 0
    heureRestant: 0, // Initialisé à 0
    semestre_id: '', // Assurez-vous que le nom correspond au nom attendu côté serveur
    classe_id: '', // Assurez-vous que le nom correspond au nom attendu côté serveur
    professeur_id: '', // Assurez-vous que le nom correspond au nom attendu côté serveur
    module_id: '', // Assurez-vous que le nom correspond au nom attendu côté serveur
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCourse({
      ...newCourse,
      [name]: value,
    });
  };

  const handleAddCourse = () => {
    axios
      .post(`${apiUrl}/storeCoursE`, newCourse)
      .then((response) => {
        onAdd(response.data.classe);
        setNewCourse({
          className: '',
          heureDeroule: 0,
          heureTotal: '',
          heureRestant: 0,
        });
        onClose();
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du cours :', error);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: '10',
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Enrouler un nouveau cours
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Classe</InputLabel>
          <Select
            name="classe_id" // Assurez-vous que le nom correspond au nom attendu côté serveur
            value={newCourse.classe_id}
            onChange={handleInputChange}
          >
            {classes.map((classe) => (
              <MenuItem key={classe.id} value={classe.id}>
                {classe.className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
          <InputLabel>Semestre</InputLabel>
          <Select
            name="semestre_id" // Assurez-vous que le nom correspond au nom attendu côté serveur
            value={newCourse.semestre_id}
            onChange={handleInputChange}
          >
            {Semestres.map((semestre) => (
              <MenuItem key={semestre.id} value={semestre.id}>
                {semestre.semestreName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
          <InputLabel>Module</InputLabel>
          <Select
            name="module_id" // Assurez-vous que le nom correspond au nom attendu côté serveur
            value={newCourse.module_id}
            onChange={handleInputChange}
          >
            {modules.map((module) => (
              <MenuItem key={module.id} value={module.id}>
                {module.moduleName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Professeur</InputLabel>
          <Select
            name="professeur_id" // Assurez-vous que le nom correspond au nom attendu côté serveur
            value={newCourse.professeur_id}
            onChange={handleInputChange}
          >
            {professeurs.map((professeur) => (
              <MenuItem key={professeur.id} value={professeur.id}>
                {professeur.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* <TextField
          label="Objectifs"
          name="objectifs"
          // value={objectifs}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        /> */}
        <TextField
          label="Heure totale"
          type="number"
          name="heureTotal"
          value={newCourse.heureTotal}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCourse}
          disabled={!newCourse.module_id ||  !newCourse.classe_id}
          sx={{ mt: 2 }}
        >
          Ajouter le cours
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ mt: 2, ml: 2 }}
        >
          Annuler
        </Button>
      </Box>
    </Modal>
  );
}

export default CreateCoursModal;
