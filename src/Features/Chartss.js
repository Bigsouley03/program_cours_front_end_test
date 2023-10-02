import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select, Grid, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const apiUrl = 'http://localhost:8000/api';

function Charts() {
    const [classes, setClasses] = useState([]);
    const [coursEnrollers, setCoursEnrollers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [heureDeroule, setHeureDeroule] = useState('');
    const [heureRestant, setHeureRestante] = useState('');
  
    const getCoursEnrollers = () => {
      axios.get(`${apiUrl}/coursE`)
        .then(response => {
          setCoursEnrollers(response.data.cours);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des cours enrollers :', error);
        });
    };
    
    const getSemestres = () => {
        axios.get(`${apiUrl}/semestre`)
          .then(response => {
            setSemesters(response.data.Semestres);
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des semestres :', error);
          });
    };
    
    const getModules = () => {
        axios.get(`${apiUrl}/module`)
          .then(response => {
            setModules(response.data.modules);
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des modules :', error);
          });
    };
    
    const getHourData = () => {
        if (selectedClass !== '' && selectedSemester !== '' && selectedModule !== '') {
          axios.get(`${apiUrl}/showData/${selectedClass}/${selectedSemester}/${selectedModule}`)
            .then(response => {
              setHeureDeroule('heure deroule',response.data.heureDeroule || 0);
              setHeureRestante('heure restante',response.data.heureRestant || 0);
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des données d\'heure :', error);
            });
        }
    };
    
    useEffect(() => {
      getCoursEnrollers();
      getSemestres();
      getModules();
  
      axios.get(`${apiUrl}/classe`)
        .then(response => {
          setClasses(response.data.classes);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des classes :', error);
        });
    }, []);
  
    useEffect(() => {
        if (selectedClass !== '' && selectedSemester !== '' && selectedModule !== '') {
          getHourData();
        }
      }, [selectedClass, selectedSemester, selectedModule]);
  
    const handleClassChange = event => {
      setSelectedClass(event.target.value);
      setSelectedSemester('');
      setSelectedModule('');
    };
  
    const handleSemesterChange = event => {
      setSelectedSemester(event.target.value);
    };
  
    const handleModuleChange = event => {
      setSelectedModule(event.target.value);
    };
  
    const pieChartData = [
        { name: 'Heure Déroulée', value: 10 ,fill: '#8884d8'},
        { name: 'Heure Restante', value: 20 },
      ];
  
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <CardContent>
                <h2>Nombre de Cours Enroullés: {coursEnrollers.length}</h2>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <CardContent>
                <h2>Nombre de classes créées: {classes.length}</h2>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Classe</InputLabel>
              <Select
                value={selectedClass}
                onChange={handleClassChange}
              >
                {classes.map(classe => (
                  <MenuItem key={classe.id} value={classe.id}>
                    {classe.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Semestre</InputLabel>
              <Select
                value={selectedSemester}
                onChange={handleSemesterChange}
              >
                {semesters.map(semestre => (
                  <MenuItem key={semestre.id} value={semestre.id}>
                    {semestre.semestreName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Module</InputLabel>
              <Select
                value={selectedModule}
                onChange={handleModuleChange}
              >
                {modules.map(module => (
                  <MenuItem key={module.id} value={module.id}>
                    {module.moduleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {selectedClass !== '' && selectedSemester !== '' && selectedModule !== '' && (
        <Grid>
          <Card>
            <CardContent>
              <h2>Diagramme Circulaire</h2>
              <PieChart width={400} height={300}>
                <Tooltip />
                <Legend />
                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
  {pieChartData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.fill} />
  ))}
</Pie>              </PieChart>
            </CardContent>
          </Card>
        </Grid>
      )}
    </div>
  );
}

export default Charts;
