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
  const [etudiant_name, setEtudiantName] = useState('');
  const [etudiant_email, setEtudiantEmail] = useState('');
  const [etudiant_password, setEtudiantPassword] = useState('');

  const handleAddClass = () => {
    if (newClassName.trim() !== '' && etudiant_name.trim() !== '' && etudiant_email.trim() !== '' && etudiant_password.trim() !== '') {
      // Créez un nouvel utilisateur avec le nom, l'email et le mot de passe saisis
      const newUser = {
        name: etudiant_name,
        email: etudiant_email,
        password: etudiant_password,
      };
  
      // Enregistrez l'utilisateur
      axios.post(apiUrl + '/register', newUser)
        .then((response) => {
          // L'utilisateur a été créé avec succès, récupérez son ID
          const userId = response.data.user.user_id;
  
          // Créez un nouvel étudiant avec le nom et l'ID de l'utilisateur
          const newEtudiant = {
            name: etudiant_name,
            user_id: userId, // Utilisez user_id comme clé étrangère
          };
  
          // Enregistrez l'étudiant
          axios.post(apiUrl + '/storeClasse', newEtudiant) // Remplacez '/storeClasse' par '/storeEtudiant'
            .then((response) => {
              // L'étudiant a été créé avec succès
              // Vous pouvez gérer la suite de votre logique ici
              onAdd(response.data.etudiant); // Assurez-vous que la réponse contient l'objet étudiant
              setNewClassName('');
              setEtudiantName('');
              setEtudiantEmail('');
              setEtudiantPassword('');
              onClose();
            })
            .catch((error) => {
              if (error.response && error.response.data) {
                // Affichez les erreurs de validation renvoyées par le serveur
                console.error('Error adding Etudiant:', error.response.data);
              } else {
                console.error('Error adding Etudiant:', error);
              }
            });
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            // Affichez les erreurs de validation renvoyées par le serveur
            console.error('Error adding User:', error.response.data);
          } else {
            console.error('Error adding User:', error);
          }
        });
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
          borderRadius: '8px', // Add border radius
        }}
      >
        <Typography variant="h6" component="h2">
          Ajouter une Classe et un Étudiant
        </Typography>
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
          value={etudiant_name}
          onChange={(e) => setEtudiantName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email de l'Étudiant"
          variant="outlined"
          value={etudiant_email}
          onChange={(e) => setEtudiantEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mot de Passe de l'Étudiant"
          variant="outlined"
          type="password"
          value={etudiant_password}
          onChange={(e) => setEtudiantPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          onClick={handleAddClass}
          variant="contained"
          color="primary"
          fullWidth
        >
          Ajouter
        </Button>
      </Box>
    </Modal>
  );
}
