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
  const [modules, setModules] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [objectifText, setObjectifText] = useState('');
  const [objectifs, setObjectifs] = useState([]);
  const [programModules, setProgramModules] = useState([]);

  const [semestres, setSemestres] = useState([]);
  const [classeId, setClasseId] = useState(null);

  const [createdCourseId, setCreatedCourseId] = useState([]);
  const [filteredUes, setFilteredUes] = useState([]);
  const [assignedModules, setAssignedModules] = useState([]);
  const [selectedUe, setSelectedUe] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [programUes, setProgramUes] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [tableUes, setTableUes] = useState([]);

  const history = useHistory();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    if (name === 'classe_id') {
      const selectedClasseId = value;
      setNewCourse({
        ...newCourse,
        [name]: selectedClasseId,
        ue_id: '', // Reset ue_id when classe is changed
      });
  
      const filteredUes = programUes.filter((programUe) => programUe.classe_id === selectedClasseId);
      setFilteredUes(filteredUes);
    } else if (name === 'ue_id') {
      setNewCourse({
        ...newCourse,
        module_id: '',
        [name]: value,
      });
  
      // Récupérez les modules de ce programme
      const selectedProgramModule = programModules.find((programModule) => programModule.ue_id === value);
      if (name === 'ue_id' || name === 'classe_id') {
        // If UE or Classe is changed, call fetchModulesByUeAndClass
        fetchModulesByUeAndClass(value, newCourse.classe_id);
      }
    } else {
      setNewCourse({
        ...newCourse,
        [name]: value,
      });
    }
  };
  
  
const fetchModulesByUeAndClass = (ueId, classId) => {
  axios
    .get(`${apiUrl}/showModulesByUeAndClass/${ueId}/${classId}`)
    .then((response) => {
      // Récupérez les modules associés à l'UE et à la classe sélectionnées
      const modules = response.data;
      console.log(classId);
      // Faites quelque chose avec les modules, par exemple, mettez-les à jour dans un état
      setModules(modules);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des modules :', error);
    });
};

  
  useEffect(() => {
    axios
      .get(`${apiUrl}/programUe`)
      .then((response) => {
        setProgramUes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching programUes:', error);
      });
      

  }, []);

  useEffect(() => {
    const fetchAssignedModules = () => {
      if (newCourse.classe_id && newCourse.ue_id) {
        axios
          .get(`${apiUrl}/programModule`, {
            params: {
              classe_id: newCourse.classe_id,
              ue_id: newCourse.ue_id,
            },
          })
          .then((response) => {
            setProgramModules(response.data)
            console.log(newCourse.ue_id)
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des modules assignés :', error);
            setAssignedModules([]); // Réinitialiser les modules assignés en cas d'erreur
          });
      } else {
        setAssignedModules([]); // Réinitialiser les modules assignés si la classe ou l'UE n'est pas sélectionnée
      }
    };
    fetchAssignedModules();
  }, [newCourse.classe_id, newCourse.ue_id]);
  
  

  useEffect(() => {
    if (newCourse.classe_id) {
      axios
        .get(`${apiUrl}/tableUe`)
        .then((response) => {
          const allUes = response.data.tableUes;
          setTableUes(allUes);
          setSelectedUe('');
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des UEs :', error);
        });
    } else {
      setTableUes([]);
      setSelectedUe('');
      setAssignedModules([]);
    }
  }, [newCourse.classe_id, selectedUe]);

  const nomUeMap = {};
  if (Array.isArray(tableUes)) {
    tableUes.forEach((tableUe) => {
      nomUeMap[tableUe.id] = tableUe.nomUe;
    });
  }

  useEffect(() => {
    axios
      .get(apiUrl + '/classe')
      .then((response) => {
        setClasses(response.data.classes);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des classes :', error);
      });

    // axios
    //   .get(apiUrl + '/module')
    //   .then((response) => {
    //     setModules(response.data.modules);
    //   })
    //   .catch((error) => {
    //     console.error('Erreur lors de la récupération des modules :', error);
    //   });

    axios
      .get(apiUrl + '/professeur')
      .then((response) => {
        setProfesseurs(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      });

    axios
      .get(apiUrl + '/semestre')
      .then((response) => {
        setSemestres(response.data.Semestres);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des semestres :', error);
      });
  }, []);


  const handleAddCourse = () => {
    axios
      .post(`${apiUrl}/storeCoursE`, newCourse)
      .then((response) => {
        console.log('Course added successfully:', response.data);

        const courseId = response.data.classe.id;
        const classeId = response.data.classe.classe_id;

        setCreatedCourseId(courseId);
        setClasseId(classeId);

        objectifs.forEach((objectif) => {
          axios
            .post(`${apiUrl}/storeObjectifs`, {
              description: objectif,
              cours_enroller_id: courseId,
              etat: false,
            })
            .then((objResponse) => {
              console.log('Objectif added successfully:', objResponse.data);
            })
            .catch((error) => {
              console.error('Erreur lors de l\'ajout de l\'objectif :', error);
            });
        });

        setSnackbarMessage('Cours enroulé avec succès');
        setSnackbarOpen(true);

        setNewCourse({
          heureTotal: '',
          module_id: '',
          professeur_id: '',
          classe_id: '',
          semestre_id: '',
          contenu: '',
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
          value={newCourse.ue_id}
          onChange={handleInputChange}
        >
          {filteredUes.map((ue) => (
            <MenuItem key={ue.id} value={ue.id}>
              {nomUeMap[ue.table_ue_id]}
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
      </FormControl>
      <TextField
        label="Objectif du Cours"
        type="text"
        name="obj"
        value={newCourse.contenu}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
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
          minRows={10}
          maxRows={13}
          placeholder="Entrer Contenu"
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
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
            Aller vers la classe
          </Button>
        }
      />
    </Box>
  );
}

export default CreateCoursPage;
