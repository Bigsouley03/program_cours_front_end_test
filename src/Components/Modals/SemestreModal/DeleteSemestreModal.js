import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const apiUrl = 'http://localhost:8000/api';

export default function DeleteSemestreModal({ open, selectedSemestreId, onDelete }) {
    const handleDeleteSemestre = () => {
        onDelete(selectedSemestreId);
    };

    return (
        <Modal
            open={open}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                width: 300,
            }}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Supprimer le semestre ?
                </Typography>
                <Typography id="modal-description" variant="body2" color="text.secondary">
                    Êtes-vous sûr de vouloir supprimer ce semestre ?
                </Typography>
                <Button onClick={handleDeleteSemestre} variant="contained" fullWidth>
                    Supprimer
                </Button>
            </Box>
        </Modal>
    );
}
