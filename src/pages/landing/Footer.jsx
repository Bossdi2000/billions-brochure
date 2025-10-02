// pages/landing/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              React Tutorial App
            </Typography>
            <Typography variant="body2">
              Learn React development with our comprehensive step-by-step tutorials.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/user" color="inherit" display="block" sx={{ mb: 1 }}>
              User Dashboard
            </Link>
            <Link href="/admin" color="inherit" display="block">
              Admin Panel
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Help Center
            </Link>
            <Link href="#" color="inherit" display="block">
              Contact Us
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Twitter
            </Link>
            <Link href="#" color="inherit" display="block">
              GitHub
            </Link>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="body2" textAlign="center">
            © 2024 React Tutorial App. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;