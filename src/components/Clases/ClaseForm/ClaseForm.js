import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import './ClaseForm.css';
import moment from 'moment';

// Helper to ensure date is formatted as "yyyy-MM-dd"
const formatDate = (date) => {
  if (!date) return ''; 
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Helper function to convert 12-hour time format (AM/PM) to 24-hour format (HH:mm)
const convertTo24Hour = (time) => {
  if (!time || typeof time !== 'string') return ''; 
  const [hourPart, minutePart] = time.split(':');
  const period = minutePart.slice(-2);
  const minutes = minutePart.slice(0, 2);

  let hours = parseInt(hourPart, 10);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const ClaseForm = ({ initialClass, onSubmit, onCancel }) => {
  const [classData, setClassData] = useState({
    nombre: initialClass.nombre || '',
    entrenador: initialClass.entrenador || '',
    startTime: convertTo24Hour(initialClass.startTime),
    endTime: convertTo24Hour(initialClass.endTime),
    day: initialClass.fecha ? formatDate(initialClass.fecha) : formatDate(new Date()),
    descripcion: initialClass.descripcion || '',
    totalCupos: initialClass.totalCupos || '',
    precio: initialClass.precio || '',
    cuposDisponibles: initialClass.cuposDisponibles || initialClass.totalCupos,
    inscritos: initialClass.inscritos || [],
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Effect to update class data when initialClass changes
  useEffect(() => {
    setClassData({
      nombre: initialClass.nombre || '',
      entrenador: initialClass.entrenador || '',
      startTime: convertTo24Hour(initialClass.startTime),
      endTime: convertTo24Hour(initialClass.endTime),
      // Use initialClass.fecha properly or a fallback
      day: initialClass.fecha ? formatDate(initialClass.fecha) : '',
      descripcion: initialClass.descripcion || '',
      totalCupos: initialClass.totalCupos || '',
      precio: initialClass.precio || '',
      // Ensure that cuposDisponibles and inscritos are retained
      cuposDisponibles: initialClass.cuposDisponibles || initialClass.totalCupos,
      inscritos: initialClass.inscritos || [],
    });
  }, [initialClass]);
  

  // Cargar empleados al montar el componente
  useEffect(() => {
    fetch('http://localhost:3005/empleados')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error al cargar empleados:', error));
  }, []);

  // Real-time validation
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'nombre':
        if (!value || value.length < 3 || value.length > 50) {
          newErrors.nombre = 'El nombre debe tener entre 3 y 50 caracteres.';
        } else {
          delete newErrors.nombre;
        }
        break;
      case 'entrenador':
        if (!value) {
          newErrors.entrenador = 'Debes seleccionar un entrenador.';
        } else {
          delete newErrors.entrenador;
        }
        break;
      case 'startTime':
      case 'endTime':
        if (!classData.startTime || !classData.endTime) {
          newErrors.time = 'Debes seleccionar un horario válido.';
        } else {
          const [startHour] = classData.startTime.split(':');
          const [endHour] = classData.endTime.split(':');
          if (parseInt(startHour, 10) >= parseInt(endHour, 10)) {
            newErrors.time = 'La hora de fin debe ser posterior a la de inicio.';
          } else {
            delete newErrors.time;
          }
        }
        break;
      case 'day':
        if (!value) {
          newErrors.day = 'Debes seleccionar una fecha válida.';
        } else {
          const selectedDate = moment(value);
          const currentDate = moment().startOf('day');
          if (selectedDate.isBefore(currentDate, 'day')) {
            newErrors.day = 'No puedes seleccionar una fecha anterior a la actual.';
          } else {
            delete newErrors.day;
          }
        }
        break;
      case 'descripcion':
        if (!value || value.length < 50 || value.length > 200) {
          newErrors.descripcion = 'La descripción debe tener entre 50 y 200 caracteres.';
        } else {
          delete newErrors.descripcion;
        }
        break;
      case 'totalCupos':
        if (isNaN(value) || parseInt(value, 10) <= 0) {
          newErrors.totalCupos = 'El total de cupos debe ser un número mayor a 0.';
        } else {
          delete newErrors.totalCupos;
        }
        break;
      case 'precio':
        if (isNaN(value) || parseInt(value, 10) < 0) {
          newErrors.precio = 'El precio debe ser un número mayor o igual a 0.';
        } else {
          delete newErrors.precio;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      Object.keys(errors).length === 0 &&
      classData.nombre &&
      classData.entrenador &&
      classData.startTime &&
      classData.endTime &&
      classData.day &&
      classData.descripcion &&
      classData.totalCupos
    ) {
      try {
        const response = await fetch(`http://localhost:3005/clases/${initialClass.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...classData,
            fecha: classData.day
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar la clase');
        }

        const updatedClass = await response.json();
        onSubmit(updatedClass);
        showAlertWithTimeout('success', 'Cambios guardados exitosamente.');
      } catch (error) {
        showAlertWithTimeout('error', error.message);
      }
    } else {
      showAlertWithTimeout('error', 'Error en el formulario, revisa los campos.');
    }
};

  // Show alert with timeout
  const showAlertWithTimeout = (type, message, timeout = 5000) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);

    const id = setTimeout(() => {
      setShowAlert(false);
      setAlertType(null);
      setAlertMessage('');
    }, timeout);

    setTimeoutId(id);
  };

  const handleCancel = () => {
    onCancel();
  };


  return (
    <form onSubmit={handleSubmit} className="modify-class-form">

      <h2 className="form-title">Modificar Clase</h2>

      <div className="form-field field-row">
        <div className="field-half">
          <label className="form-clases">Nombre <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="nombre"
            value={classData.nombre}
            onChange={handleChange}
            required
            className="vkz-input-field"
            maxLength="50"
            minLength="3"
            autoFocus
          />
          {errors.nombre && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error">{errors.nombre}</Alert>
            </Stack>
          )}
        </div>
      </div>

      <div className="form-field field-row">
        <div className="field-half">
          <label className="form-clases">Entrenador <span style={{ color: 'red' }}>*</span></label>
          <select
              name="entrenador"
              value={classData.entrenador}
              onChange={handleChange}
              required
              className="vkz-input-field"
          >
              <option value="" disabled>
                  Selecciona un entrenador
              </option>
              {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
          </select>
          {errors.entrenador && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error">{errors.entrenador}</Alert>
            </Stack>
          )}
        </div>
      </div>

      <div className="form-field">
        <label className="form-clases">Fecha <span style={{ color: 'red' }}>*</span></label>
        <input
          type="date"
          name="day"
          value={classData.day}
          onChange={handleChange}
          required
          className="vkz-input-field"
        />
        {errors.day && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">{errors.day}</Alert>
          </Stack>
        )}
      </div>

      <div className="form-field field-row">
        <div className="field-half">
          <label className="form-clases">Hora de Inicio <span style={{ color: 'red' }}>*</span></label>
          <input
            type="time"
            name="startTime"
            value={classData.startTime}
            onChange={handleChange}
            className="vkz-input-field"
          />
          {errors.time && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error">{errors.time}</Alert>
            </Stack>
          )}
        </div>
        <div className="field-half">
          <label className="form-clases">Hora de Fin <span style={{ color: 'red' }}>*</span></label>
          <input
            type="time"
            name="endTime"
            value={classData.endTime}
            onChange={handleChange}
            className="vkz-input-field"
          />
          {errors.time && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error">{errors.time}</Alert>
            </Stack>
          )}
        </div>
      </div>

      <div className="form-field field-row">
        <div className="field-half">
          <label className="form-clases">Total de cupos <span style={{ color: 'red' }}>*</span></label>
          <input
            type="number"
            name="totalCupos"
            value={classData.totalCupos}
            onChange={handleChange}
            required
            className="vkz-input-field"
            min="1"
          />
          {errors.totalCupos && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error">{errors.totalCupos}</Alert>
            </Stack>
          )}
        </div>

        <div className="field-half">
          <label className="form-clases">Precio <span style={{ color: 'red' }}>*</span></label>
          <input
            type="number"
            name="precio"
            value={classData.precio}
            onChange={handleChange}
            className="vkz-input-field"
            min="0"
          />
          {errors.precio && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error">{errors.precio}</Alert>
            </Stack>
          )}
        </div>
      </div>

      <div className="form-field">
        <label className="form-clases">Descripción <span style={{ color: 'red' }}>*</span></label>
        <textarea
          name="descripcion"
          value={classData.descripcion}
          onChange={handleChange}
          required
          className="vkz-input-field descripcion-field"
          maxLength="200"
          minLength="50"
          style={{ resize: 'vertical', maxHeight: '200px' }}
        />
        <div className="char-counter">{classData.descripcion.length}/200</div>
        {errors.descripcion && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">{errors.descripcion}</Alert>
          </Stack>
        )}
      </div>

      <div className="form-button">
        
        <button type="button" className="vkz-button-l" onClick={handleCancel}>
          Cancelar
        </button>
        <button type="submit" className="vkz-button">
          Guardar Cambios
        </button>
      </div>
   

      {showAlert && alertType && (
        <Stack sx={{ width: '100%', marginTop: 2 }} spacing={2}>
          <Alert variant="filled" severity={alertType}>
            {alertMessage}
          </Alert>
        </Stack>
      )}
     
    </form>
  );
};

export default ClaseForm;
