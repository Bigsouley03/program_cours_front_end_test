import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import axios from 'axios';
const apiUrl = 'http://localhost:8000/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const handleLogin = (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    axios.post(`${apiUrl}/login`, loginData, {
      headers: {
        'X-CSRF-TOKEN': window.csrfToken,
      }
      
    })
      .then(response => {
        // Successful login
        console.log(response.data);
        console.log('Login successful');

        // Redirect the user to the appropriate page here
        history.push('/'); // Redirect to the Dashboard or another page
      })
      .catch(error => {
        // Login error
        console.error('Login error:', error);
        setErrorMessage('Invalid email or password. Please try again.');
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={2} style={{ padding: '60px', marginTop: '60px' }}>
        <Typography variant="h5" component="h1" align="center">
          Login
        </Typography>
        <form onSubmit={handleLogin} method="post">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
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
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
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

export default Login;
