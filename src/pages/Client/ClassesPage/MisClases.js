import React, { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../context/RoleContext';
import { ClassesContext } from '../../../context/ClasesContext';
import { useNavigate } from 'react-router-dom';
import './MisClases.css';
import Modal from '@mui/material/Modal';
import ClaseForm from '../../../components/ClaseForm/ClaseForm';

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
  const [selectedClass, setSelectedClass] = useState(null);
  const [showInscritos, setShowInscritos] = useState(null);
  const maxClassesToShow = 5; // Número máximo de clases a mostrar antes de habilitar "Ver más"

  // Filtrar clases según el usuario (admin o cliente)
  useEffect(() => {
    if (user.role === 'client') {
      const userClasses = classes.filter(clase =>
        clase.inscritos && clase.inscritos.some(inscrito => inscrito.id === user.id)
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

  const handleShowInscritos = (clase) => {
    setShowInscritos(clase);
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
  

  // Clases a mostrar según el botón "Ver más/Ver menos"
  const classesToShow = showMore ? filteredResults : filteredResults.slice(0, maxClassesToShow);

  // Función para limpiar los filtros
  const clearFilters = () => {
    setFilters({
      nombre: '',
      entrenador: '',
      startTime: '',
      endTime: ''
    });
    setFilteredClasses(classes); // Restablecemos las clases sin filtros
  };

  // Función para abrir el modal con la clase seleccionada
  const openModal = (clase) => {
    setSelectedClass(clase);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const handleUpdateClass = (updatedClassData) => {
    fetch(`http://localhost:3001/clases/${selectedClass.id}`, {
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
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const handleSubmit = (classData) => {
    // Aquí llamamos a la lógica para guardar los cambios de la clase
    console.log("Clase guardada con éxito", classData);
    setIsModalOpen(false); // Cerramos el modal
  };

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible';
    
    // Crear la fecha desde la cadena, sin aplicar la zona horaria local
    const dateParts = date.split('-'); // Asumiendo formato 'YYYY-MM-DD'
    const year = dateParts[0];
    const month = dateParts[1] - 1; // Los meses en JS van de 0 a 11
    const day = dateParts[2];
    
    const formattedDate = new Date(Date.UTC(year, month, day));
    
    return formattedDate.toLocaleDateString('es-ES', { timeZone: 'UTC' });
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
  

  return (
    <div className="mis-clases-container">
      <div className="filter-sidebar">
        <h3>Filtros</h3>

        {/* Filtros de clase */}
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

        <div className="field-row ">
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
              <th>Nombre</th>
              <th>Entrenador</th>
              <th>Hora</th>
              <th>Fecha</th>
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
                  <td>{formatDate(clase.fecha || clase.day)}</td> 
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
            <button className="details-button" onClick={() => navigate(`/ClassDetail/${clase.nombre}`)}>
              Detalles
            </button>
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

        {showInscritos && (
        <div className="inscritos-list">
          <h2 className='inscritos'>Inscritos para {showInscritos.nombre}</h2>
          {showInscritos.inscritos && showInscritos.inscritos.length > 0 ? (
            <table className="inscritos-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Fecha de inscripción</th>
                </tr>
              </thead>
              <tbody>
                {showInscritos.inscritos.map((inscrito, index) => (
                  <tr key={index}>
                    <td>{inscrito.nombre}</td>
                    <td>{inscrito.email}</td>
                    <td>{inscrito.fechaInscripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='pp'>No hay inscritos para esta clase.</p>
          )}
          <button className="close-inscritos-button" onClick={() => setShowInscritos(null)}>Cerrar</button>
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
            onCancel={handleCancel}
            employees={[]} // Lista de entrenadores
          />
        </div>
      </Modal>
    </div>
  );
};

export default MisClases;
