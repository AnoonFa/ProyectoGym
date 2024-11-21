import React, { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../context/RoleContext';
import { ClassesContext } from '../../../context/ClasesContext';
import { useNavigate } from 'react-router-dom';
import './MisClases.css';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ClaseForm from '../../../components/Clases/ClaseForm/ClaseForm';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';


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

const MisClases = () => {
  const { classes, setClasses } = useContext(ClassesContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filters, setFilters] = useState({
    nombre: '',
    entrenador: '',
    startTime: '',
    endTime: '',
  });
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Estado para el modal de pago
  const [selectedInscrito, setSelectedInscrito] = useState(null); // Estado para el inscrito seleccionado para autorizar pago
  const [selectedClass, setSelectedClass] = useState(null);
  const [showInscritos, setShowInscritos] = useState(null);
  const maxClassesToShow = 5; // Número máximo de clases a mostrar antes de habilitar "Ver más"
  const [openSnackbar, setOpenSnackbar] = useState(false);  // Estado para el Snackbar
  const [alertMessage, setAlertMessage] = useState('');     // Estado para el mensaje de alerta
  const [sortOrder, setSortOrder] = useState({ field: 'nombre', direction: 'asc' },{ field: 'entrenador', direction: 'asc' }, );
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 5; // Número máximo de clases por página




  // Filtrar clases según el usuario (admin o cliente)
  useEffect(() => {
    if (user.role === 'client') {
      const userClasses = classes.filter(clase =>
        clase.inscritos && clase.inscritos.some(inscrito => inscrito.idCliente === user.id)
      );
      setFilteredClasses(userClasses);
    } else if (user.role === 'admin') {
      setFilteredClasses(classes); // El administrador puede ver todas las clases
    }
  }, [classes, user]);
  

  // Función para filtrar las clases por los criterios seleccionados
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };



  

  // Filtrar clases según los criterios de búsqueda
  const filteredResults = filteredClasses.filter(clase => {
    return (
        (filters.nombre === '' || (clase.nombre && clase.nombre.toLowerCase().includes(filters.nombre.toLowerCase()))) &&
        (filters.entrenador === '' || (clase.entrenador && clase.entrenador.toLowerCase().includes(filters.entrenador.toLowerCase()))) &&
        (filters.startTime === '' || (clase.startTime && clase.startTime.includes(filters.startTime))) &&
        (filters.endTime === '' || (clase.endTime && clase.endTime.includes(filters.endTime)))
    );
});
  

  const sortedClasses = [...filteredResults].sort((a, b) => {
    const fieldA = sortOrder.field === 'fecha' ? new Date(a.fecha) : a[sortOrder.field];
    const fieldB = sortOrder.field === 'fecha' ? new Date(b.fecha) : b[sortOrder.field];
    return sortOrder.direction === 'asc' ? (fieldA > fieldB ? 1 : -1) : (fieldA < fieldB ? 1 : -1);
});

  

  // Calcula la cantidad total de páginas
  const totalPages = Math.ceil(sortedClasses.length / classesPerPage);

  // Clases a mostrar según la página actual
  const classesToShow = sortedClasses.slice(
    (currentPage - 1) * classesPerPage,
    currentPage * classesPerPage
  );


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };



  // Función para limpiar los filtros
  const clearFilters = () => {
    setFilters({
      nombre: '',
      entrenador: '',
      startTime: '',
      endTime: ''
    });
  
    // Para clientes, restablecer a las clases a las que están inscritos
    if (user.role === 'client') {
      const userClasses = classes.filter(clase =>
        clase.inscritos && clase.inscritos.some(inscrito => inscrito.idCliente === user.id)
      );
      setFilteredClasses(userClasses);
    } else {
      setFilteredClasses(classes); // Para administradores
    }
  };
  

  // Función para abrir el modal con la clase seleccionada
  const openModal = (clase) => {
    setSelectedClass(clase);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (user.role === 'client') {
      fetch(`http://localhost:3005/client-classes/${user.id}`)
        .then(response => response.json())
        .then(data => {
          setFilteredClasses(data);
        })
        .catch(error => {
          console.error('Error fetching client classes:', error);
        });
    } else if (user.role === 'admin') {
      setFilteredClasses(classes);
    }
  }, [user, classes]);

  const handleShowInscritos = (clase) => {
    setSelectedClass(clase);
    
    // Hacer la petición al nuevo endpoint
    fetch(`http://localhost:3005/inscripciones/${clase.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener inscripciones');
        }
        return response.json();
      })
      .then(inscripciones => {
        // Actualizar la clase seleccionada con las inscripciones obtenidas
        const claseConInscritos = {
          ...clase,
          inscritos: inscripciones
        };
        setShowInscritos(claseConInscritos);
      })
      .catch(error => {
        console.error('Error:', error);
        // Mostrar un mensaje de error al usuario
        setAlertMessage('Error al cargar la lista de inscritos');
        setOpenSnackbar(true);
      });
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

// Calcula el tiempo restante hasta que expire el plazo de 24 horas
const calculateTimeRemaining = (inscripcionDate) => {
  const now = new Date();  // Fecha y hora actual
  const inscripcion = new Date(inscripcionDate);  // Fecha de inscripción del cliente
  const diff = 24 * 60 * 60 * 1000 - (now - inscripcion);  // 24 horas menos el tiempo transcurrido desde la inscripción

  if (diff <= 0) return null;  // Si el tiempo ha expirado, devolver null
  const hours = Math.floor(diff / (1000 * 60 * 60));  // Calcular horas restantes
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));  // Calcular minutos restantes

  return `${hours}h ${minutes}m`;  // Formatear el tiempo restante
};

  const handleUpdateClass = (updatedClassData) => {
    fetch(`http://localhost:3005/clases/${selectedClass.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClassData),
    })
      .then(response => response.json())
      .then(updatedClass => {
        const updatedClasses = classes.map(clase => 
          clase.id === selectedClass.id ? updatedClass : clase
        );
        setClasses(updatedClasses);
        closeModal(); // Close the modal after updating
      })
      .catch(error => {
        console.error('Error updating class:', error);
      });
  };
  

  
  // Esta función cierra el modal y reinicia el formulario
const handleCancelClass = (clase) => {
  const updatedClass = {
    ...clase,
    cuposDisponibles: clase.cuposDisponibles + 1,  // Aumentar los cupos disponibles
    inscritos: clase.inscritos.filter(inscrito => inscrito.id !== user.id)  // Remover al cliente de la lista de inscritos
  };

  fetch(`http://localhost:3005/clases/${clase.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedClass)
  })
  .then(() => {
    setClasses(classes.map(c => c.id === clase.id ? updatedClass : c));  // Actualizar la clase en el estado global
  })
  .catch(error => {
    console.error('Error cancelando la inscripción:', error);
  });
};


  const handleSubmit = (classData) => {
    // Aquí llamamos a la lógica para guardar los cambios de la clase
    console.log("Clase guardada con éxito", classData);
    setIsModalOpen(false); // Cerramos el modal
  };

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible';
    const formattedDate = new Date(date);  // Adjust date parsing for MySQL format
    return formattedDate.toLocaleDateString('es-ES');
  };
  


  const convertTo12Hour = (time) => {
    if (!time || typeof time !== 'string') return 'Hora no disponible'; // Aseguramos que el valor sea válido
    const [hour, minute] = time.split(':');
    let period = 'AM';
    let hourInt = parseInt(hour, 10);
  
    if (hourInt >= 12) {
      period = 'PM';
      if (hourInt > 12) hourInt -= 12;
    } else if (hourInt === 0) {
      hourInt = 12;
    }
  
    return `${hourInt}:${minute} ${period}`;
  };


   // Función para mostrar alerta y manejar el cierre del Snackbar
   const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

    // Función para autorizar el pago
  const authorizePayment = () => {
    if (!selectedClass || !selectedInscrito) {
      console.error("selectedClass o selectedInscrito es null o undefined");
      return;
    }

    fetch(`http://localhost:3005/inscripciones/${selectedInscrito.id}/pago`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la actualización del pago');
      }
      return response.json();
    })
    .then(inscripcionActualizada => {
      // Actualizar la lista de inscritos con el nuevo estado de pago
      fetch(`http://localhost:3005/inscripciones/${selectedClass.id}`)
        .then(response => response.json())
        .then(inscripciones => {
          const claseActualizada = {
            ...selectedClass,
            inscritos: inscripciones
          };

          // Actualizar el estado local
          setShowInscritos(claseActualizada);

          // Cerrar el modal y mostrar mensaje de éxito
          setIsPaymentModalOpen(false);
          setAlertMessage(`El pago para ${selectedInscrito.nombre} ha sido autorizado correctamente.`);
          setOpenSnackbar(true);
        });
    })
    .catch(error => {
      console.error('Error autorizando el pago:', error);
      setAlertMessage('Ocurrió un error al autorizar el pago. Intenta nuevamente.');
      setOpenSnackbar(true);
    });
  };




const openPaymentModal = (inscrito) => {
  if (!selectedClass) {
    console.error('selectedClass es null o undefined');
    return;  // Asegúrate de que selectedClass está asignado
  }
  console.log('Abrir modal para:', inscrito);
  setSelectedInscrito(inscrito);
  setIsPaymentModalOpen(true);
};



const handleSortChange = (field) => {
  const direction = sortOrder.field === field && sortOrder.direction === 'asc' ? 'desc' : 'asc';
  setSortOrder({ field, direction });
};

  return (
    <>
    
    <div className="mis-clases-container">
  <div className="filter-sidebar">
    <h3>Filtros</h3>

    <div className="filter-group">
      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        placeholder="Buscar por nombre"
        value={filters.nombre}
        onChange={handleFilterChange}
      />
    </div>

    <div className="filter-group">
      <label>Entrenador:</label>
      <input
        type="text"
        name="entrenador"
        placeholder="Buscar por entrenador"
        value={filters.entrenador}
        onChange={handleFilterChange}
      />
    </div>

    <div className="field-row">
      <div className="filter-group">
        <label>Hora Inicio:</label>
        <input
          type="time"
          name="startTime"
          placeholder="Hora de inicio"
          value={filters.startTime}
          onChange={handleFilterChange}
        />
      </div>

      <div className="filter-group">
        <label>Hora Fin:</label>
        <input
          type="time"
          name="endTime"
          placeholder="Hora de fin"
          value={filters.endTime}
          onChange={handleFilterChange}
        />
      </div>
    </div>

    <button onClick={clearFilters} className="clear-filters-button">Limpiar Filtros</button>
  </div>

      {/* Tabla para mostrar las clases */}
      <div className="classes-table-container">
          <table className="classes-table">
            <thead>
              <tr>
                <th className={`sortable-header ${sortOrder.field === 'nombre' ? sortOrder.direction : ''}`} onClick={() => handleSortChange('nombre')}>Nombre</th>
                <th className={`sortable-header ${sortOrder.field === 'entrenador' ? sortOrder.direction : ''}`} onClick={() => handleSortChange('entrenador')}>Entrenador</th>
                <th className={`sortable-header ${sortOrder.field === 'time' ? sortOrder.direction : ''}`} onClick={() => handleSortChange('time')}>Hora</th>
                <th className={`sortable-header ${sortOrder.field === 'fecha' ? sortOrder.direction : ''}`} onClick={() => handleSortChange('fecha')}>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
          <tbody>
            {classesToShow.length > 0 ? (
              classesToShow.map(clase => (
                <tr key={clase.id} onClick={() => navigate(`/ClassDetail/${clase.nombre}`)}>
                  <td>{clase.nombre}</td>
                  <td>{clase.entrenador}</td>
                  <td>{`${convertTo12Hour(clase.startTime)} - ${convertTo12Hour(clase.endTime)}`}</td>
                  <td>{formatDate(clase.fecha)}</td>
                  <td>
                  {user.role === 'admin' ? (
            <>
              {/* Evitamos que el clic en los botones active la navegación de la fila */}
              <button
                className="cancel-button"
                onClick={(e) => {
                  e.stopPropagation(); // Detenemos la propagación del evento
                  handleShowInscritos(clase);
                }}
              >
                Inscritos
              </button>
              <button
                className="details-button"
                onClick={(e) => {
                  e.stopPropagation(); // Detenemos la propagación del evento
                  openModal(clase);
                }}
              >
                Modificar
              </button>
            </>
          ) : (
            <>
              {/*Mostrar la clase en la lista del cliente incluso si no ha pagado*/} 
              {clase.inscritos.some(inscrito => inscrito.idCliente === user.id) ? (
              <span>
                {clase.inscritos.some(inscrito => inscrito.estadoPago === 'inscrito pero no pagado') ? (
                  <span>
                    Tiempo restante para pagar: {calculateTimeRemaining(clase.inscritos.find(inscrito => inscrito.idCliente === user.id).fechaInscripcion)}
                  </span>
                ) : (
                  <span>Pagado <span>&#10003;</span></span> // Mostrar el ícono de check para "Pagado"
                )}
              </span>
            ) : null}
            </>
          )}
                  </td>
                </tr>

              ))
            ) : (
              <tr>
                <td colSpan="5">No hay clases disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Siguiente
            </button>
          </div>
        )}

        {showInscritos && (
  <div className="inscritos-list">
    {showInscritos.inscritos.length > 0 ? (
      <>
        <h2 className='inscritos'>Inscritos para {showInscritos.nombre}</h2>
        <table className="inscritos-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Fecha de inscripción</th>
              <th>Clase pagada</th>
            </tr>
          </thead>
          <tbody>
            {showInscritos.inscritos.map((inscrito, index) => (
              <tr key={index}>
                <td>{inscrito.nombre || 'Nombre no disponible'}</td>
                <td>{inscrito.correo || 'Correo no disponible'}</td>
                <td>{formatDateTime(inscrito.fechaInscripcion)}</td>
                <td>
                  {inscrito.estadoPago === 'inscrito pero no pagado' ? (
                    <>
                      <span>Esperando pago</span>
                      <button className="details-button" onClick={() => openPaymentModal(inscrito)}>Autorizar Pago</button>
                    </>
                  ) : (
                    <span>Pagado <span>&#10003;</span></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="close-inscritos-button" onClick={() => setShowInscritos(null)}>Cerrar</button>
      </>
    ) : (
      <div>
        <h2 className='inscritos'>No hay inscritos para la clase {showInscritos.nombre}</h2>
        <button className="close-inscritos-buttons" onClick={() => setShowInscritos(null)}>Cerrar</button>
      </div>
    )}
  </div>
)}


        {/* Botón "Ver más/Ver menos" si hay más clases de las que se muestran */}
        {filteredResults.length > maxClassesToShow && (
          <button className="show-more-button" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Ver Menos' : 'Ver Más'}
          </button>
        )}
      </div>

      {/* Modal para modificar clase */}
      <Modal open={isModalOpen} onClose={closeModal} className="">
        <div className="modal-content">
          <ClaseForm
            initialClass={selectedClass}
            onSubmit={handleUpdateClass}
            onCancel={closeModal}
            employees={[]} // Lista de entrenadores
          />
        </div>
      </Modal>

      {/* Modal para confirmar el pago */}
          {/* Modal para confirmar el pago */}
          <Modal open={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
            <div className="custom-modal-overlay">
              <div className="custom-modal-content">
                <h3>Autorizar pago</h3>
                <p>¿Estás seguro de que deseas marcar este pago como completado para {selectedInscrito?.nombre || 'Nombre no disponible'}?</p>
                <div className="custom-modal-buttons">
                  <button className="custom-modal-confirm-button" onClick={authorizePayment}>Confirmar</button>
                  <button className="custom-modal-cancel-button" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          </Modal>



    
      {/* Snackbar para mostrar las alertas */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posiciona la alerta en la esquina superior derecha
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>

    </>
  );
};

export default MisClases;
