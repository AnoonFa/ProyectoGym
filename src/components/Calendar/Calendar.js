import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

// Ejemplo de datos
const disponibilidad = [
  { dia: 'Lunes', hora: '09:00 - 10:00', cupos: 5 , CuposDispoibles: 5},
  { dia: 'Lunes', hora: '10:00 - 11:00', cupos: 3 , CuposDispoibles: 0},
  // Añadir más objetos según sea necesario
];

const TablaDisponibilidad = () => (
  <div style={{ padding: '20px' }}>
    <Typography variant="h2" gutterBottom>
      Clases
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Día</TableCell>
            <TableCell>Hora</TableCell>
            <TableCell>Cupos </TableCell>
            <TableCell>Cupos Disponibles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {disponibilidad.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.dia}</TableCell>
              <TableCell>{item.hora}</TableCell>
              <TableCell>{item.cupos}</TableCell>
              <TableCell>{item.cupos > 0? 'Disponible' : 'Lleno'}</TableCell>             </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export default TablaDisponibilidad;
