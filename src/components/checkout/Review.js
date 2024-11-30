import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Card, CardContent } from '@mui/material';

export default function Review({ purchaseType, ticketCount, selectedClass, selectedPlan }) {
  const renderClassDetails = () => (
    <>
      <ListItem>
        <ListItemText primary="Clase" secondary={selectedClass?.nombre || 'No disponible'} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Descripción" secondary={selectedClass?.descripcion || 'No disponible'} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Instructor" secondary={selectedClass?.entrenador || 'No disponible'} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Día" secondary={['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][selectedClass?.day] || 'No disponible'} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Hora" secondary={selectedClass?.hora || 'No disponible'} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Precio" secondary={`$${selectedClass?.precio || 'No disponible'}`} />
      </ListItem>
    </>
  );

  const renderTicketDetails = () => (
    <ListItem>
      <ListItemText primary="Cantidad de tickets" secondary={ticketCount || 'No disponible'} />
    </ListItem>
  );

  const renderPlanDetails = () => (
    <>
      <ListItem>
        <ListItemText primary="Plan" secondary={selectedPlan?.nombre || 'No disponible'} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Descripción" secondary={selectedPlan?.descripcion || 'No disponible'} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Duración" secondary={`${selectedPlan?.duracion || 0} meses`} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Precio" secondary={`$${selectedPlan?.precio || 0}`} />
      </ListItem>
    </>
  );

  const getTotalPrice = () => {
    if (purchaseType === 'class' && selectedClass) return selectedClass.precio;
    if (purchaseType === 'ticketera') return selectedPlan.precio;
    if (purchaseType === 'plan' && selectedPlan) return selectedPlan.precio;
    return 0;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resumen de la orden
        </Typography>
        <List disablePadding>
          <ListItem>
            <ListItemText primary="Tipo de compra" secondary={purchaseType ? purchaseType.charAt(0).toUpperCase() + purchaseType.slice(1) : 'Desconocido'} />
          </ListItem>
          <Divider />
          {purchaseType === 'class' && selectedClass && renderClassDetails()}
          {purchaseType === 'ticketera' && renderTicketDetails()}
          {purchaseType === 'plan' && selectedPlan && renderPlanDetails()}
          <Divider />
          <ListItem>
            <ListItemText primary="Total" secondary={`$${getTotalPrice()}`} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
