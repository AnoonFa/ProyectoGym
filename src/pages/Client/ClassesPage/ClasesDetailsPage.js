import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ClasesDetailsPage.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import CalendarClases from '../../../components/VerClases/VerClases';
import clasesImg from '../../../assets/images/iaClases.jpg';
import { useAuth } from '../../../context/RoleContext';
import { ClassesContext } from '../../../context/ClasesContext';
import Modal from '@mui/material/Modal';
import ClaseForm from '../../../components/ClaseForm/ClaseForm'; 
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import useConfirm from '../../../components/useConfirm/useConfirm';
import ConfirmationModal from '../../../components/useConfirm/ConfirmationModal';

const convertTo12HourFormat = (time) => {
  if (!time || typeof time !== 'string') return 'Hora no disponible'; 
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(hour, minute);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleTimeString('es-ES', options);
};


// Función para formatear la fecha y hora de inscripción
const formatDateTime = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) + ', ' + date.toLocaleTimeString('es-ES', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

const formatPrice = (price) => {
  return price < 50 ? 'Gratis' : `$${price}`;
};

const ClassDetail = () => {
  const { className } = useParams();
  const { classes } = useContext(ClassesContext);
  const [classDetail, setClassDetail] = useState(null);
  const [showInscritos, setShowInscritos] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filters, setFilters] = useState({
    nombre: '',
    entrenador: '',
    startTime: '',
    endTime: '',
  });
  const { user } = useAuth();
  const { updateClass } = useContext(ClassesContext);
  const navigate = useNavigate();

 
   // Uso del hook useConfirm
  const { isOpen, confirmationOptions, openConfirm, closeConfirm } = useConfirm();

  useEffect(() => {
    fetch(`http://localhost:3001/clases?nombre=${className}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setClassDetail(data[0]);
        }
      })
      .catch(error => console.error('Error cargando los detalles de la clase:', error));
  }, [className]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isUserEnrolled = classDetail?.inscritos?.some(inscrito => 
    inscrito?.email?.trim().toLowerCase() === user?.correo?.trim().toLowerCase()
  );

  const handleReservation = () => {
    if (classDetail.cuposDisponibles > 0) {
      openConfirm({
        title: 'Confirmar Reserva',
        message: 'Debes pagar en el gimnasio dentro de un plazo de 1 día. Horarios del gimnasio:\n' +
          'Lunes a Viernes: 06:00 AM - 04:00 PM\n' +
          'Sábados: 08:00 AM - 04:00 PM\n' +
          'Domingos: 06:00 AM - 12:00 PM.',
          onConfirm: () => {
            const fechaInscripcion = new Date().toISOString();
    
            // Buscar el cliente en la base de datos client usando su ID o usuario
            fetch(`http://localhost:3001/client?id=${user.id}`)
              .then(response => response.json())
              .then(clientData => {
                if (clientData.length > 0) {
                  const cliente = clientData[0]; // Obtener el cliente
    
                  // Guardar los datos del cliente en la clase
                  const updatedClass = {
                    ...classDetail,
                    cuposDisponibles: classDetail.cuposDisponibles - 1,
                    inscritos: [...classDetail.inscritos, {
                      idCliente: cliente.id,
                      nombre: `${cliente.nombre} ${cliente.apellido}`,  // Guardar nombre completo
                      correo: cliente.correo,  // Guardar correo
                      fechaInscripcion: fechaInscripcion,
                      estadoPago: 'inscrito pero no pagado'
                    }]
                  };
  
          // Actualizar la clase en la base de datos
          fetch(`http://localhost:3001/clases/${classDetail.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedClass)
          })
          .then(() => {
            setClassDetail(updatedClass);
            updateClass(updatedClass);  // Actualizar el contexto de clases

            setAlertMessage('Te has inscrito con éxito. Recuerda pagar en el gimnasio.');
            setOpenSnackbar(true);
          })
          .catch(error => {
            console.error('Error al reservar la clase:', error);
            setAlertMessage('Ocurrió un error al reservar. Por favor, intenta nuevamente.');
            setOpenSnackbar(true);
          });
        } else {
          setAlertMessage('No se encontró el cliente.');
          setOpenSnackbar(true);
        }
      })
      .catch(error => {
        console.error('Error al buscar el cliente:', error);
        setAlertMessage('Ocurrió un error al buscar el cliente. Intenta nuevamente.');
        setOpenSnackbar(true);
      });

    closeConfirm();  // Cerrar el modal de confirmación
  },
  onCancel: () => {
    closeConfirm();
  }
});
} else {
setAlertMessage('No hay cupos disponibles.');
setOpenSnackbar(true);
}
};
  const handleCancelarInscripcion = () => {
    openConfirm({
      title: 'Confirmar Cancelación',
      message: '¿Estás seguro de que deseas cancelar tu inscripción? No hay reembolzos ',
      onConfirm: () => {
        const updatedClass = {
          ...classDetail,
          cuposDisponibles: classDetail.cuposDisponibles + 1,
          inscritos: classDetail.inscritos.filter(inscrito => 
            inscrito?.email?.trim().toLowerCase() !== user?.correo?.trim().toLowerCase()
          )
        };

        fetch(`http://localhost:3001/clases/${classDetail.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedClass)
        })
          .then(() => {
            setClassDetail(updatedClass);
            updateClass(updatedClass);  // Actualizar el contexto

            // Actualizar el mensaje de alerta
            setAlertMessage('Tu inscripción ha sido cancelada con éxito.');
            setOpenSnackbar(true);
          })
          .catch(error => {
            console.error('Error cancelando la inscripción:', error);
            setAlertMessage('Hubo un error al cancelar tu inscripción. Inténtalo de nuevo.');
            setOpenSnackbar(true);
          });

        closeConfirm();
      },
      onCancel: () => {
        closeConfirm();
      },
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      nombre: '',
      entrenador: '',
      startTime: '',
      endTime: ''
    });
  };

  // Filtrar los inscritos
  const filteredInscritos = classDetail?.inscritos?.filter(inscrito => {
    return (
      (filters.nombre === '' || inscrito.nombre.toLowerCase().includes(filters.nombre.toLowerCase()))
    );
  });
  

  const handleModificarClase = () => {
    setSelectedClass(classDetail); // Pass the full classDetail
    setIsModalOpen(true);
  };

  const handleToggleInscritos = () => {
    setShowInscritos(!showInscritos);
  };


  const handleSubmitClass = (updatedClass) => {
    // Save the updated class details
    fetch(`http://localhost:3001/clases/${updatedClass.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClass),
    })
      .then(() => {
        setClassDetail(updatedClass);
        updateClass(updatedClass); // Update the class in the context
        setIsModalOpen(false); // Close the modal after success
      })
      .catch((error) => {
        console.error('Error updating class:', error);
      });
  };


  const [selectedClass, setSelectedClass] = useState(null);

  // Esta función cierra el modal y reinicia el formulario
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const handleSubmit = (classData) => {
    // Aquí llamamos a la lógica para guardar los cambios de la clase
    console.log("Clase guardada con éxito", classData);
    setIsModalOpen(false); // Cerramos el modal
  };

  if (!classDetail) {
    return (
      <>
        <Header />
        <div className="class-not-found">
          <div className="class-not-found-container">
            <h2>Clase no encontrada</h2>
            <p>La clase {className} no se encuentra en nuestra base de datos.</p>
          </div>
        </div>
        <CalendarClases />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="class-detail">
        <div className='tittlel'>
          <h1 className="class-title">{classDetail.nombre}</h1>
        </div>
        <div className="class-content">
          <img src={clasesImg} alt="Imagen de clases" className="class-image" />
          <div className="class-info">
            <p className="class-description">{classDetail.descripcion}</p>
            <p className="class-trainer"><strong>Entrenador:</strong> {classDetail.entrenador}</p>
            <p className="class-time">
              <strong>Hora:</strong> {convertTo12HourFormat(classDetail.startTime)} - {convertTo12HourFormat(classDetail.endTime)}
            </p>
            <p className="class-day">
              <strong>Día:</strong> {classDetail.fecha 
                ? `${new Date(classDetail.fecha).toLocaleDateString('es-ES', { weekday: 'long' })}, ${new Date(classDetail.fecha).toLocaleDateString('es-ES')}` 
                : 'Fecha no disponible'}
            </p>
          </div>

          <div className="class-reservations">
            <h2 className='reserva'>Reservaciones</h2>
            <p className="class-price-large"><strong>Precio:</strong> {formatPrice(classDetail.precio)}</p>
            <p className="class-total-slots"><strong>Cupos Totales:</strong> {classDetail.totalCupos}</p>
            <p className="class-available-slots"><strong>Cupos Disponibles:</strong> {classDetail.cuposDisponibles}</p>
            {user.role === 'client' && (
              <div className="reservation-button">
                {!isUserEnrolled ? (
                  <button className="buy-button" onClick={handleReservation}>Reservar</button>
                ) : (
                  <button className="cancelar-button" onClick={handleCancelarInscripcion}>Cancelar Clase</button>
                )}
              </div>
            )}
          </div>
        </div>

        

        {isModalOpen && (
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="modal-content">
              <ClaseForm initialClass={classDetail} onSubmit={handleSubmitClass}  onCancel={handleCancel}  employees={[]} />
            </div>
          </Modal>
        )}
      </div>

       {/* Modal de Confirmación */}
       <ConfirmationModal
        isOpen={isOpen}
        title={confirmationOptions.title}
        message={confirmationOptions.message}
        onCancel={confirmationOptions.onCancel}
        onConfirm={confirmationOptions.onConfirm}
        
      />

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posiciona la alerta en el centro superior
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <CalendarClases />
      <Footer />
    </>
  );
};

export default ClassDetail;
