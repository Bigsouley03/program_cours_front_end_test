import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { Card, CardContent } from '@mui/material';
import SuivreCoursModal from '../../Components/Modals/CoursesModal/SuivreCoursModal';

const apiUrl = 'http://localhost:8000/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function ClasseDetails() {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // Ajout de l'état pour stocker l'ID du cours sélectionné

  const handleModalOpen = (course) => {
    setSelectedCourse(course);
    setSelectedCourseId(course.id); // Sélectionne automatiquement l'ID du cours enroulé
    setModalOpen(true);
  };

  const handleSaveSuivi = (formData) => {
    // Handle saving the suivi data to the server along with selectedCourseId
    const suiviData = {
      ...formData,
      cours_enroller_id: selectedCourseId,
    };

    axios
      .post(`${apiUrl}/storeCoursD`, suiviData)
      .then((response) => {
        console.log(response.data); // Handle success response
        // Appel de la fonction onSave pour gérer les données dans le composant parent
        // Fermeture du modal après l'enregistrement
        handleModalClose();
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };
  

  const handleModalClose = () => {

    setSelectedCourse(null);
    setSelectedCourseId(null); // Réinitialise l'ID du cours enroulé lorsque le modal se ferme
    setModalOpen(false);
  };


  useEffect(() => {
    axios
      .get(`${apiUrl}/showClasse/${classId}`)
      .then((response) => {
        setClassDetails(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des détails de la classe :', error);
      });

    axios
      .get(`${apiUrl}/coursE/showClassById/${classId}`)
      .then((response) => {
        setCourses(response.data.cours);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des cours enroulés :', error);
      });
  }, [classId]);

  const openModal = (course) => {
    setSelectedCourse(course);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setModalIsOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid>
        {classDetails && (
          <Card sx={{ backgroundColor: '#1976d2', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1">{classDetails.className}</Typography>
            </CardContent>
          </Card>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Modules Assignés à cette classe</Typography>
        {courses.length > 0 ? (
          <List>
            {courses.map((course) => (
              <ListItem key={course.id}>
                <ListItemText primary={`Module : ${course.module_id.moduleName}`} />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => openModal(course)}
                  style={{ marginRight: '16px' }}
                >
                  VOIR DETAILS
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleModalOpen(course)} // Passer le cours complet ici
                >
                  Faire le suivi
                </Button> */}
                <Link to={`/suivreCours/${course.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">
                    Faire le suivi
                  </Button>
                </Link>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">Aucun module n'a été enroulé à cette classe.</Typography>
        )}
      </Grid>

      <Modal open={modalIsOpen} onClose={closeModal} aria-labelledby="Détails du module">
        <Box sx={modalStyle}>
          <Typography variant="h6">Détails du module</Typography>
          {selectedCourse && (
            <Box>
              <Typography><strong>Nom du professeur :</strong> Professeur </Typography>
              <Typography><strong>Nom  responsable :</strong> Etudiant</Typography>
              <Typography><strong>Heure Totale :</strong> {selectedCourse.heureTotal}</Typography>
              <Typography><strong>Heure Deroulée :</strong> {selectedCourse.heureDeroule}</Typography>
              <Typography><strong>Heure Restantes :</strong> {selectedCourse.heureRestant}</Typography>
            </Box>
          )}
          <Button onClick={closeModal}>Fermer</Button>
        </Box>
      </Modal>
      <SuivreCoursModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSaveSuivi}
        cours_enroller_id={selectedCourse}
      />
    </Grid>
  );
}

export default ClasseDetails;
