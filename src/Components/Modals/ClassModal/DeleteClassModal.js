import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function DeleteClassModal({ open, selectedClassId, onDelete }) {
    const handleDeleteClass = () => {
        onDelete(selectedClassId);
    };

    return (
        <Modal
            open={open}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    width: 300,
                }}
            >
                <Typography variant="h6" component="h2">
                    Supprimer la Classe ?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Êtes-vous sûr de vouloir supprimer cette Classe ?
                </Typography>
                <Button
                    onClick={handleDeleteClass}
                    variant="contained"
                    fullWidth
                >
                    Supprimer
                </Button>
            </Box>
        </Modal>
    );
}
