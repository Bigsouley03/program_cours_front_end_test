import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
//import axios from 'axios';
import { useParams } from 'react-router-dom';


function SuivreCoursModal({ open, onClose, onSave }) {
  const [nombreHeure, setNombreHeure] = useState('');
  const [date, setDate] = useState('');
  const [objectifs, setObjectif] = useState('');
  const { courseId } = useParams();

  const handleSave = async () => {
    const formData = {
      nombreHeure: parseInt(nombreHeure),
      date,
      objectifs,
      cours_enroller_id: courseId, // Utilisez courseId au lieu de cours_enroller_id.id
    };
    try {
      onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  // ...


  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Suivi du Cours</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Remplissez les détails pour le suivi du cours.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre d'heures"
          type="number"
          fullWidth
          value={nombreHeure}
          onChange={(e) => setNombreHeure(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Objectif"
          multiline
          rows={4}
          fullWidth
          value={objectifs}
          onChange={(e) => setObjectif(e.target.value)}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSave}  color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SuivreCoursModal;
