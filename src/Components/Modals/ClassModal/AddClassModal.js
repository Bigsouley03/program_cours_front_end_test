import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const apiUrl = 'http://localhost:8000/api';

export default function AddClassModal({ open, onClose, onAdd }) {
  const [newClassName, setNewClassName] = useState('');
  const [etudiantName, setEtudiantName] = useState('');
  const [etudiantEmail, setEtudiantEmail] = useState('');
  const [etudiantPassword, setEtudiantPassword] = useState('');

  const handleAddClass = async (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    try {
      // Validate input data (you can add more validation as needed)
      if (!newClassName || !etudiantName || !etudiantEmail || !etudiantPassword) {
        // Handle validation error, e.g., display an error message
        return;
      }

      // Create a data object to send in the request
      const data = {
        className: newClassName,
        etudiant_name: etudiantName,
        etudiant_email: etudiantEmail,
        etudiant_password: etudiantPassword,
      };

      // Send a POST request to your API endpoint
      const response = await axios.post(`${apiUrl}/storeClasse`, data);

      // Check if the request was successful (you can add more error handling)
      if (response.status === 201) {
        // Handle success, e.g., close the modal and update the UI
        onClose(); // Close the modal
        onAdd(); // Trigger a callback to update the UI if needed
      } else {
        // Handle other response statuses if necessary
      }
    } catch (error) {
      // Handle errors, e.g., display an error message
      console.error('Error:', error);
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: '70%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: '8px', // Ajouter un border radius
        }}
      >
        <Typography variant="h6" component="h2">
          Ajouter une Classe et un Étudiant
        </Typography>
        <form onSubmit={handleAddClass}>
          <TextField
            label="Nom de la Classe"
            variant="outlined"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nom de l'Étudiant"
            variant="outlined"
            value={etudiantName}
            onChange={(e) => setEtudiantName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email de l'Étudiant"
            variant="outlined"
            value={etudiantEmail}
            onChange={(e) => setEtudiantEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mot de Passe de l'Étudiant"
            variant="outlined"
            type="password"
            value={etudiantPassword}
            onChange={(e) => setEtudiantPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit" // Utilisez type="submit" pour soumettre le formulaire
            variant="contained"
            color="primary"
            fullWidth
          >
            Ajouter
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
