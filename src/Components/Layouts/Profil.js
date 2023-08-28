import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profil = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user's profile information
    axios.get('http://127.0.0.1:8000/api/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      setUser(response.data);
    })
    .catch(error => {
      console.error('Failed to fetch user profile:', error);
    });

  }, []);

  return (
    <div>
      <h1>Profil</h1>
      <div>
        <h2>Mon Profil</h2>
        <p>Nom: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
};

export default Profil;
