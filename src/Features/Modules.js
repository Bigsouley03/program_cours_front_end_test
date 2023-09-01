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
import AddModuleModal from '../Components/Modals/ModuleModal/AddModuleModal';
import DeleteModuleModal from '../Components/Modals/ModuleModal/DeleteModuleModal';
import EditModuleModal from '../Components/Modals/ModuleModal/EditModuleModal';

function Module() {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedModuleName, setEditedModuleName] = useState('');
  const [editedStatus, setEditedStatus] = useState('0');
  const [newModuleName] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);



  const openEditModal = (id,moduleName, status) => {
    setEditingId(id);
    setEditedModuleName(moduleName);
    setEditedStatus(status);
    setEditModalOpen(true);
  };

  const closeEditModal = (id) => {
    setEditingId(null);
    setEditModalOpen(false);
  };

  useEffect(() => {
    axios.get(apiUrl + '/module')
      .then(response => {
        console.log(response);
        setRows(response.data.modules); // Mettez à jour les données des modules ici
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  

  const saveEditedModule = (id) => {
    const updatedRow = rows.find(row => row.id === id);
    if (updatedRow) {
      axios.put(`${apiUrl}/updateModule/${id}`, { ...updatedRow, moduleName: editedModuleName, status: editedStatus })
        .then(() => {
          const updatedRows = rows.map(row => (row.id === id ? { ...row, moduleName: editedModuleName, status: editedStatus } : row));
          setRows(updatedRows);
          setEditingId(null);
          closeEditModal();
        })
        .catch(error => console.error('Error saving edited module:', error));
    }
  };

  const toggleStatus = (id) => {
    const updatedRow = rows.find(row => row.id === id);
    if (updatedRow) {
      const updatedStatus = updatedRow.status === '1' ? '0' : '1';
      axios.put(`${apiUrl}/module/${id}`, { ...updatedRow, status: updatedStatus })
        .then(() => {
          const updatedRows = rows.map(row => (row.id === id ? { ...row, status: updatedStatus } : row));
          setRows(updatedRows);
        })
        .catch(error => console.error('Error toggling module status:', error));
    }
  };

  const openDeleteModal = (id) => {
    setSelectedModuleId(id);
    setDeleteModalOpen(true);
  };

  const deleteModule = () => {
    axios.delete(`${apiUrl}/deleteModule/${selectedModuleId}`)
      .then(() => {
        const updatedRows = rows.filter(row => row.id !== selectedModuleId);
        setRows(updatedRows);
        setDeleteModalOpen(false); // Fermer le modal de suppression
      })
      .catch(error => console.error('Error deleting module:', error));
  };
  
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
                  <Typography variant="h4">Modules Recents</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setAddModalOpen(true)}
                      disabled={newModuleName.trim()}
                    >
                      Ajouter Un Module
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
                        <TableCell sx={{ fontSize: '18px' }}>Nom du module</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Statut</TableCell>
                        <TableCell sx={{ fontSize: '18px' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.moduleName}>
                          <TableCell sx={{ fontSize: '16px' }}>
                            {editingId === row.id ? (
                              <IconButton onClick={() => setEditModalOpen(true)}>
                                <EditIcon />
                              </IconButton>
                            ) : (
                              row.moduleName
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
                              <IconButton onClick={() => saveEditedModule(row.id)} disabled={!editedModuleName}>
                              </IconButton>
                            ) : (
                              <React.Fragment>
                                <IconButton onClick={() => openEditModal(row.id, row.moduleName, row.status)}>
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

                  {/* Add Module Modal */}
                  <EditModuleModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    moduleName={editedModuleName}
                    status={editedStatus}
                    onSave={() => saveEditedModule(editingId)}
                    onStatusToggle={() => setEditedStatus(editedStatus === '1' ? '0' : '1')}
                    onModuleNameChange={(e) => setEditedModuleName(e.target.value)}
                  />
                  {/* Delete Module Modal */}
                  <DeleteModuleModal
                    open={deleteModalOpen}
                    onDelete={deleteModule}
                    selectedModuleId={selectedModuleId}
                  />
                  <AddModuleModal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onAdd={(addedModule) => setRows([...rows, addedModule])}
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

export default Module;
