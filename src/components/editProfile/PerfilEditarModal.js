import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useAuth } from '../../context/RoleContext'; // Importamos el hook de autenticación
import './PerfilEditarModal.css';
import ConfirmLogoutModal from '../Modal/ConfirmLogoutModal';
import { useNavigate } from 'react-router-dom';


const PerfilEditarModal = ({ onClose }) => {
  const { user, setUser, logout } = useAuth(); // Ahora obtenemos la función logout
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
  const [showConfirmLogout, setShowConfirmLogout] = useState(false); // Nuevo estado
  const navigate = useNavigate();

  console.log('Usuario en PerfilEditarModal:', user);

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
            sexo: data.sexo || '',
            tipoCuerpo: data.tipoCuerpo || '',
            peso: data.peso || '',
            altura: data.altura || '',
            password: data.password || '', // Contraseña en blanco por seguridad
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
      case 'sexo':
        if (!value) newErrors.sexo = 'Debes seleccionar un sexo.';
        else delete newErrors.sexo;
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

    const hasChanges = Object.keys(formData).some(key => formData[key] !== user[key]);

    if (!hasChanges) {
      showAlertWithTimeout('info', 'Todos los datos están actualizados.');
      return;
    }

    setShowConfirmLogout(true); // Muestra el modal de confirmación
  };


  const handleConfirmLogout = () => {
    let apiUrl = `http://localhost:3001/client/${user.id}`;
    fetch(apiUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al actualizar el perfil');
        return response.json();
      })
      .then((updatedUser) => {
        setUser(updatedUser);
        showAlertWithTimeout('success', 'Perfil actualizado correctamente');
        logout(); // Cerrar sesión y limpiar localStorage
        navigate('/LoginP/'); // Redirigir a la página de inicio de sesión
      })
      .catch((error) => {
        showAlertWithTimeout('error', `Error: ${error.message}`);
      });
  };

  


  return (
    <div className="modal-fondo-gris">
      {showConfirmLogout && (
        <ConfirmLogoutModal 
          onConfirm={handleConfirmLogout} 
          onCancel={() => setShowConfirmLogout(false)} 
        />
      )}
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
            <div className="form-field">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="vkz-input-field"
                max={10}
              />
              {errors.telefono && <span className="error-text">{errors.telefono}</span>}
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
          </div>

          <div className="form-field field-row">
            <div className="field-half">
              <label className="form-label">Sexo</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="vkz-input-field"
                required
              >
                <option value="">Selecciona un Sexo</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="otro">Otro</option>
              </select>
              {errors.sexo && <span className="error-text">{errors.sexo}</span>}
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

          <div className="form-field">
            
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
