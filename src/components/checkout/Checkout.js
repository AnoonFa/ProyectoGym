import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Paper, Stepper, Step, StepLabel, Button, Typography, CssBaseline } from '@mui/material';
import PaymentForm from './PaymentForm';
import Review from './Review';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { ClassesContext } from '../../context/ClasesContext';
import { useAuth } from '../../context/RoleContext';
import emailjs from 'emailjs-com';
import Relleno from '../Relleno/Relleno';

const steps = ['Método de pago', 'Revisar orden'];

function getStepContent(step, formData, handleInputChange, purchaseType, selectedClass, ticketCount, selectedPlan) {
  switch (step) {
    case 0:
      return <PaymentForm formData={formData} handleInputChange={handleInputChange} />;
    case 1:
      return <Review purchaseType={purchaseType} ticketCount={ticketCount} selectedClass={selectedClass} selectedPlan={selectedPlan} />;
    default:
      throw new Error('Paso desconocido');
  }
}

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    cardType: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    email: '', 
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { classes, updateClass } = useContext(ClassesContext);
  const { user } = useAuth(); 

  const { purchaseType, ticketCount, selectedClass, selectedPlan } = location.state || {
    purchaseType: null,
    ticketCount: null,
    selectedClass: null,
    selectedPlan: null
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const isFormValid = () => {
    switch (activeStep) {
      case 0:
        return ['cardType', 'cardNumber', 'expDate', 'cvv', 'email'].every(field => formData[field].trim() !== '');
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      processPayment();
    } else if (isFormValid()) {
      setActiveStep(activeStep + 1);
    } else {
      alert('Por favor, complete todos los campos antes de continuar.');
    }
  };

  const processPayment = () => {
    const paymentSuccessful = true; // Simulación del proceso de pago
  
    if (paymentSuccessful) {
      if (purchaseType === 'class' && selectedClass) {
        // Verificar si el usuario está definido en el contexto
        if (!user || !user.username) {
          alert('Usuario no autenticado o falta el campo username.');
          console.error('Usuario no autenticado:', user);
          return;
        }
  
        const cliente = buscarClientePorUsername(user.username);

      if (!cliente) {
        alert('Cliente no encontrado en la base de datos');
        return;
      }
  
      const updatedClass = {
        ...selectedClass,
        cuposDisponibles: selectedClass.cuposDisponibles - 1,
        inscritos: [...selectedClass.inscritos, {
          id: cliente.id,
          nombre: `${cliente.nombre} ${cliente.apellido}`,
          correo: formData.email,
          fechaInscripcion: new Date().toISOString().split('T')[0]
        }]
      };
  
        updateClass(updatedClass);
        sendEmail();

      } else if (purchaseType === 'plan' || purchaseType === 'ticketera') {
        console.log('Compra completada');
      }
    } else {
      alert('El pago no se pudo completar. Por favor, intente nuevamente.');
    }
  };

  const buscarClientePorUsername = (username) => {
    const clientes = require('../../Backend/Api/db.json').client;
    return clientes.find(cliente => cliente.usuario === username); // Comparar con "usuario" de la base de datos
  };

  const sendEmail = () => {
    if (!formData.email) {
      console.error('El correo electrónico del usuario no está disponible.');
      alert('No se puede enviar el correo porque la dirección de correo electrónico está vacía.');
      return;
    }

    let templateId = '';
    let emailDetails = {};

    if (purchaseType === 'class') {
      templateId = 'template_fccbx4i';
      emailDetails = {
        to_name: user.nombre,  
        to_email: formData.email, 
        from_name: 'Gimnasio David & Goliat',
        from_email: 'gimnasiodavidgoliat@gmail.com',
        reply_to: formData.email,
        message_className: selectedClass.nombre || 'Clase desconocida',
        message_classDescription: selectedClass.descripcion || 'Sin descripción',
        message_classCoach: selectedClass.entrenador || 'Instructor desconocido',
        message_classDay: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][selectedClass.day] || 'Día desconocido',
        message_classTime: selectedClass.hora || 'Hora desconocida',
        message_totalPrice: `$${selectedClass.precio || '0.00'}`,
      };
    } else if (purchaseType === 'plan' || purchaseType === 'ticketera') {
      templateId = 'template_bj5eedi';
      emailDetails = {
        to_name: user.nombre,
        to_email: formData.email,
        from_name: 'Gimnasio David & Goliat',
        from_email: 'gimnasiodavidgoliat@gmail.com',
        reply_to: formData.email,
        message_ticketCount: ticketCount || 1,
        message_price: `$${selectedPlan.precio || '0.00'}`,
      };
    }

    emailjs.send('service_pvx889u', templateId, emailDetails, 'rncnnJK5UsTDQ-RqW')
      .then((result) => {
        console.log('Email enviado con éxito:', result.text);
        alert('Correo enviado con éxito');
        navigate(`/ClasesPage`);
      })
      .catch((error) => {
        console.error('Fallo en el envío del email:', error.text);
        alert('Hubo un error al enviar el correo. Por favor, inténtalo de nuevo.');
      });
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      <Header />
      <Relleno/>
      <CssBaseline />
      <main>
        <Paper
          sx={{
            width: '75%',
            margin: 'auto',
            marginBottom: '10.6rem',
            marginTop: '15rem',
            padding: '5rem',
          }}
        >
          <Typography component="h1" variant="h4" align="center">
            Proceso de Pago
          </Typography>
          <Stepper activeStep={activeStep} sx={{ padding: '1rem 0 2rem' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep, formData, handleInputChange, purchaseType, selectedClass, ticketCount, selectedPlan)}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ marginRight: '1rem' }}>
                Atrás
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'Completar Pago' : 'Siguiente'}
            </Button>
          </div>
        </Paper>
      </main>
      <Footer />
    </>
  );
}
