import React, { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Module from '../../Features/Modules';
import Charts from '../../Features/Charts';
import Classes from '../../Features/Classe/Classes';
import EnroullerCours from '../../Features/EnroullerCours';
import Professeurs from '../../Features/Professeurs';
import Semestres from '../../Features/Semestres';
import Sidebar from './SideBar';
import Header from './Header';
import Dashboard from '../../Features/Dashboard'
import Profil from './Profil';
import CoursDerouler from '../../Features/CoursDerouler';
import ClasseDetails from '../../Features/Classe/ClasseDetails';




const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function DashboardLayout({accessToken,setAccessToken}) {
  const [open, setOpen] = useState(true);


  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Router> {/* Wrap the entire app with Router */}
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          {/* Include the Header component */}
          <Header open={open} onDrawerOpen={toggleDrawer} accessToken={accessToken} setAccessToken={setAccessToken}/>

          {/* Rest of your Dashboard content */}
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <Sidebar/>
          </Drawer>

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
              padding: theme => theme.spacing(3),
            }}
          >
            <Toolbar />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                    <Switch>
                      <Route exact path="/" component={Dashboard} />
                      <Route path="/modules" component={Module} />
                      <Route path="/charts" component={Charts} />
                      <Route path="/classes" component={Classes} />
                      <Route path="/createcourse" component={EnroullerCours} />
                      <Route path="/professeurs" component={Professeurs} />
                      <Route path="/semestre" component={Semestres} />
                      <Route path="/profil" component={Profil} />
                      <Route path="/suivi" component={CoursDerouler} />
                      <Route exact path="/details/:classId" component={ClasseDetails} />

                      {/* <Route path="/login" component={Login} />
                      <Route path="/register" component={Register} /> */}

                      {/* Add more routes for other components if necessary */}
                    </Switch>
                  </Paper>
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                {'Copyright © '}
                <Link color="inherit" href="https://cat.sn/">
                  CAT
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
              </Typography>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
}