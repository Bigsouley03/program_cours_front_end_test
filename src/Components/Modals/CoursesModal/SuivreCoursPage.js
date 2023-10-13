import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Button,
  TextField,
  Snackbar,
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  LinearProgress,
} from '@mui/material';
import axios from 'axios';

function SuivreCoursPage(classeId) {
  const apiUrl = 'http://localhost:8000/api';
  const { courseId } = useParams();
  const [nombreHeure, setNombreHeure] = useState('');
  const [date, setDate] = useState('');
  const [objectifs, setObjectifs] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Fetch objectives for the selected course
    axios
      .get(`${apiUrl}/objectif/byCoursE/${courseId}`)
      .then((response) => {
        // Initialize the 'etat' property to false for each objective
        const objectivesWithEtatFalse = response.data.objectifs.map((objective) => ({
          ...objective,
          etat: false,
        }));
        setObjectifs(objectivesWithEtatFalse);
        // Chargez les objectifs depuis le stockage local s'ils existent
        const savedObjectifs = JSON.parse(localStorage.getItem(`objectifs_${courseId}`));
        if (savedObjectifs) {
          const updatedObjectifs = objectivesWithEtatFalse.map((objective) => {
            const savedObjective = savedObjectifs.find((o) => o.id === objective.id);
            return savedObjective || objective;
          });
          setObjectifs(updatedObjectifs);
        }
      })
      .catch((error) => {
        console.error('Error fetching objectives:', error);
      });
  }, [courseId]);

  const saveObjectifsLocally = (objectifsToSave) => {
    // Sauvegardez les objectifs dans le stockage local
    localStorage.setItem(`objectifs_${courseId}`, JSON.stringify(objectifsToSave));
  };

  const handleSaveSuivi = () => {
    // Sauvegardez les objectifs localement
    saveObjectifsLocally(objectifs);

    // Enregistrez d'autres données (nombreHeure et date) comme vous le faites actuellement
    const formData = {
      nombreHeure: parseInt(nombreHeure),
      date,
      cours_enroller_id: courseId,
    };

    axios
      .post(`${apiUrl}/storeCoursD`, formData)
      .then((response) => {
        console.log(response.data);

        // Show the Snackbar notification on success
        setSnackbarMessage('Le déroulement du cours a été enregistré avec succès');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here.
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSnackbarAction = () => {
    history.push(`/`);
    setSnackbarOpen(false);
  };

  const handleObjectiveToggle = (objectiveId) => {
    // Mettez à jour l'état localement
    const updatedObjectifs = objectifs.map((obj) =>
      obj.id === objectiveId ? { ...obj, etat: !obj.etat } : obj
    );
    setObjectifs(updatedObjectifs);
    saveObjectifsLocally(updatedObjectifs);
  };

  const countCheckedObjectifs = () => {
    return objectifs.filter((objective) => objective.etat).length;
  };

  return (
    <Box>
      <h2>Suivi du Cours</h2>
      <p>Remplissez les détails pour le suivi du cours.</p>
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
      <FormControl>
        <p>Objectifs</p>
        <FormGroup>
          {objectifs.map((objective) => (
            <FormControlLabel
  key={objective.id}
  control={
    <Checkbox
      checked={objective.etat}
      onChange={() => handleObjectiveToggle(objective.id)}
    />
  }
  label={objective.description}
/>
          ))}
        </FormGroup>
        <FormGroup>
          <LinearProgress
            variant="determinate"
            value={(countCheckedObjectifs() / objectifs.length) * 100}
          />
        </FormGroup>
        <Button onClick={handleSaveSuivi} color="primary">
          Enregistrer
        </Button>
      </FormControl>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#1976d2',
            color: 'white',
            minWidth: '400px',
          },
        }}
        action={
          <Button
            size="small"
            onClick={handleSnackbarAction}
            sx={{
              color: 'white',
            }}
          >
            Aller vers le Tableau de bord
          </Button>
        }
      />
    </Box>
  );
}

export default SuivreCoursPage;
