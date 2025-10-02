// pages/landing/HeroSection.jsx
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 8,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Learn React Step by Step
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4 }}>
          Master React development with our comprehensive tutorial platform
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/user')}
          >
            Start Learning
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate('/admin')}
          >
            Admin Panel
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;