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
import Relleno from '../../../components/Relleno/Relleno';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { classes } = useContext(ClassesContext);
  const [classDetail, setClassDetail] = useState(null);
  const { user, setUser, updateUserTickets } = useAuth();
  const { updateClass } = useContext(ClassesContext);
  const { isOpen, confirmationOptions, openConfirm, closeConfirm } = useConfirm();
  const [alertMessage, setAlertMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [localUser, setLocalUser] = useState(JSON.parse(localStorage.getItem('user')) || user);
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [filters, setFilters] = useState({
    nombre: '',
    entrenador: '',
    startTime: '',
    endTime: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/clases?nombre=${className}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setClassDetail(data[0]);
          setIsUserEnrolled(data[0].inscritos.some(inscrito => 
            inscrito?.correo?.trim().toLowerCase() === user?.correo?.trim().toLowerCase()
          ));
        }
      })
      .catch(error => console.error('Error cargando los detalles de la clase:', error));
  }, [className, user?.correo]);

  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


    // Convertimos la fecha de la clase en un objeto Date para compararla con la fecha actual
    const classDate = classDetail?.fecha ? new Date(classDetail.fecha) : null;
    const hasClassPassed = classDate ? classDate < new Date() : false;
  

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
      
          fetch(`http://localhost:3001/client?id=${user.id}`)
            .then(response => response.json())
            .then(clientData => {
              if (clientData.length > 0) {
                const cliente = clientData[0];
      
                const updatedClass = {
                  ...classDetail,
                  cuposDisponibles: classDetail.cuposDisponibles - 1,
                  inscritos: [...classDetail.inscritos, {
                    idCliente: cliente.id,
                    nombre: `${cliente.nombre} ${cliente.apellido}`,
                    correo: cliente.correo,
                    fechaInscripcion: fechaInscripcion,
                    estadoPago: 'inscrito pero no pagado'
                  }]
                };
      
                fetch(`http://localhost:3001/clases/${classDetail.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedClass)
                })
                .then(() => {
                  setClassDetail(updatedClass);
                  updateClass(updatedClass);
                  setIsUserEnrolled(true); // Actualizar el estado de inscripción
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
  
          closeConfirm(); 
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
      message: '¿Estás seguro de que deseas cancelar tu inscripción? Se te devolverá el ticket.',
      onConfirm: async () => {
        try {
          // Actualizar la clase
          const updatedClass = {
            ...classDetail,
            cuposDisponibles: classDetail.cuposDisponibles + 1,
            inscritos: classDetail.inscritos.filter(inscrito => 
              inscrito?.correo?.trim().toLowerCase() !== user?.correo?.trim().toLowerCase()
            )
          };
  
          const classResponse = await fetch(`http://localhost:3001/clases/${classDetail.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedClass)
          });
  
          if (!classResponse.ok) throw new Error('Error al actualizar la clase');
  
          // Actualizar los tickets del usuario
          const newTicketCount = user.tickets + 1;
          const userResponse = await fetch(`http://localhost:3001/client/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickets: newTicketCount })
          });
  
          if (!userResponse.ok) throw new Error('Error al actualizar los tickets del usuario');
  
          const updatedUser = await userResponse.json();
  
          // Actualizar estados locales
          setClassDetail(updatedClass);
          updateClass(updatedClass);
          setUser(prevUser => ({
            ...prevUser,
            tickets: updatedUser.tickets
          }));
          setIsUserEnrolled(false);  // Cambiar el estado de inscripción
  
          setAlertMessage('Tu inscripción ha sido cancelada y se te ha devuelto el ticket.');
          setOpenSnackbar(true);
        } catch (error) {
          console.error('Error cancelando la inscripción:', error);
          setAlertMessage('Hubo un error al cancelar tu inscripción. Inténtalo de nuevo.');
          setOpenSnackbar(true);
        }
  
        closeConfirm();
      },
      onCancel: () => {
        closeConfirm();
      }
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
      setSelectedClass(classDetail);
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
        <Relleno/>
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

  console.log('Datos de user.role', user.role);
  console.log('Datos de user.tickets', user.tickets);
  console.log('Datos de isUserEnrolled', isUserEnrolled);

  const handleGastarTicket = () => {
    openConfirm({
      title: 'Confirmar Gasto de Ticket',
      message: '¿Estás seguro de que deseas gastar 1 ticket para esta clase?',
      onConfirm: async () => {
        if (user.tickets > 0) {
          try {
            // Primero, actualizamos la clase
            const updatedClass = {
              ...classDetail,
              cuposDisponibles: classDetail.cuposDisponibles - 1,
              inscritos: [
                ...classDetail.inscritos,
                {
                  idCliente: user.id,
                  nombre: `${user.nombre || 'Nombre'} ${user.apellido || 'Apellido'}`,
                  correo: user.correo,
                  fechaInscripcion: new Date().toISOString(),
                  estadoPago: 'pagado con ticket'
                }
              ]
            };
  
            const classResponse = await fetch(`http://localhost:3001/clases/${classDetail.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedClass)
            });
  
            if (!classResponse.ok) throw new Error('Error al actualizar la clase');
  
            // Luego, actualizamos los tickets del usuario
            const newTicketCount = user.tickets - 1;
            const userResponse = await fetch(`http://localhost:3001/client/${user.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tickets: newTicketCount })
            });
  
            if (!userResponse.ok) throw new Error('Error al actualizar los tickets del usuario');
  
            const updatedUser = await userResponse.json();
  
            // Actualizamos el estado local y el contexto de una sola vez
            setClassDetail(updatedClass);
            updateClass(updatedClass);
            setUser(prevUser => ({
              ...prevUser,
              tickets: updatedUser.tickets
            }));
            setIsUserEnrolled(true);
  
            setAlertMessage('Has gastado 1 ticket y te has inscrito en la clase.');
            setOpenSnackbar(true);
          } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Ocurrió un error. Por favor, intenta nuevamente.');
            setOpenSnackbar(true);
          }
        } else {
          setAlertMessage('No tienes tickets disponibles.');
          setOpenSnackbar(true);
        }
  
        closeConfirm();
      },
      onCancel: () => {
        closeConfirm();
      }
    });
  };
  
  

    console.log('Nombre:', user.nombre);
    console.log('Apellido:', user.apellido);

  return (
    <>
      <Header />
      <Relleno/>
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
                ? `${new Date(Date.UTC(
                    parseInt(classDetail.fecha.split('-')[0]), // Año
                    parseInt(classDetail.fecha.split('-')[1]) - 1, // Mes (restar 1 porque los meses empiezan desde 0 en JS)
                    parseInt(classDetail.fecha.split('-')[2])+1 // Día
                  )).toLocaleDateString('es-ES', { weekday: 'long' })}, ${new Date(Date.UTC(
                    parseInt(classDetail.fecha.split('-')[0]),
                    parseInt(classDetail.fecha.split('-')[1]) - 1,
                    parseInt(classDetail.fecha.split('-')[2])+1
                  )).toLocaleDateString('es-ES')}` 
                : 'Fecha no disponible'}
            </p>
          </div>

          <div className="class-reservations">
            <h2 className='reserva'>Reservaciones</h2>
            <p className="class-price-large"><strong>Precio:</strong> {formatPrice(classDetail.precio)}</p>
            <p className="class-total-slots"><strong>Cupos Totales:</strong> {classDetail.totalCupos}</p>
            <p className="class-available-slots"><strong>Cupos Disponibles:</strong> {classDetail.cuposDisponibles}</p>
            {user.role === 'client' && !hasClassPassed && (
              <div className="reservation-button">
                {isUserEnrolled ? (
                  <button className="cancelar-button" onClick={handleCancelarInscripcion}>Cancelar Clase</button>
                ) : (
                  <>
                    <button className="buy-button" onClick={handleReservation}>Reservar</button>
                    {user.tickets > 0 && (
                      <button className="buy-button" onClick={handleGastarTicket}>Gastar Ticket</button>
                    )}
                  </>
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
