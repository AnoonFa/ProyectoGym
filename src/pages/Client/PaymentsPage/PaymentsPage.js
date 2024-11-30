import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import './Payments1.css';
import Relleno from '../../../components/Relleno/Relleno';

export default function PaymentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    plan: '',
    phone: '',
    cost: '',
    code: '',
    paymentMethod: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navegar a la página del comprobante y pasar los datos del formulario
    navigate('/comprobante', { state: formData });
  };

  const handleCancel = () => {
    navigate('/'); // Navega de vuelta a la página principal
  };

  return (
    <div>
      <Header />
      <Relleno/>
      <div className="form-container">
        <Typography variant="h6" gutterBottom>
          Realizar Pago de Plan
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} className="form-field">
              <TextField
                required
                id="name"
                name="name"
                label="Nombre"
                fullWidth
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} className="form-field">
              <FormControl fullWidth required>
                <InputLabel id="plan-label">Plan</InputLabel>
                <Select
                  labelId="plan-label"
                  id="plan"
                  name="plan"
                  label="Plan"
                  value={formData.plan}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Selecciona un plan</em>
                  </MenuItem>
                  <MenuItem value="Mensualidad">Mensualidad</MenuItem>
                  <MenuItem value="Trimestre">Trimestre</MenuItem>
                  <MenuItem value="Semestre">Semestre</MenuItem>
                  <MenuItem value="Año">Año</MenuItem>
                  <MenuItem value="Ticketera1">Ticketera1</MenuItem>
                  <MenuItem value="Ticketera2">Ticketera2</MenuItem>
                  <MenuItem value="Ticketera3">Ticketera3</MenuItem>
                  <MenuItem value="Ticketera4">Ticketera4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className="form-field">
              <TextField
                required
                id="phone"
                name="phone"
                label="Teléfono"
                type="tel"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} className="form-field">
              <TextField
                required
                id="cost"
                name="cost"
                label="Costo"
                type="number"
                fullWidth
                value={formData.cost}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} className="form-field">
              <TextField
                required
                id="code"
                name="code"
                label="Código"
                fullWidth
                value={formData.code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} className="form-field">
              <FormControl fullWidth required>
                <InputLabel id="payment-method-label">Método de Pago</InputLabel>
                <Select
                  labelId="payment-method-label"
                  id="paymentMethod"
                  name="paymentMethod"
                  label="Método de Pago"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Selecciona un método</em>
                  </MenuItem>
                  <MenuItem value="Tarjeta de Crédito">Tarjeta de Crédito</MenuItem>
                  <MenuItem value="Transferencia Bancaria">Transferencia Bancaria</MenuItem>
                  <MenuItem value="PayPal">PayPal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className="form-field">
              <FormControlLabel
                control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                label="Remember credit card details for next time"
              />
            </Grid>
            <Grid item xs={12} className="form-field">
              <Button type="submit" variant="contained" color="primary">
                Realizar Pago
              </Button>
              <Button onClick={handleCancel} className="cancel" variant="outlined" style={{ marginLeft: '10px' }}>
                Cancelar Pago
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <Footer />
    </div>
  );
}
