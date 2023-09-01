import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const apiUrl = 'http://localhost:8000/api';




function ClasseDetails() {
  const [classeDetails, setclasseDetails] = useState(null);
  const { classId } = useParams();

  useEffect(() => {
    axios
      .get(`${apiUrl}/coursE/showClassById/${classId}`)
      .then((response) => {
        setclasseDetails(response.data.cours);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [classId]);

  return (
    <div>
      {classeDetails ?  (
        <div>
          <h1>Details de la classe</h1>
          <p>Nom de la classe : {classeDetails.className}</p>
          <h2>Modules</h2>
          <ul>
            {classeDetails.modules.map((module) => (
              <li key={module.id}>{module.moduleName}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Chargement en cours...</p>
      )}
    </div>
  );
}

export default ClasseDetails;
