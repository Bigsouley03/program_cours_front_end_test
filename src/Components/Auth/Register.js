import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import axios from 'axios';

const apiUrl = 'http://localhost:8000/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleRegister = (e) => {
    e.preventDefault();

    const registerData = {
      name: name,
      email: email,
      password: password,
    };

    axios.post(`${apiUrl}/register`, registerData)
      .then(response => {
        // Traitement réussi
        console.log(response.data);
        console.log('Registered successfully');

        // Redirigez l'utilisateur vers la page de connexion ici
        history.push('/login');
      })
      .catch(error => {
        // Erreur d'inscription
        console.error('Registration error:', error);
        setErrorMessage('Registration failed. Please try again.');
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={2} style={{ padding: '60px', marginTop: '60px' }}>
        <Typography variant="h5" component="h1" align="center">
          Register
        </Typography>
        <form onSubmit={handleRegister} method="post">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '10px' }}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
          {errorMessage && (
            <Typography variant="body2" color="error" align="center" style={{ marginTop: '10px' }}>
              {errorMessage}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
}

export default Register;
