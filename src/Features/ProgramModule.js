import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
  Typography,
  Select,
  MenuItem,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogContent,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

function ProgramModule() {
  const [classes, setClasses] = useState([]);
  const [tableUes, setTableUes] = useState([]);
  const [modules, setModules] = useState([]);
  const [programModules, setProgramModules] = useState([]);
  const [programUes, setProgramUes] = useState([]);
  const [isModuleSelectionVisible, setIsModuleSelectionVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState('filtre par Classe');
  const [selectedNomUe, setSelectedNomUe] = useState('filtre par UE');
  const [openModalP, setOpenModalP] = useState(false);
  


  const [newProgram, setNewProgram] = useState({
    module_id: [], // Make sure it's initialized as an empty array
    table_ue_id: '',
    classe_id: '',
  });





  const apiUrl = 'http://localhost:8000/api';

  const [typographyStyle] = useState({
    fontSize: '24px',
  });
  const [paperStyle] = useState({
    padding: '20px',
    height: '100%',
  });

  const handleOpenModal = () => {
    setOpenModalP(true);
  };

  const handleCloseModal = () => {
    setOpenModalP(false);
  };

  const fetchProgramModules = () => {
    axios
      .get(`${apiUrl}/programModule`)
      .then((response) => {
        setProgramModules(response.data);
      })
      .catch((error) => {
        console.error('Error fetching program modules:', error);
      });
  };
  
  const handleSave = () => {
    // Validate the form data here if needed
  
    // Create a new program module
    const requestData = {
      table_ue_id: newProgram.table_ue_id,
      classe_id: newProgram.classe_id,
      module_id: newProgram.module_id, // Include module_id
    };
  
    axios
      .post(`${apiUrl}/storeProgramModule`, requestData)
      .then(() => {
        fetchProgramModules(); // Met à jour les modules après l'ajout
        handleCloseModal();
        setNewProgram({
          module_id: [], // Make sure it's initialized as an empty array
          table_ue_id: '',
          classe_id: '',
        });

      })
      .catch((error) => {
        console.error('Error creating program module:', error);
      });
  };
  
  


  const nomUeMap = {};
  if (Array.isArray(tableUes)) {
    tableUes.forEach((tableUe) => {
      nomUeMap[tableUe.id] = tableUe.nomUe;
    });
  }
  

  useEffect(() => {
    fetchProgramModules();
    axios
      .get(`${apiUrl}/classe`)
      .then((response) => {
        setClasses(response.data.classes);
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${apiUrl}/tableUe`)
      .then((response) => {
        setTableUes(response.data.tableUes);
      })
      .catch((error) => {
        console.error('Error fetching table UEs:', error);
      });
  }, []);


  

  useEffect(() => {
    axios
      .get(`${apiUrl}/module`)
      .then((response) => {
        setModules(response.data.modules);
      })
      .catch((error) => {
        console.error('Error fetching modules:', error);
      });
  }, []);
  useEffect(() => {
    // Activer l'affichage de la section si une classe et une UE sont sélectionnées
    if (newProgram.classe_id && newProgram.table_ue_id) {
      setIsModuleSelectionVisible(true);
    } else {
      setIsModuleSelectionVisible(false);
    }
  }, [newProgram.classe_id, newProgram.table_ue_id]);
  

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

  function getClassName(programModule) {
    if (programModule && programModule.table_ue_id) {
      const assignedProgramUe = programUes.find((programUe) => programUe.id === programModule.table_ue_id);
  
      if (assignedProgramUe) {
        const assignedClasse = classes.find((classe) => classe.id === assignedProgramUe.classe_id);
  
        if (assignedClasse) {
          return assignedClasse.className;
        }
      }
    }
  
    return '';
  }
  

  const filteredProgramModules = programModules.filter((programModule) => {
    const isClassMatch = selectedClass === 'filtre par Classe' || getClassName(programModule) === selectedClass;
    const isNomUeMatch = selectedNomUe === 'filtre par UE' || nomUeMap[programModule.table_ue_id] === selectedNomUe;
  
    return isClassMatch && isNomUeMatch;
  });
  
  const filteredUes = programUes.filter((programUe) => {
    return programUe.classe_id === newProgram.classe_id;
  });
  
  return (
    <Grid item xs={12}>
      <Paper elevation={3} style={paperStyle}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h7" style={typographyStyle}>
            Modules par Classe/UE
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Programmer Un Module
          </Button>
        </Box>
        <br />
        <Select
          value={selectedClass}
          onChange={(event) => setSelectedClass(event.target.value)}
        >
          <MenuItem value="filtre par Classe">Filtre par Classe</MenuItem>
          {classes.map((classe) => (
            <MenuItem key={classe.id} value={classe.className}>
              {classe.className}
            </MenuItem>
          ))}
        </Select>
  
        <Select
          value={selectedNomUe}
          onChange={(event) => setSelectedNomUe(event.target.value)}
        >
          <MenuItem value="filtre par UE">Filtre par UE</MenuItem>
          {tableUes.map((tableUe) => (
            <MenuItem key={tableUe.id} value={tableUe.nomUe}>
              {tableUe.nomUe}
            </MenuItem>
          ))}
        </Select>
        <Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '20px' }}>Nom de l'UE</TableCell>
                  <TableCell sx={{ fontSize: '20px' }}>Classe</TableCell>
                  <TableCell sx={{ fontSize: '20px' }}>Modules</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProgramModules && filteredProgramModules.length > 0 ? (
                  filteredProgramModules.map((programModule, index) => (
                    <TableRow key={index}>
                      <TableCell>{nomUeMap[programModule.table_ue_id]}</TableCell>
                      <TableCell>{getClassName(programModule)}</TableCell>
                      <TableCell>
                        {programModule.modules.map((module, moduleIndex) => (
                          <span key={module.id}>
                            {module.moduleName}
                            {moduleIndex < programModule.modules.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                      Aucun Module Programmé
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
      <Dialog open={openModalP} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogContent>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" style={typographyStyle}>
              Programmer un Module
            </Typography>
  
            <InputLabel>Selectionnez La Classe</InputLabel>
            <Select
              fullWidth
              label="Classe"
              name="classe_id"
              value={newProgram.classe_id}
              onChange={(event) => setNewProgram({ ...newProgram, classe_id: event.target.value })}
            >
              <MenuItem value="">Sélectionner une classe</MenuItem>
              {classes.map((classe) => (
                <MenuItem key={classe.id} value={classe.id}>
                  {classe.className}
                </MenuItem>
              ))}
            </Select>
  
            <InputLabel>Selectionnez L'UE</InputLabel>
            <Select
              fullWidth
              label="UE"
              name="table_ue_id"
              value={newProgram.table_ue_id}
              onChange={(event) => setNewProgram({ ...newProgram, table_ue_id: event.target.value })}
            >
              <MenuItem value="">Sélectionner une UE</MenuItem>
              {filteredUes && filteredUes.length > 0 ? (
                filteredUes.map((ue) => (
                  <MenuItem key={ue.id} value={ue.id}>
                    {nomUeMap[ue.table_ue_id]}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="no-ues">Aucune UE disponible</MenuItem>
              )}
            </Select>
  
            {isModuleSelectionVisible && (
                <div>
                  <Typography variant="h6">Sélectionner les modules :</Typography>
                  {modules.map((module) => (
                    <div key={module.id}>
                      <Checkbox
                        checked={newProgram.module_id.includes(module.id)}
                        onChange={(event) => {
                          const moduleId = module.id;
                          const isChecked = event.target.checked;
                          setNewProgram((prevState) => {
                            if (isChecked) {
                              return {
                                ...prevState,
                                module_id: [...prevState.module_id, moduleId],
                              };
                            } else {
                              return {
                                ...prevState,
                                module_id: prevState.module_id.filter((id) => id !== moduleId),
                              };
                            }
                          });
                        }}
                      />
                      {module.moduleName}
                    </div>
                  ))}
                </div>
              )}
            <Button variant="contained" color="primary" onClick={handleSave}>
              Enregistrer
            </Button>
          </Paper>
        </DialogContent>
      </Dialog>
    </Grid>
  );
  
}

export default ProgramModule;
