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
import DialogContentText from '@mui/material/DialogContentText';

import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import axios from 'axios';
import Modal from '@mui/material/Modal'; // Importez le composant Modal
import Avatar from '@mui/material/Avatar'; // Importez le composant Avatar

const apiUrl = 'http://localhost:8000/api';
const defaultTheme = createTheme();

function Professeur() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };


  useEffect(() => {
    axios.get(apiUrl + '/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des utilisateurs :', error));
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
                  <Typography variant="h4">Liste des Professeurs</Typography>
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
                        <TableCell sx={{ fontSize: '18px' }}>Avatar</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Nom</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Avatar alt={user.name} src={user.avatar_url} />
                          </TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleOpenModal(user)}>Voir détails</Button>
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
          <Modal open={selectedUser !== null} onClose={handleCloseModal}>
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
              <DialogContentText>
              Détails du professeur
              </DialogContentText>                

              {selectedUser && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Nom du professeur: {selectedUser.name}
                  </Typography>
                  {/* Ajouter d'autres détails ici en utilisant des composants Typography */}
                </Box>
              )}
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{ mt: 2 }} // Ajoute un espace en haut du bouton
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

export default Professeur;
