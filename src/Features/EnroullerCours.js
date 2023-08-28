import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import axios from 'axios';
import Modal from '@mui/material/Modal';

const apiUrl = 'http://localhost:8000/api';
const defaultTheme = createTheme();

function EnroullerCours() {
  const [cours_enrollers, setCours] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);

  const handleOpenModal = (cours_enroller) => {
    setSelectedCours(cours_enroller);
  };

  const handleCloseModal = () => {
    setSelectedCours(null);
  };

  useEffect(() => {
    axios.get(apiUrl + '/coursE')
      .then(response => {
        setCours(response.data.cours);
        console.log(cours_enrollers)

      })
      .catch(error => console.error('Erreur lors de la récupération des cours :', error));
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={16}>
                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                  <Typography variant="h4">Liste des Cours Enrollés</Typography>
                </Grid>
                <Paper
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '18px' }}>Module</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Utilisateur</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Classe</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cours_enrollers.map((cours_enroller) => (
                        <TableRow key={cours_enroller.id}>
                          <TableCell>
                            {cours_enroller.module_id.moduleName} {/* Assurez-vous que vous avez le bon nom de la propriété */}
                          </TableCell>
                          <TableCell>{cours_enroller.user_id.name}</TableCell>
                          <TableCell>{cours_enroller.classe_id.className}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleOpenModal(cours_enroller)}>Voir détails</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Container>

          {/* Modal pour afficher les détails */}
          <Modal open={selectedCours !== null} onClose={handleCloseModal}>
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
              <Typography variant="h6" gutterBottom>
                Détails du cours
              </Typography>
              {selectedCours && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Module: {selectedCours.module_id.moduleName}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Utilisateur: {selectedCours.user_id.name}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Classe: {selectedCours.classe_id.className}
                  </Typography>
                  {/* Ajouter d'autres détails ici en utilisant des composants Typography */}
                </Box>
              )}
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{ mt: 2 }}
              >
                Fermer
              </Button>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default EnroullerCours;
