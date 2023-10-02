import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { useHistory } from 'react-router-dom';
import { Box, FormGroup, TextareaAutosize } from '@mui/material';

const apiUrl = 'http://localhost:8000/api';

function CreateCoursPage() {
  const [newCourse, setNewCourse] = useState({
    moduleName: '',
    className: '',
    heureTotal: '',
    semestre_id: '',
    classe_id: '',
    professeur_id: '',
    module_id: '',
    ue_id: '',
  });

  const [classes, setClasses] = useState([]);
  const [classeId, setClasseId] = useState(null);

  const [modules, setModules] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [objectifText, setObjectifText] = useState(''); // Texte de l'objectif temporaire
  const [objectifs, setObjectifs] = useState([]); // Liste des objectifs ajoutés
  const [semestres, setSemestres] = useState([]);
  const [createdCourseId, setCreatedCourseId] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [tableUes, setTableUes] = useState([]);
  const [assignedModules, setAssignedModules] = useState([]);
  const [selectedUe, setSelectedUe] = useState('');
  
  const history = useHistory();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'ue_id') {
      // Si l'UE change, réinitialisez le module sélectionné également
      setNewCourse({
        ...newCourse,
        module_id: '', // Réinitialisez le module sélectionné
        [name]: value,
      });
      setSelectedUe(value); // Mettez à jour l'UE sélectionnée
    } else {
      setNewCourse({
        ...newCourse,
        [name]: value,
      });
    }
  };
  
  

  useEffect(() => {
    // Fetch UEs based on the selected class
    if (newCourse.classe_id) {
      axios
        .get(`${apiUrl}/tableUe`)
        .then((response) => {
          setTableUes(response.data.tableUes);
  
          // Fetch assigned modules for the selected UE
          if (selectedUe) {
            axios
              .get(`${apiUrl}/showModulesByUeId/${selectedUe}`)
              .then((moduleResponse) => {
                setAssignedModules(moduleResponse.data);
              })
              .catch((error) => {
                console.error('Error fetching assigned modules:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des UEs :', error);
        });
    } else {
      // Reset the UEs when no class is selected
      setTableUes([]);
      setSelectedUe('');
      setAssignedModules([]); // Reset assigned modules
    }
  }, [newCourse.classe_id, selectedUe]);
  

  const handleAddCourse = () => {
    // Enregistrer le cours
    axios
      .post(`${apiUrl}/storeCoursE`, newCourse)
      .then((response) => {
        // Handle the successful response, e.g., redirect or show a success message.
        console.log('Course added successfully:', response.data);

        // Récupérer l'ID du cours créé
        const courseId = response.data.classe.id;
         // Récupérer l'ID de la classe associée
        const classeId = response.data.classe.classe_id;

        // Mettre à jour l'état avec l'ID du cours
        setCreatedCourseId(courseId);
        // Mettre à jour l'état avec l'ID de la classe associée
        setClasseId(classeId); // Ajoutez cette ligne

        // Ajouter les objectifs associés au cours
        objectifs.forEach((objectif) => {
          axios
            .post(`${apiUrl}/storeObjectifs`, {
              description: objectif,
              cours_enroller_id: courseId, // Utilisez l'ID du cours créé
              etat: false, // Par défaut, l'objectif n'est pas atteint
            })
            .then((objResponse) => {
              console.log('Objectif added successfully:', objResponse.data);
            })
            .catch((error) => {
              console.error('Erreur lors de l\'ajout de l\'objectif :', error);
            });
        });

        // Show the Snackbar
        setSnackbarMessage('Cours enroulé avec succès');
        setSnackbarOpen(true);

        // Reset the form
        setNewCourse({
          heureTotal: '',
          module_id: '',
          professeur_id: '',
          classe_id: '',
          semestre_id: '',
          contenu:'',
          etatCours: 'En cours',
        });
        setObjectifs([]);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du cours :', error);
      });
  };

  const handleAddObjectif = () => {
    if (objectifText.trim() !== '') {
      setObjectifs([...objectifs, objectifText]);
      setObjectifText('');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const handleSnackbarAction = () => {
    if (classeId) {
      history.push(`/details/${classeId}`);
    }
    setSnackbarOpen(false);
  };
  

  


  useEffect(() => {
    // Fetch classes
    axios
      .get(apiUrl + '/classe')
      .then((response) => {
        setClasses(response.data.classes);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des classes :', error);
      });

    // Fetch modules
    axios
      .get(apiUrl + '/module')
      .then((response) => {
        setModules(response.data.modules);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des modules :', error);
      });

    // Fetch professeurs
    axios
      .get(apiUrl + '/professeur')
      .then((response) => {
        setProfesseurs(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      });

    // Fetch semestres
    axios
      .get(apiUrl + '/semestre')
      .then((response) => {
        setSemestres(response.data.Semestres);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des semestres :', error);
      });
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Enrouler un nouveau cours
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Classe</InputLabel>
        <Select
          name="classe_id"
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
      <FormControl fullWidth margin="normal">
  <InputLabel>UE</InputLabel>
  <Select
    name="ue_id"
    value={newCourse.ue_id} // Utilisez newCourse.ue_id ici
    onChange={handleInputChange}
  >
    {tableUes.map((ue) => (
      <MenuItem key={ue.id} value={ue.id}>
        {ue.nomUe}
      </MenuItem>
    ))}
  </Select>
</FormControl>


<FormControl fullWidth margin="normal">
  <InputLabel>Module</InputLabel>
  <Select
    name="module_id"
    value={newCourse.module_id}
    onChange={handleInputChange}
  >
    {modules.map((module) => (
      <MenuItem key={module.id} value={module.id}>
        {module.moduleName}
      </MenuItem>
    ))}
  </Select>
  <TextField
        label="Objectif du Cours"
        type="text"
        name="obj"
        value={newCourse.contenu}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
</FormControl>



      <FormControl fullWidth margin="normal">
        <InputLabel>Semestre</InputLabel>
        <Select
          name="semestre_id"
          value={newCourse.semestre_id}
          onChange={handleInputChange}
        >
          {semestres.map((semestre) => (
            <MenuItem key={semestre.id} value={semestre.id}>
              {semestre.semestreName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Professeur</InputLabel>
        <Select
          name="professeur_id"
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
      <TextField
        label="Heure totale"
        type="number"
        name="heureTotal"
        value={newCourse.heureTotal}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <FormGroup>
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Contenus du cours
      </Typography>
      <TextareaAutosize
        fullWidth
        name="objectifText"
        aria-label="textarea"
        minRows={10} // Nombre minimum de lignes
        maxRows={13} // Nombre maximum de lignes
        placeholder="Entrer Contenu "
        value={objectifText}
        onChange={(e) => setObjectifText(e.target.value)}
        margin="normal"
      />
            </FormGroup>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddObjectif}
        style={{ marginTop: '10px' }}
      >
        Ajouter le Contenu
      </Button>

      <ul>
        {objectifs.map((objectif, index) => (
          <li key={index}>{objectif}</li>
        ))}
      </ul>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCourse}
        disabled={
          !newCourse.module_id ||
          !newCourse.professeur_id ||
          !newCourse.classe_id ||
          !newCourse.semestre_id ||
          !newCourse.heureTotal ||

          objectifs.length === 0
        }
        style={{ marginTop: '20px' }}
      >
        Ajouter le cours
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000} // Durée du Snackbar en ms
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={snackbarMessage}
        sx={{
            '& .MuiSnackbarContent-root': {
            backgroundColor: '#1976d2', // Couleur primary
            color: 'white',
            minWidth: '400px', // Largeur personnalisée
            },
        }}
        action={
            <Button
            size="small"
            onClick={() => handleSnackbarAction()}
            sx={{
                color: 'white', // Définissez la couleur du texte en blanc
              }}
            >
            Aller vers la classe
            </Button>
        }
        />


    </Box>
  );
}

export default CreateCoursPage;