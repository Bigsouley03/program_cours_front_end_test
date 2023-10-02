import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  BarChart,
  Legend,
  Bar,
} from 'recharts';
import axios from 'axios';

const apiUrl = 'http://localhost:8000/api';

function Charts  () {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [coursesDerouler, setCoursesDerouler] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [modules, setModules] = useState([]); // Ajout de l'état pour stocker les modules
  const [selectedModule, setSelectedModule] = useState(''); // Nouvel état pour le module sélectionné
  const [coursEnrollers, setCoursEnrollers] = useState([]); // Ajout de l'état pour stocker les cours enrollers

  useEffect(() => {
    axios.get(apiUrl + '/coursD')
      .then(response => {
        console.log(response);
        setCoursesDerouler(response.data.cours);
      })
      .catch(error => console.error('Error fetching course data:', error));
  }, []);

  useEffect(() => {
    axios.get(apiUrl + '/semestre')
      .then(response => {
        console.log(response);
        setSemestres(response.data.Semestres);
      })
      .catch(error => console.error('Error fetching semester data:', error));
  }, []);

  useEffect(() => {
    axios.get(apiUrl + '/classe')
      .then(response => {
        console.log(response);
        setClasses(response.data.classes);
      })
      .catch(error => console.error('Error fetching class data:', error));
  }, []);

  useEffect(() => {
    axios.get(apiUrl + '/module') // Récupérer les données des modules depuis l'API
      .then(response => {
        console.log(response);
        setModules(response.data.modules);
      })
      .catch(error => console.error('Error fetching module data:', error));
  }, []);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };
  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value); // Mettre à jour le module sélectionné
  };
  // Fonction pour filtrer les données des cours enroulés en fonction du module sélectionné
  const filterCoursesByModule = () => {
    return coursesDerouler.filter((course) => {
      return (
        (!selectedClass || course.cours_enroller_id.classe_id === selectedClass) &&
        (!selectedSemester || course.cours_enroller_id.semestre_id === selectedSemester) &&
        (!selectedModule || course.module_id === selectedModule)
      );
    });
  };

  // ...

  // Créer des données pour le nouveau graphique en barres
  const barChartDataForModule = () => {
    const filteredModuleCourses = filterCoursesByModule();
    const moduleData = modules.find((module) => module.id === selectedModule);

    if (!moduleData) {
      return [];
    }

    const totalHours = moduleData.heureTotal;
    const remainingHours = moduleData.heureRestante;
    const completedHours = filteredModuleCourses.reduce((total, course) => total + course.nombreHeure, 0);
    

    return [
      {
        name: moduleData.moduleName,
        HeureTotal: totalHours,
        Heures_Complétées: completedHours,
        Heures_Restantes: remainingHours,
      },
    ];
  };

  // Fonction pour récupérer le nombre de cours
  const getCoursEnrollers = () => {
    axios.get(apiUrl + '/coursE')
      .then(response => {
        setCoursEnrollers(response.data.cours);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des cours enrollers :', error);
      });
  };

  // Appeler la fonction pour récupérer le nombre de cours au chargement initial
  useEffect(() => {
    getCoursEnrollers();
  }, []);

  const moduleNames = modules.map((module) => module.moduleName); // Obtenez les noms des modules

  const filteredCourses = coursesDerouler.filter((course) => {
    return (
      (!selectedClass || course.cours_enroller_id.classe_id === selectedClass) &&
      (!selectedSemester || course.cours_enroller_id.semestre_id === selectedSemester)
    );
  });

  // Créer des données pour le graphique en ligne (courbe)
  const hoursCompleted = filteredCourses.map((course) => course.nombreHeure);

  const lineChartData = moduleNames.map((name, index) => ({
    name,
    Heures_Complétées: hoursCompleted[index],
  }));

  // Créer des données pour le graphique en histogramme
  const barChartData = moduleNames.map((moduleName) => {
    const module = modules.find((module) => module.moduleName === moduleName);
    const totalHours = module ? module.heureTotal : 0;

    const moduleCourses = filteredCourses.filter((course) => course.module_id === module.id);
    const completedHours = moduleCourses.reduce((total, course) => total + course.heureTotal, 0);
    const remainingHours = totalHours - completedHours;

    return {
      name: moduleName,
      Heures_Totales: totalHours,
      Heures_Complétées: completedHours,
      Heures_Restantes: remainingHours,
    };
  });

  return (
    <div>
      <Grid container spacing={2}>

        <Grid item xs={12} sm={6} md={6}>
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            color='primary'
            displayEmpty
          >
            <MenuItem value="">Toutes les classes</MenuItem>
            {classes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.className}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            displayEmpty
          >
            <MenuItem value="">Tous les semestres</MenuItem>
            {semestres.map((semester) => (
              <MenuItem key={semester.id} value={semester.id}>
                {semester.semestreName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
        <Select
            value={selectedModule}
            onChange={handleModuleChange}
            displayEmpty
          >
            <MenuItem value="">Tous les modules</MenuItem>
            {modules.map((module) => (
              <MenuItem key={module.id} value={module.id}>
                {module.moduleName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={lineChartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <XAxis dataKey="name">
                    <Label angle={0} position="bottom" offset={0} />
                  </XAxis>
                  <YAxis />
                  <Line
                    type="monotone"
                    dataKey="Heures_Complétées"
                    stroke="#8884d8"
                    name="Heures Complétées"
                  />
                </LineChart>
              </ResponsiveContainer>
              <h3>Deroulement du Cours selectionné (Courbe)</h3>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
        <Card>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barChartDataForModule()} // Utiliser les données du module filtré
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <XAxis dataKey="name">
                    <Label angle={0} position="bottom" offset={0} />
                  </XAxis>
                  <YAxis />
                  <Legend />
                  <Bar dataKey="Heures_Totales" fill="#82ca9d" name="Heures Totales" />
                  <Bar dataKey="Heures_Complétées" fill="#8884d8" name="Heures Complétées" />
                  <Bar dataKey="Heures_Restantes" fill="#ff7300" name="Heures Restantes" />
                </BarChart>
              </ResponsiveContainer>
              <h3>Horaires du Cours selectionné (histogramme)</h3>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Charts;
