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

  const handleAddClass = () => {
    if (newClassName.trim() !== '') {
      const newClass = { status: '0', className: newClassName };
      axios.post(apiUrl + '/storeClasse', newClass)
        .then(response => {
          onAdd(response.data.classe);
          setNewClassName('');
          onClose();
        })
        .catch(error => console.error('Error adding Class:', error));
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
          height:'30%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: '8px', // Add border radius
        }}
      >
        <Typography variant="h6" component="h2">
          Ajouter un Class
        </Typography>
        <TextField
          label="Nom de la Classe"
          variant="outlined"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          onClick={handleAddClass}
          variant="contained"
          color="primary" // Use primary color
          fullWidth
        >
          Ajouter
        </Button>
      </Box>
    </Modal>
  );
}
