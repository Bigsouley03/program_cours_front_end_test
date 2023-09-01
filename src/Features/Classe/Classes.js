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
import AddClassModal from '../../Components/Modals/ClassModal/AddClassModal';
import DeleteClassModal from '../../Components/Modals/ClassModal/DeleteClassModal';
import EditClassModal from '../../Components/Modals/ClassModal/EditClassModal';

function Classe() {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedClassName, setEditedClassName] = useState('');
  const [editedStatus, setEditedStatus] = useState('0');
  const [newClassName] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);




  const openEditModal = (id, className, status) => {
    setEditingId(id);
    setEditedClassName(className);
    setEditedStatus(status);
    setEditModalOpen(true);
  };
  const toggleStatus = (id) => {
    const updatedRow = rows.find(row => row.id === id);
    if (updatedRow) {
      const updatedStatus = updatedRow.status === '1' ? '0' : '1';
      axios.put(`${apiUrl}/classe/${id}`, { ...updatedRow, status: updatedStatus })
        .then(() => {
          const updatedRows = rows.map(row => (row.id === id ? { ...row, status: updatedStatus } : row));
          setRows(updatedRows);
        })
        .catch(error => console.error('Error toggling Class status:', error));
    }
  };


  

  const closeEditModal = (id) => {
    setEditingId(null);
    setEditModalOpen(false);
  };

  const openDeleteModal = (id) => {
    setSelectedClassId(id);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    axios.get(apiUrl + '/classe')
      .then(response => {
        console.log(response);
        setRows(response.data.classes);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  const saveEditedClass = (id) => {
    const updatedRow = rows.find(row => row.id === id);
    if (updatedRow) {
      axios.put(`${apiUrl}/updateClasse/${id}`, { ...updatedRow, className: editedClassName, status: editedStatus })
        .then(() => {
          const updatedRows = rows.map(row => (row.id === id ? { ...row, className: editedClassName, status: editedStatus } : row));
          setRows(updatedRows);
          setEditingId(null);
          closeEditModal();
        })
        .catch(error => console.error('Error saving edited Class:', error));
    }
  };
  const deleteClass = () => {
    axios.delete(`${apiUrl}/deleteClasse/${selectedClassId}`)
      .then(() => {
        const updatedRows = rows.filter(row => row.id !== selectedClassId);
        setRows(updatedRows);
        setDeleteModalOpen(false); // Fermer le modal de suppression
      })
      .catch(error => console.error('Error deleting Class:', error));
  };

  // Rest of the code for saving, toggling, deleting classes...

  const apiUrl = 'http://localhost:8000/api';
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
                  <Typography variant="h4">Classes Recentes</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setAddModalOpen(true)}
                    disabled={newClassName.trim()}
                  >
                    Ajouter Une Classe
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
                        <TableCell sx={{ fontSize: '18px' }}>Nom de la Classe</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Statut</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.className}>
                          <TableCell sx={{ fontSize: '16px' }}>
                            {editingId === row.id ? (
                              <IconButton onClick={() => setEditModalOpen(true)}>
                                <EditIcon />
                              </IconButton>
                            ) : (
                              row.className
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
                                  : "Off"}
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
                                  : "Off"}
                              </Button>
                            )}

                          </TableCell>
                          <TableCell sx={{ fontSize: '16px' }}>
                          {editingId === row.id ? (
                              <IconButton onClick={() => saveEditedClass(row.id)} disabled={!editedClassName}>
                              </IconButton>
                            ) : (
                              <React.Fragment>
                                <IconButton onClick={() => openEditModal(row.id, row.className, row.status)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => openDeleteModal(row.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </React.Fragment>
                            )}

                          </TableCell>
                          <TableCell sx={{ fontSize: '16px' }}>
                          {/* Bouton "Voir les détails" */}
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                          >
                              Voir les détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>

                  <EditClassModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    className={editedClassName}
                    status={editedStatus}
                    onSave={() => saveEditedClass(editingId)}
                    onStatusToggle={() => setEditedStatus(editedStatus === '1' ? '0' : '1')}
                    onClassNameChange={(e) => setEditedClassName(e.target.value)}
                  />
                  {/* Delete Class Modal */}
                  <DeleteClassModal
                    open={deleteModalOpen}
                    onDelete={deleteClass}
                    selectedClassId={selectedClassId}
                  />
                  <AddClassModal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onAdd={(addedClass) => setRows([...rows, addedClass])}
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

export default Classe;
