import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Link, useHistory } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import CreateCoursModal from '../Components/Modals/CoursesModal/CreateCoursModal';

import axios from 'axios';
import Modal from '@mui/material/Modal';

const apiUrl = 'http://localhost:8000/api';
const defaultTheme = createTheme();

function EnroullerCours() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modules, setModules] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [cours_enrollers, setCoursEnrollers] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const history = useHistory();

  const handleOpenDetailsModal = (classId) => {
    setSelectedClass(classId);
    history.push(`/details/${classId}`);
  };

  const getClasses = () => {
    axios.get(apiUrl + '/classe')
      .then(response => {
        setClasses(response.data.classes);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des classes :', error);
      });
  };
  const getModules = () => {
    axios.get(apiUrl + '/module')
      .then(response => {
        setModules(response.data.modules);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des modules :', error);
      });
  };

  const getProfesseurs = () => {
    axios.get(apiUrl + '/professeur')
      .then(response => {
        setProfesseurs(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      });
  };
  
  const getSemestres = () => {
    axios.get(apiUrl + '/semestre')
      .then(response => {
        setSemestres(response.data.Semestres);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des semestres :', error);
      });
  };

  const getCoursEnrollers = () => {
    axios.get(apiUrl + '/coursE')
      .then(response => {
        setCoursEnrollers(response.data.cours);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des cours enrollers :', error);
      });
  };


  useEffect(() => {
    getClasses();
    getCoursEnrollers();
    getModules();
    getSemestres();
    getProfesseurs();
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
                  <Link to={`/createCours/`} >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setAddModalOpen(true)}
                  >
                    Enrouler un nouveau Cours
                  </Button>
                  </Link>
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
                        <TableCell sx={{ fontSize: '18px' }}>Classes Ajoutees</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classes.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell>{classItem.className}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => handleOpenDetailsModal(classItem.id)}
                            >
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <CreateCoursModal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onAdd={(addedCours) => setCoursEnrollers([...cours_enrollers, addedCours])}
                    modules={modules}
                    classes={classes}
                    professeurs={professeurs}
                    Semestres={semestres}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default EnroullerCours;
