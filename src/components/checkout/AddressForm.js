import React from 'react';
import { Grid, Typography, TextField } from '@mui/material';

export default function AddressForm({ formData, handleInputChange }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Autenticación usuario
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="Nombres"
            fullWidth
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Apellidos"
            fullWidth
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="Correo Electrónico"
            fullWidth
            autoComplete="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </>
  );
}