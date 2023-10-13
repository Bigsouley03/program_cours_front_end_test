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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import axios from 'axios';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AddSemestreModal from '../Components/Modals/SemestreModal/AddSemestreModal';
import DeleteSemestreModal from '../Components/Modals/SemestreModal/DeleteSemestreModal';
import EditSemestreModal from '../Components/Modals/SemestreModal/EditSemestreModal';

function Semestre() {
  const apiUrl = 'http://localhost:8000/api';

  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedSemestreName, setEditedSemestreName] = useState('');
  const [editedStatus, setEditedStatus] = useState('0');
  const [newSemestreName] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSemestreId, setSelectedSemestreId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    axios.get(apiUrl + '/semestre')
      .then(response => {
        setRows(response.data.Semestres);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const openEditModal = (id, semestreName, status) => {
    setEditingId(id);
    setEditedSemestreName(semestreName);
    setEditedStatus(status);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingId(null);
    setEditModalOpen(false);
  };

  const saveEditedSemestre = (id) => {
    const updatedRow = rows.find(row => row.id === id);
    if (updatedRow) {
      axios.put(`${apiUrl}/updateSemestre/${id}`, { ...updatedRow, semestreName: editedSemestreName, status: editedStatus })
        .then(() => {
          const updatedRows = rows.map(row => (row.id === id ? { ...row, semestreName: editedSemestreName, status: editedStatus } : row));
          setRows(updatedRows);
          setEditingId(null);
          closeEditModal();
        })
        .catch(error => console.error('Error saving edited Semestre:', error));
    }
  };

  const toggleStatus = (id) => {
    const updatedRow = rows.find(row => row.id === id);
    if (updatedRow) {
      const updatedStatus = updatedRow.status === '1' ? '0' : '1';
      axios.put(`${apiUrl}/semestre/${id}`, { ...updatedRow, status: updatedStatus })
        .then(() => {
          const updatedRows = rows.map(row => (row.id === id ? { ...row, status: updatedStatus } : row));
          setRows(updatedRows);
        })
        .catch(error => console.error('Error toggling Semestre status:', error));
    }
  };

  const openDeleteModal = (id) => {
    setSelectedSemestreId(id);
    setDeleteModalOpen(true);
  };

  const deleteSemestre = () => {
    axios.delete(`${apiUrl}/deleteSemestre/${selectedSemestreId}`)
      .then(() => {
        const updatedRows = rows.filter(row => row.id !== selectedSemestreId);
        setRows(updatedRows);
        setDeleteModalOpen(false);
      })
      .catch(error => console.error('Error deleting Semestre:', error));
  };

  const defaultTheme = createTheme();

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
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={16}>
                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                  <Typography variant="h4">Semestres Recents</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setAddModalOpen(true)}
                    disabled={newSemestreName.trim()}
                  >
                    Ajouter Un Semestre
                  </Button>
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
                        <TableCell sx={{ fontSize: '18px' }}>Nom du Semestre</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Statut</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.semestreName}>
                          <TableCell sx={{ fontSize: '16px' }}>
                            {editingId === row.id ? (
                              <IconButton onClick={() => setEditModalOpen(true)}>
                                {row.semestreName}
                              </IconButton>
                            ) : (
                              row.semestreName
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '16px' }}>
                            {editingId === row.id ? (
                              <Button
                                variant="outlined"
                                color={editingId === row.id ? "primary" : (row.status === "1" ? "success" : "error")}
                                size="small"
                                onClick={
                                  editingId === row.id
                                    ? () => setEditedStatus(editedStatus === "1" ? "0" : "1")
                                    : () => toggleStatus(row.id)
                                }
                              >
                                {editingId === row.id
                                  ? editedStatus === "1"
                                    ? "On"
                                    : "Off"
                                  : row.status === "1"
                                  ? "On"
                                  : "Off"
                                }
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color={editingId === row.id ? "primary" : (row.status === "1" ? "success" : "error")}
                                size="small"
                                onClick={
                                  editingId === row.id
                                    ? () => setEditedStatus(editedStatus === "1" ? "0" : "1")
                                    : () => toggleStatus(row.id)
                                }
                              >
                                {editingId === row.id
                                  ? editedStatus === "1"
                                    ? "On"
                                    : "Off"
                                  : row.status === "1"
                                  ? "On"
                                  : "Off"
                                }
                              </Button>
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '16px' }}>
                            {editingId === row.id ? (
                              <IconButton onClick={() => saveEditedSemestre(row.id)} disabled={!editedSemestreName}>
                              </IconButton>
                            ) : (
                              <React.Fragment>
                                <IconButton onClick={() => openEditModal(row.id, row.semestreName, row.status)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => openDeleteModal(row.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </React.Fragment>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>

                  <EditSemestreModal
                    open={editModalOpen}
                    onClose={closeEditModal}
                    semestreName={editedSemestreName}
                    status={editedStatus}
                    onSave={() => saveEditedSemestre(editingId)}
                    onStatusToggle={() => setEditedStatus(editedStatus === '1' ? '0' : '1')}
                    onSemestreNameChange={(e) => setEditedSemestreName(e.target.value)}
                  />
                  <DeleteSemestreModal
                    open={deleteModalOpen}
                    onDelete={deleteSemestre}
                    selectedSemestreId={selectedSemestreId}
                  />
                  <AddSemestreModal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onAdd={(addedSemestre) => setRows([...rows, addedSemestre])}
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

export default Semestre;
