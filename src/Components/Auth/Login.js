import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Container,
  Box,
  Grid,
  Paper,
} from '@mui/material';

const Login = ({ accessToken, setAccessToken }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Fetch CSRF token from your Laravel backend
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleLogin = async () => {
    try {
      const loginResponse = await axios.post(
        'http://127.0.0.1:8000/api/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
        }
      );
      const token = loginResponse.data.access_token;
      // Set access token in state
      setAccessToken(token);
      
      // Clear form fields and errors
      setEmail('');
      setPassword('');
      setErrors('');//
      // Redirect to dashboard after successful login
      // history.push('/');
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.message);
      } else {
        console.error('An error occurred:', error.message);
      }
    }
  };



  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f7faff', // Couleur bleu pâle
        }}
      >
        <Paper elevation={3} sx={{ p: 4, backgroundColor: 'white' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <img
                src="https://cat.sn/storage/0XFJUqtbNQwEZwYXiSSMt6KJLWRTPUHMqA81frjc.png"
                alt="Logo"
                style={{ width: '100%', height: 'auto' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" gutterBottom>
                Connexion
              </Typography>
              {accessToken ? (
                <div>
                  <Typography variant="body1">You are logged in!</Typography>
                </div>
              ) : (
                <div>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <TextField
                      type="email"
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      fullWidth
                      required
                      margin="normal"
                    />
                    <TextField
                      type="password"
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      fullWidth
                      required
                      margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleLogin}>
                      Login
                    </Button>
                  </form>
                  {errors && <Typography color="error">{errors}</Typography>}
                </div>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
