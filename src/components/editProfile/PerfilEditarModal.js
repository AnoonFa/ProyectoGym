import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useAuth } from '../../context/RoleContext'; // Import the useAuth hook
import './PerfilEditarModal.css';

const PerfilEditarModal = ({ onClose }) => {
  const { user, setUser } = useAuth(); // Access user from context
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

  useEffect(() => {
    if (user) {
      console.log(user); // Debug: Check if user data is loaded correctly
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        genero: user.sexo || '',
        tipoCuerpo: user.tipoCuerpo || '',
        peso: user.peso || '',
        altura: user.altura || '',
        password: user.password || '',
        correo: user.correo || '',
        telefono: user.telefono || ''
      });
    }
  }, [user]);

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'genero':
        if (!value) newErrors.genero = 'Debes seleccionar un género.';
        else delete newErrors.genero;
        break;
      case 'password':
        if (!value || value.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser); // Update the user in context
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage('Perfil actualizado correctamente.');
    } else {
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage('Error en el formulario, revisa los campos.');
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
