import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useAuth } from '../../context/RoleContext'; // Importamos el hook de autenticación
import './PerfilEditarModal.css';

const PerfilEditarModal = ({ onClose }) => {
  const { user, setUser } = useAuth(); // Obtenemos el usuario y la función para actualizarlo
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    genero: '',
    tipoCuerpo: '',
    peso: '',
    altura: '',
    password: '',
    correo: '',
    telefono: ''
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(null);

  // Función para mostrar alertas
  const showAlertWithTimeout = (type, message, timeout = 5000) => {
    setShowAlert(true);
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setShowAlert(false);
    }, timeout);
  };

  // Cargar los datos del usuario
  useEffect(() => {
    if (user && user.id) {
      let apiUrl = '';
      switch (user.role) {
        case 'admin':
          apiUrl = `http://localhost:3001/admin/${user.id}`;
          break;
        case 'employee':
          apiUrl = `http://localhost:3001/employee/${user.id}`;
          break;
        case 'client':
          apiUrl = `http://localhost:3001/client/${user.id}`;
          break;
        default:
          console.error('Rol de usuario no reconocido');
          return;
      }

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            genero: data.sexo || data.genero || '',
            tipoCuerpo: data.tipoCuerpo || '',
            peso: data.peso || '',
            altura: data.altura || '',
            password: '', // Contraseña en blanco por seguridad
            correo: data.correo || '',
            telefono: data.telefono || ''
          });
        })
        .catch((error) => {
          showAlertWithTimeout('error', `Error al cargar los datos del usuario: ${error.message}`);
        });
    }
  }, [user]);

  // Validar campos
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'genero':
        if (!value) newErrors.genero = 'Debes seleccionar un género.';
        else delete newErrors.genero;
        break;
      case 'password':
        if (value && value.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
        else delete newErrors.password;
        break;
      case 'correo':
        if (!value || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) newErrors.correo = 'Correo inválido.';
        else delete newErrors.correo;
        break;
      case 'telefono':
        if (!value || value.length !== 10) newErrors.telefono = 'El teléfono debe tener 10 dígitos.';
        else delete newErrors.telefono;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  // Enviar los datos del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(errors).length === 0) {
      let apiUrl = '';
      switch (user.role) {
        case 'admin':
          apiUrl = `http://localhost:3001/admin/${user.id}`;
          break;
        case 'employee':
          apiUrl = `http://localhost:3001/employee/${user.id}`;
          break;
        case 'client':
          apiUrl = `http://localhost:3001/client/${user.id}`;
          break;
        default:
          console.error('Rol de usuario no reconocido');
          return;
      }

      fetch(apiUrl, {
        method: 'PATCH', // PATCH para actualizar parcialmente
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al actualizar el perfil');
          }
          return response.json();
        })
        .then((updatedUser) => {
          setUser(updatedUser); // Actualizamos el usuario en el contexto
          showAlertWithTimeout('success', 'Perfil actualizado correctamente');
          onClose(); // Cerrar el modal
        })
        .catch((error) => {
          showAlertWithTimeout('error', `Error al actualizar el perfil: ${error.message}`);
        });
    } else {
      showAlertWithTimeout('error', 'Error en el formulario, revisa los campos.');
    }
  };

  return (
    <div className="modal-fondo-gris">
      <div className="contenido-modal">
        <h2 className="form-title">Editar Perfil</h2>

        {showAlert && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity={alertType}>{alertMessage}</Alert>
          </Stack>
        )}

        <form onSubmit={handleSubmit} className="editar-perfil-form">
          <div className="form-field field-row">
            <div className="field-half">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                disabled // Campo no editable
                required
                className="vkz-input-field"
              />
            </div>
            <div className="field-half">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                disabled // Campo no editable
                required
                className="vkz-input-field"
              />
            </div>
          </div>

          <div className="form-field field-row">
            <div className="field-half">
              <label className="form-label">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="vkz-input-field"
                required
              >
                <option value="">Selecciona un género</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="otro">Otro</option>
              </select>
              {errors.genero && <span className="error-text">{errors.genero}</span>}
            </div>
            <div className="field-half">
              <label className="form-label">Tipo de Cuerpo</label>
              <input
                type="text"
                name="tipoCuerpo"
                value={formData.tipoCuerpo}
                disabled // Campo no editable
                required
                className="vkz-input-field"
              />
            </div>
          </div>

          <div className="form-field field-row">
            <div className="field-half">
              <label className="form-label">Peso (kg)</label>
              <input
                type="number"
                name="peso"
                value={formData.peso}
                disabled // Campo no editable
                required
                className="vkz-input-field"
              />
            </div>
            <div className="field-half">
              <label className="form-label">Altura (cm)</label>
              <input
                type="number"
                name="altura"
                value={formData.altura}
                disabled // Campo no editable
                required
                className="vkz-input-field"
              />
            </div>
          </div>

          <div className="form-field field-row">
            <div className="form-field">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="vkz-input-field"
              />
              {errors.telefono && <span className="error-text">{errors.telefono}</span>}
            </div>

            <div className="form-field">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="vkz-input-field"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="vkz-input-field"
            />
            {errors.correo && <span className="error-text">{errors.correo}</span>}
          </div>

          <div className="form-button">
            <button type="button" className="vkz-button-l" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="vkz-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilEditarModal;
