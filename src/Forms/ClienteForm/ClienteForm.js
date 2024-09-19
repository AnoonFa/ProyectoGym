import React, { useState, useEffect } from 'react';
import './ClienteForm.css';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import eyeIcon from '../../assets/icons/OjoAbierto.png';
import eyeOffIcon from '../../assets/icons/OjoBloqueado.png';

const ClienteForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    sexo: '',
    tipoCuerpo: '',
    peso: '',
    altura: '',
    usuario: '',
    password: '',
    rutinas: '',
    correo: '',
    telefono: '',
    tickets: 0
  });
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [userWarning, setUserWarning] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [currentId, setCurrentId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3001/client');
        const data = await response.json();
        const maxId = data.reduce((max, client) => Math.max(max, parseInt(client.id, 10)), 0);
        setCurrentId(maxId + 1);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setFormError('Error al cargar los datos de los clientes.');
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'peso' || name === 'altura') {
      let numericValue = value.replace(/[^0-9.]/g, '');
      numericValue = numericValue.replace(/(\..*?)\..*/g, '$1');
      numericValue = numericValue.slice(0, 3);
      setFormData(prevState => ({
        ...prevState,
        [name]: numericValue
      }));
    } else if (name === 'telefono' || name === 'numeroDocumento') {
      const numericValue = value.replace(/\D/g, '').slice(0, name === 'numeroDocumento' ? 20 : 10);
      setFormData(prevState => ({
        ...prevState,
        [name]: numericValue
      }));
      if (name === 'numeroDocumento') {
        setDocumentError(numericValue.length < 8 ? 'Número de documento inválido, por favor escribir nuevamente' : '');
      }
    } else if (name === 'usuario') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
      checkUserExists(value);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const checkUserExists = async (username) => {
    try {
      const response = await fetch(`http://localhost:3001/client?usuario=${username}`);
      const data = await response.json();
      if (data.length > 0) {
        setUserWarning('El usuario que se va a ingresar ya está en la base de datos, por favor modifíquelo');
      } else {
        setUserWarning('');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d.*\d)[^\s]{10,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError('La contraseña debe tener al menos 10 caracteres, 1 mayúscula, 1 caracter especial, 2 números y sin espacios.');
    } else {
      setPasswordError('');
    }
    setFormData(prevState => ({
      ...prevState,
      password: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const requiredFields = ['nombre', 'apellido', 'tipoDocumento', 'numeroDocumento', 'sexo', 'peso', 'altura', 'usuario', 'password', 'correo', 'telefono'];
    const isFormValid = requiredFields.every(field => formData[field].trim() !== '');

    if (isFormValid && !passwordError && !userWarning && !documentError) {
      if (formData.telefono.length !== 10) {
        setFormError('El número de teléfono debe tener exactamente 10 dígitos.');
        return;
      }
      if (formData.peso.length < 2 || formData.altura.length < 2) {
        setFormError('El peso y la altura deben tener al menos 2 dígitos.');
        return;
      }
      if (formData.numeroDocumento.length < 8) {
        setDocumentError('Número de documento inválido, por favor escribir nuevamente');
        return;
      }

      const now = new Date();
      const fechaCreacion = now.toLocaleDateString('es-ES');
      const horaCreacion = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

      const newClient = { 
        ...formData,
        id: currentId.toString(),
        fechaCreacion,  // Nuevo campo fecha de creación
        horaCreacion    // Nuevo campo hora de creación
      };

      try {
        const response = await fetch('http://localhost:3001/client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClient),
        });

        if (response.ok) {
          setFormSuccess('Cliente agregado exitosamente');
          setTimeout(() => {
            navigate('/adminEmpleadoIndex');
          }, 2000);
        } else {
          setFormError('Error al agregar el cliente');
        }
      } catch (error) {
        console.error('Error:', error);
        setFormError('Hubo un problema al agregar el cliente.');
      }
    } else if (userWarning) {
      setFormError('Por favor, elige un nombre de usuario diferente.');
    } else if (documentError) {
      setFormError('Por favor, corrige el número de documento.');
    } else {
      setFormError('Por favor, completa todos los campos requeridos y asegúrate de que la contraseña cumpla con los requisitos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="unique-cliente-form">
      <h2>Agregar Cliente</h2>
      <div className="unique-form-content">
        <div className="unique-form-fields">
          <input type="text" name="nombre" placeholder="Nombre" required value={formData.nombre} onChange={handleInputChange} />
          <input type="text" name="apellido" placeholder="Apellido" required value={formData.apellido} onChange={handleInputChange} />
          <select name="tipoDocumento" required value={formData.tipoDocumento} onChange={handleInputChange}>
            <option value="" disabled>Tipo de documento</option>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="CE">CE</option>
          </select>
          <input type="number" name="numeroDocumento" placeholder="Número de documento" required value={formData.numeroDocumento} onChange={handleInputChange} />
          <select name="sexo" required value={formData.sexo} onChange={handleInputChange}>
            <option value="" disabled>Género</option>
            <option value="Hombre">Masculino</option>
            <option value="Mujer">Femenino</option>
          </select>
          <input type="email" name="correo" placeholder="Correo electrónico" required value={formData.correo} onChange={handleInputChange} />
          <input type="tel" name="telefono" placeholder="Número telefónico" required value={formData.telefono} onChange={handleInputChange} minLength="10" maxLength="10" />
          <input type="text" name="peso" placeholder="Peso (2-3 dígitos)" required value={formData.peso} onChange={handleInputChange} minLength="2" maxLength="3" />
          <input type="text" name="altura" placeholder="Altura (3 dígitos)" required value={formData.altura} onChange={handleInputChange} minLength="3" maxLength="3" />
          <input type="text" name="usuario" placeholder='Usuario' required value={formData.usuario} onChange={handleInputChange} />
          <div className="unique-password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder='Contraseña'
              required
              value={formData.password}
              onChange={(e) => validatePassword(e.target.value)}
            />
            <img
              src={showPassword ? eyeIcon : eyeOffIcon}
              alt="Toggle Password Visibility"
              className="unique-password-toggle-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>

        {passwordError && (
          <Alert severity="warning" style={{ marginTop: '10px' }}>
            {passwordError}
          </Alert>
        )}

        {userWarning && (
          <Alert severity="warning" style={{ marginTop: '10px' }}>
            {userWarning}
          </Alert>
        )}

        {documentError && (
          <Alert severity="error" style={{ marginTop: '10px' }}>
            {documentError}
          </Alert>
        )}

        {formError && (
          <Alert severity="error" style={{ marginTop: '10px' }}>
            {formError}
          </Alert>
        )}

        {formSuccess && (
          <Alert severity="success" style={{ marginTop: '10px' }}>
            {formSuccess}
          </Alert>
        )}
      </div>
      <div className="unique-form-buttons">
        <button type="submit" className="unique-add-button">Agregar</button>
      </div>
    </form>
  );
};

export default ClienteForm;