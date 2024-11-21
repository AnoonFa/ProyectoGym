import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ClassesContext } from '../../../context/ClasesContext';
import { useNavigate } from 'react-router-dom';
import './VerClases.css';
import MisClases from '../../../pages/Client/ClassesPage/MisClases';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useAuth } from '../../../context/RoleContext'; 
import 'moment/locale/es';

moment.locale('es'); // Configura moment para español
const localizer = momentLocalizer(moment);

// Función para convertir horas de 12 horas (AM/PM) a 24 horas
const convertTo24Hour = (time) => {
  if (!time || typeof time !== 'string') return ''; // Verificación de que la hora no sea nula o indefinida
  const [hour, minutePart] = time.split(':');
  const minutes = minutePart.slice(0, 2);
  const period = minutePart.slice(3);

  let hour24 = parseInt(hour, 10);
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }

  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
};

const CalendarClases = () => {
  const { classes, setClasses } = useContext(ClassesContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMisClases, setShowMisClases] = useState(false); 
  const [employees, setEmployees] = useState([]);
  const [newClass, setNewClass] = useState({
    nombre: '',
    entrenador: '',
    startTime: '',
    endTime: '',
    day: '',
    descripcion: '',
    totalCupos: '',
    precio: '',  // Campo de precio opcional
    inscritos: [] // Se inicializa como un array vacío para nuevas clases
  });

    // Clear form fields without closing the form
    const handleClearForm = () => { 
        resetForm();  // Limpia el formulario cuando se hace clic en "Cancelar"
      };

  const [errors, setErrors] = useState({});
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false); // Control de visibilidad de la alerta
  const [timeoutId, setTimeoutId] = useState(null);  // Guardar el ID del timeout

   // Cargar empleados al montar el componente
  useEffect(() => {
    fetch('http://localhost:3005/empleados')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error al cargar empleados:', error));
  }, []);


 // Validación de horarios
 const validateTimeRange = (startTime, endTime, day) => {
  if (!startTime || !endTime || !day) return true;

  const [startHour, startMinute] = startTime.split(':');
  const [endHour, endMinute] = endTime.split(':');
  
  const start = new Date(day);
  start.setHours(startHour, startMinute);
  
  const end = new Date(day);
  end.setHours(endHour, endMinute);

  if (end <= start) {
    setErrors(prev => ({
      ...prev,
      timeLogic: 'La hora de fin de la clase no tiene lógica con la hora de inicio'
    }));
    return false;
  }

  // Convertir a minutos para facilitar comparación
  const startInMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
  const endInMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
  
  const dayOfWeek = new Date(day).getDay();
  
  // Validar según el día
  let isValid = true;
  if (dayOfWeek === 0) { // Domingo
    if (startInMinutes < 6 * 60 || endInMinutes > 12 * 60) {
      setErrors(prev => ({
        ...prev,
        timeRange: 'Esta clase no se puede crear porque no está dentro del horario del gimnasio'
      }));
      isValid = false;
    }
  } else if (dayOfWeek === 6) { // Sábado
    if (startInMinutes < 8 * 60 || endInMinutes > 16 * 60) {
      setErrors(prev => ({
        ...prev,
        timeRange: 'Esta clase no se puede crear porque no está dentro del horario del gimnasio'
      }));
      isValid = false;
    }
  } else { // Lunes a Viernes
    if (startInMinutes < 6 * 60 || endInMinutes > 16 * 60) {
      setErrors(prev => ({
        ...prev,
        timeRange: 'Esta clase no se puede crear porque no está dentro del horario del gimnasio'
      }));
      isValid = false;
    }
  }

  if (isValid) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.timeLogic;
      delete newErrors.timeRange;
      return newErrors;
    });
  }

    return isValid;
};

useEffect(() => {
  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:3005/clases');
      if (!response.ok) {
        throw new Error('Error al obtener clases');
      }
      const data = await response.json();
      setClasses(data);
      console.log(data); // Verifica que las clases se cargan correctamente
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  };

  fetchClasses();
}, []);

  const handleDeleteClass = (className) => {
    const updatedClasses = classes.filter((classItem) => classItem.nombre !== className);
    setClasses(updatedClasses);  // Actualizar el estado de las clases
  };
  
  // useEffect para actualizar los eventos del calendario cuando cambian las clases
  useEffect(() => {
    if (classes.length > 0) {
      const mappedClasses = classes.map((clase) => {
        const startDate = new Date(`${clase.fecha.split('T')[0]}T${clase.startTime}`);
        const endDate = new Date(`${clase.fecha.split('T')[0]}T${clase.endTime}`);
  
        return {
          title: clase.nombre,
          start: startDate,
          end: endDate,
          description: clase.descripcion,
          entrenador: clase.entrenador,
          id: clase.id,
        };
      });
      
      console.log('Mapped Classes:', mappedClasses); // Verifica la salida
      setEvents(mappedClasses);
    }
  }, [classes]);

  const handleEventClick = (event) => {
    navigate(`/ClassDetail/${event.title}`);
    window.scrollTo(0, 0);
  };

  // Validaciones en tiempo real
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    


    switch (field) {
      case 'nombre':
        if (!value || value.length < 3 || value.length > 50) {
          newErrors.nombre = 'El nombre de la clase debe tener entre 3 y 50 caracteres.';
        } else {
          delete newErrors.nombre;
        }
        break;

      case 'entrenador':
        if (!value || value.length < 1 || value.length > 100) {
          newErrors.entrenador = 'El nombre del Entrenador debe tener entre 1 y 100 caracteres.';
        } else {
          delete newErrors.entrenador;
        }
        break;

      
        case 'time':
          if (!newClass.startTime || !newClass.endTime) {
            newErrors.time = 'Debes seleccionar un horario válido.';
          } else {
            const [startHour, startMinute] = newClass.startTime.split(':');
            const [endHour, endMinute] = newClass.endTime.split(':');
    
            const startDate = new Date(newClass.day);
            const endDate = new Date(newClass.day);
            const now = new Date();
    
            startDate.setHours(startHour, startMinute, 0, 0);
            endDate.setHours(endHour, endMinute, 0, 0);
    
            // Validar que la hora de inicio sea menor que la de fin
            if (startDate >= endDate) {
              newErrors.time = 'La hora de fin debe ser posterior a la hora de inicio.';
            } else if (new Date(newClass.day).toDateString() === currentDate.toDateString()) {
              // Si la fecha es hoy, validamos que la hora de inicio no sea en el pasado
              if (startDate < now) {
                newErrors.time = 'No puedes seleccionar una hora de inicio pasada para hoy.';
              } else {
                delete newErrors.time;
              }
            } else {
              delete newErrors.time;
            }
          }
          break;  

          case 'day':
            if (!value) {
                newErrors.day = 'Debes seleccionar una fecha válida.';
            } else {
                const selectedDate = moment(value); // Fecha seleccionada con moment
                const currentDate = moment().startOf('day'); // Fecha actual, solo con día (sin horas)

                // Comparar si la fecha seleccionada es anterior a la actual
                if (selectedDate.isBefore(currentDate, 'day')) {
                    newErrors.day = 'No puedes seleccionar una fecha anterior a la actual.';
                } else {
                    delete newErrors.day;
                }
            }
            break;


      case 'descripcion':
        if (!value || value.length < 30 || value.length > 200) {
          newErrors.descripcion = 'La descripción debe tener entre 30 y 200 caracteres.';
        } else {
          delete newErrors.descripcion;
        }
        break;

      case 'totalCupos':
        // Verificar si el valor contiene solo números
        if (/^\d*$/.test(value)) {
          // Verificar si el número es mayor que 0
          if (parseInt(value , 10) > 0) {
            delete newErrors.totalCupos;  // No hay error
          } else {
            // Mostrar alerta si el número es menor o igual a 0
            newErrors.totalCupos = 'El total de cupos debe ser un número mayor a 0.';
          }
        } else {
          // Mostrar alerta si se ingresan caracteres no numéricos
          newErrors.totalCupos = 'El total de cupos solo puede contener números, no letras ni caracteres especiales.';
        }
        break;

        case 'precio':
        // Verificar si el valor contiene solo números
        if (/^\d*$/.test(value)) {
          // Verificar si el número es mayor que 0
          if (parseInt(value, 10) > 0 ) {
            delete newErrors.precio;  // No hay error
          } else {
            // Mostrar alerta si el número es menor o igual a 0
            newErrors.precio = 'El total de cupos debe ser un número mayor a 0.';
          }
        } else {
          // Mostrar alerta si se ingresan caracteres no numéricos
          newErrors.precio = 'El total de cupos solo puede contener números, no letras ni caracteres especiales.';
        }
        break;

      default:
        break;
    }
    setErrors(newErrors);
  };

   // Modificar handleChange para incluir validación de horarios
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedClass = { ...newClass, [name]: value };
    setNewClass(updatedClass);

    // Validar horarios cuando cambian
    if (name === 'startTime' || name === 'endTime' || name === 'day') {
      if (updatedClass.startTime && updatedClass.endTime && updatedClass.day) {
        validateTimeRange(updatedClass.startTime, updatedClass.endTime, updatedClass.day);
      }
    }

    validateField(name, value);
  };

   // Función para mostrar la alerta con un temporizador
  const showAlertWithTimeout = (type, message, timeout = 5000) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Actualizamos el estado de la alerta
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);

    // Iniciamos un nuevo temporizador para ocultar la alerta
    const id = setTimeout(() => {
      setShowAlert(false); // Ocultamos la alerta después del tiempo especificado
      setAlertType(null);  // Limpiamos el tipo de alerta
      setAlertMessage(''); // Limpiamos el mensaje de alerta
    }, timeout);

    setTimeoutId(id);
  };

  // Función para cerrar la alerta manualmente
  const handleAlertClose = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Ocultamos la alerta y limpiamos el estado
    setShowAlert(false);
    setAlertType(null);
    setAlertMessage('');
  };

  const handleAddClass = (e) => {
    e.preventDefault();

    // Validar todo el formulario antes de enviar
    if (Object.keys(errors).length === 0 && newClass.nombre && newClass.entrenador && newClass.startTime && newClass.endTime && newClass.day && newClass.descripcion && newClass.totalCupos) {
      const nuevaClase = {
        nombre: newClass.nombre,
        entrenador: newClass.entrenador,
        startTime: newClass.startTime,
        endTime: newClass.endTime,
        day: newClass.day, // Use full date string
        descripcion: newClass.descripcion,
        totalCupos: newClass.totalCupos,
        cuposDisponibles: newClass.totalCupos,
        fecha: newClass.day, // Storing the same date as 'fecha'
        precio: newClass.precio || 0,
        inscritos: []
      };

      // Enviar la nueva clase al servidor mediante una solicitud POST
      fetch('http://localhost:3005/clases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaClase),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar la clase');
        }
        return response.json();
      })
      .then(data => {
        // Actualizar el estado de las clases con la nueva clase devuelta por el servidor
        setClasses([...classes, data]);

        // Restablecer el formulario y mostrar alerta de éxito
        setNewClass({
          nombre: '',
          entrenador: '',
          startTime: '',
          endTime: '',
          day: '',
          descripcion: '',
          totalCupos: '',   
          precio: '',  // Campo opcional
          inscritos: [] // Restablecer a un array vacío
        });
        setShowForm(false);

        showAlertWithTimeout('success', `Clase "${newClass.nombre}" añadida correctamente.`);
      })
      .catch(error => {
        showAlertWithTimeout('error', 'Error al agregar la clase, por favor verifica bien todos los campos');
        console.error('Error al agregar la clase:', error);
      });
    } else {
      // Mostrar alerta de error si hay problemas en el formulario
      showAlertWithTimeout('error', 'Error en el formulario, revisa los campos.');
    }
  };


    // Formato de 12 horas (AM/PM)
    const formats = {
      timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'h:mm A', culture),
      eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
        `${localizer.format(start, 'h:mm A', culture)} - ${localizer.format(end, 'h:mm A', culture)}`,
      agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
        `${localizer.format(start, 'h:mm A', culture)} - ${localizer.format(end, 'h:mm A', culture)}`,
    };


  const resetForm = () => {
    setNewClass({
      nombre: '',
      entrenador: '',
      startTime: '',
      endTime: '',
      day: '',
      descripcion: '',
      totalCupos: '',   
      precio: '',
      inscritos: [] // Restablecer el campo inscritos
    });
    setErrors({});
  };

  const handleMisClasesClick = () => {
    setShowMisClases(!showMisClases);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);  // Oculta el formulario
  };


  console.log(events);

  return (
<div className={`calendar-container ${showForm ? 'form-visible' : ''}`}>
  <div className="header-container">
    <h2>Clases</h2>
    <div className="Filter">
      {(user.role === 'admin' || user.role === 'employee') && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="AddButtonLink">
            {showForm ? 'Cancelar' : 'Añadir Clase'}
          </button>
          
        </>
      )}
      {user.role === 'client' && (
        <>
          <button onClick={handleMisClasesClick} className="AddButtonLink">
            {showMisClases ? 'Cerrar' : 'Mis Clases'}
          </button>
        </>
      )}
    </div>
  </div>

  {/* Mostrar alerta según el tipo */}
  {showAlert && alertType && (
      <Stack sx={{ width: '20%', marginTop: 0, position: 'fixed', left: '80%', zIndex: '1000' }} spacing={2}>
        <Alert variant="filled" severity={alertType} onClose={handleAlertClose}>
          {alertMessage}
        </Alert>
      </Stack>
    )}


  <div className="header-description">
    <p className="header-description">
      Aquí puedes encontrar una lista de todas las clases programadas. 
      Usa el filtro para buscar clases específicas y 
      inscríbete a nuestras clases.
    </p>
  </div>

    {showMisClases && (
        <div className="mis-clases-container">
          <MisClases />
        </div>
    )}
    {(user.role === 'admin' || user.role === 'employee') && (
        <>
          <div className="mis-clases-container">
          <MisClases />
        </div>
        </>
      )}

    <div className={`calendar-form-wrapper ${showMisClases ? 'mis-clases-visible' : ''}`}>
      {/* Calendar Section */}
      <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={handleEventClick}
        formats={formats}
        messages={{
          next: 'Siguiente',
          previous: 'Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango',
          showMore: (total) => `+ Ver más (${total})`,
        }}
      />
      </div>

      {/* Formulario para agregar clase */}
      {showForm && (
        
          <form onSubmit={handleAddClass} className="add-class-form">
            <h2 className="form-title">Agregar Clase</h2>
            <div className="form-field field-row">
              <div className="field-half">
                <label className='form-clases'>Nombre <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="nombre"
                  value={newClass.nombre}
                  onChange={handleChange}
                  required
                  placeholder='Nombre de la clase'
                  className="vkz-input-field"
                  maxLength="50"
                  minLength="3"
                  autoFocus
                />
                {errors.nombre && (
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="outlined" severity="error">{errors.nombre}</Alert>
                  </Stack>
                )}
              </div>
              </div>

              <div className="form-field field-row">
                <div className="field-half">
                  <label className='form-clases'>Entrenador <span style={{ color: 'red' }}>*</span></label>
                  <select
                    name="entrenador"
                    value={newClass.entrenador}
                    onChange={handleChange}
                    required
                    className="vkz-input-field"
                  >
                    <option value="">Seleccione un Entrenador</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                  {errors.entrenador && (
                    <Alert variant="outlined" severity="error">{errors.entrenador}</Alert>
                  )}
                </div>
              </div>

            <div className="form-field">
              <label className='form-clases'>Fecha <span style={{ color: 'red' }}>*</span></label>
              <input
                type="date"
                name="day"
                value={newClass.day}
                onChange={handleChange}
                required
                className="vkz-input-field"
              />
              {errors.day && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert variant="outlined" severity="error">{errors.day}</Alert>
                </Stack>
              )}
            </div>

            {/* Agrupación de hora de inicio y final */}
            <div className="form-field field-row">
             <div className="field-half">
               <label className='form-clases'>Hora de Inicio <span style={{ color: 'red' }}>*</span></label>
               <input
                 type="time"
                 name="startTime"
                 value={newClass.startTime}
                 onChange={handleChange}
                 required
                 className="vkz-input-field"
               />
             </div>
             <div className="field-half">
               <label className='form-clases'>Hora de Fin <span style={{ color: 'red' }}>*</span></label>
               <input
                 type="time"
                 name="endTime"
                 value={newClass.endTime}
                 onChange={handleChange}
                 required
                 className="vkz-input-field"
               />
               {errors.timeLogic && (
                 <Alert variant="outlined" severity="warning">
                   {errors.timeLogic}
                 </Alert>
               )}
               {errors.timeRange && (
                 <Alert variant="outlined" severity="info">
                   {errors.timeRange}
                 </Alert>
               )}
             </div>
           </div>
            
            <div className="form-field field-row">
              <div className="field-half">
                <label className='form-clases'>Total de cupos <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="number"
                  name="totalCupos"
                  value={newClass.totalCupos}
                  onChange={handleChange}
                  required
                  placeholder='Numero de cupos'
                  className="vkz-input-field"
                  min="1"
                />
                {errors.totalCupos && (
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="outlined" severity="error">{errors.totalCupos}</Alert>
                  </Stack>
                )}
              </div>
              
              <div className="field-half">
                <label className='form-clases'>Precio <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="number"
                  name="precio"
                  value={newClass.precio}
                  onChange={handleChange}
                  placeholder='Precio de la clase'
                  className="vkz-input-field"
                  min="0"
                />
                {errors.precio && (
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="outlined" severity="error">{errors.precio}</Alert>
                  </Stack>
                )}
              </div>
            </div>
            {/* Campo de descripción al final con contador de caracteres */}
            <div className="form-field">
              <label className='form-clases'>Descripción <span style={{ color: 'red' }}>*</span></label>
              <textarea
                name="descripcion"
                value={newClass.descripcion}
                onChange={handleChange}
                required
                className="vkz-input-field descripcion-field"
                maxLength="200"
                placeholder='Descripción de la clase'
                minLength="30"
                style={{ resize: 'vertical', maxHeight: '200px' }}
              />
              <div className="char-counter">{newClass.descripcion.length}/200</div>
              {errors.descripcion && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert variant="outlined" severity="error">{errors.descripcion}</Alert>
                </Stack>
              )}
            </div>
            <div className="form-button">
            <button type="button" onClick={handleClearForm} className="vkz-button-l">
              Limpiar
            </button>
            <button type="submit"  className="vkz-button">
              Agregar Clase
            </button>
           
            </div>
          </form>
        
      )}
    </div>

</div>
);
};

export default CalendarClases;