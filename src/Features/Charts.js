import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

export default function Chart() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Grid container spacing={3} >
      <Grid item xs={12} md={8} lg={16}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h4">Nombre d'heures par cours</Typography>
          </Grid>
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            width: '100%', 
          }}
        >

    <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{
                  top: 16,
                  right: 16,
                  bottom: 0,
                  left: 24,
                }}
              >
                <XAxis
                  dataKey="time"
                  stroke={theme.palette.text.secondary}
                  style={theme.typography.body2}
                />
                <YAxis
                  stroke={theme.palette.text.secondary}
                  style={theme.typography.body2}
                >
                  <Label
                    angle={270}
                    position="left"
                    style={{
                      textAnchor: 'middle',
                      fill: theme.palette.text.primary,
                      ...theme.typography.body1,
                    }}
                  >
                    Modules
                  </Label>
                </YAxis>
                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="amount"
                  stroke={theme.palette.primary.main}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
