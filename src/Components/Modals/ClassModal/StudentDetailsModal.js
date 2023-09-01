import React from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, Typography } from '@mui/material';

function StudentDetailsModal({ open, onClose, selectedStudentName }) {




  return (
    <Modal open={open} onClose={onClose}>
      <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
        <Typography variant="h6" gutterBottom >Details de l'Étudiant</Typography>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Nom: {selectedStudentName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Email: {selectedStudentName}
            </Typography>
            {/* Ajoutez d'autres détails de l'étudiant si nécessaire */}
          </Box>
        <Button
          variant="contained"
          color="primary" // Use primary color
          fullWidth
        onClick={onClose}>
          Fermer
          </Button>
      </Box>
    </Modal>
  );
}

export default StudentDetailsModal;
