import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
import SuivreCoursModal from '../Components/Modals/CoursesModal/SuivreCoursModal';

function CoursDerouler() {
  const location = useLocation();
  const selectedCours = location.state.selectedCours;
  const [modalOpen, setModalOpen] = useState(false);
  console.log(selectedCours)
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSaveSuivi = (formData) => {
    // Handle saving the suivi data to the server
    console.log(formData);
  };

  return (
    <Box>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
                Suivi du cours
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleModalOpen}
          >
            Faire le suivi
        </Button>
      </Grid>
      {selectedCours && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">
                  Module: {selectedCours.module_id.moduleName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">
                  Nom du Professeur: {selectedCours.professeur_id.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">
                Objectif Principal: {selectedCours.objectifs}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">
                Responsable de Classe: {selectedCours.classe_id.etudiant_id.etudiant_name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">
                Heure Totale: {selectedCours.heureTotal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">
                Heure Déroulée: {selectedCours.heureDeroule}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">
                Heures Restantes: {selectedCours.heureRestant}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <SuivreCoursModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSaveSuivi}
      />
        </Grid>
      )}
    </Box>
  );
}

export default CoursDerouler;
