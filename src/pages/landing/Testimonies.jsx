// pages/landing/Testimonies.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar, Box } from '@mui/material';

const testimonials = [
  {
    name: 'John Doe',
    role: 'Frontend Developer',
    content: 'This platform helped me master React in just a few weeks!',
    avatar: 'J'
  },
  {
    name: 'Jane Smith',
    role: 'Full Stack Developer',
    content: 'The step-by-step approach makes complex concepts easy to understand.',
    avatar: 'S'
  },
  {
    name: 'Mike Johnson',
    role: 'Software Engineer',
    content: 'Excellent tutorials with practical examples. Highly recommended!',
    avatar: 'M'
  }
];

const Testimonies = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
        What Our Users Say
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                  {testimonial.avatar}
                </Avatar>
                <Typography variant="body1" paragraph>
                  "{testimonial.content}"
                </Typography>
                <Typography variant="h6" component="div">
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {testimonial.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonies;
