import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/landing/LandingPage';
import TokenTransaction from './pages/landing/TokenTransaction';
import NotFound from './pages/other/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2EEBCB',
    },
    secondary: {
      main: '#0EA5A5',
    },
    background: {
      default: '#1A1A1A',
      paper: '#2C2C2C',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { 
      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
      fontWeight: 700 
    },
    h2: { 
      fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' }, 
      fontWeight: 700 
    },
    h3: { 
      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }, 
      fontWeight: 700 
    },
    h4: { 
      fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' }, 
      fontWeight: 600 
    },
    h5: { 
      fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' }, 
      fontWeight: 600 
    },
    h6: { 
      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, 
      fontWeight: 600 
    },
    body1: { 
      fontSize: { xs: '0.9rem', sm: '1rem' } 
    },
    body2: { 
      fontSize: { xs: '0.8rem', sm: '0.9rem' } 
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/token-transaction" element={<TokenTransaction />} />
          {/* Add other routes as needed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

