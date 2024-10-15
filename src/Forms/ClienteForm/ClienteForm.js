import React, { useState, useEffect } from 'react';
import './ClienteForm.css';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const ClienteForm = () => {
  const [currentId, setCurrentId] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    tipoDocumento: '',
    numeroDocumento: '',
    correo: '',
    telefono: '',
    sexo: '',
    peso: '',
    altura: '',
    password: '',
    tickets: 0,
    planes: []
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [userWarning, setUserWarning] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [emailError, setEmailError] = useState('');

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
    generatePassword();
  }, []);

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    let hasUpperCase = false;
    let hasSpecialChar = false;
    let numberCount = 0;

    while (password.length < 10 || !hasUpperCase || !hasSpecialChar || numberCount < 2) {
      const randomChar = charset[Math.floor(Math.random() * charset.length)];
      password += randomChar;

      if (randomChar >= 'A' && randomChar <= 'Z') hasUpperCase = true;
      if ("!@#$%^&*".includes(randomChar)) hasSpecialChar = true;
      if (randomChar >= '0' && randomChar <= '9') numberCount++;

      if (password.length >= 10 && (!hasUpperCase || !hasSpecialChar || numberCount < 2)) {
        password = "";
        hasUpperCase = false;
        hasSpecialChar = false;
        numberCount = 0;
      }
    }

    setFormData(prevState => ({
      ...prevState,
      password: password
    }));
  };

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
    } else if (name === 'correo') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
      validateEmail(value);
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

  const validateEmail = (email) => {
    const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com'];
    const domain = email.split('@')[1];
    if (!validDomains.includes(domain)) {
      setEmailError('Por favor, utilice un dominio de correo electrónico válido.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const requiredFields = ['nombre', 'apellido', 'tipoDocumento', 'numeroDocumento', 'sexo', 'usuario', 'correo'];
    const isFormValid = requiredFields.every(field => formData[field].trim() !== '');

    if (isFormValid && !userWarning && !documentError && !emailError) {
      if (formData.telefono && formData.telefono.length !== 10) {
        setFormError('El número de teléfono debe tener exactamente 10 dígitos.');
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
        fechaCreacion,
        horaCreacion,
        tickets: 0,
        planes: []
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
    } else if (emailError) {
      setFormError('Por favor, ingresa un correo electrónico válido.');
    } else {
      setFormError('Por favor, completa todos los campos requeridos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="unique-cliente-form">
      <h2>Agregar Cliente</h2>
      <div className="unique-form-content">
        <div className="unique-form-fields">
          <div className="form-column">
            <label htmlFor="nombre">Nombre <span className="required">*</span></label>
            <input type="text" id="nombre" name="nombre" required value={formData.nombre} onChange={handleInputChange} title="Nombre del cliente" />

            <label htmlFor="apellido">Apellido <span className="required">*</span></label>
            <input type="text" id="apellido" name="apellido" required value={formData.apellido} onChange={handleInputChange} title="Apellido del cliente" />

            <label htmlFor="usuario">Usuario <span className="required">*</span></label>
            <input type="text" id="usuario" name="usuario" required value={formData.usuario} onChange={handleInputChange} title="Nombre de usuario" />

            <label htmlFor="tipoDocumento">Tipo de documento <span className="required">*</span></label>
            <select id="tipoDocumento" name="tipoDocumento" required value={formData.tipoDocumento} onChange={handleInputChange} title="Tipo de documento de identidad">
              <option value="" disabled>Seleccione el tipo de documento</option>
              <option value="CC">CC</option>
              <option value="TI">TI</option>
              <option value="CE">CE</option>
            </select>

            <label htmlFor="numeroDocumento">Número de Documento <span className="required">*</span></label>
            <input type="text" id="numeroDocumento" name="numeroDocumento" required value={formData.numeroDocumento} onChange={handleInputChange} title="Número de documento de identidad" />
          </div>

          <div className="form-column">
            <label htmlFor="correo">Correo Electrónico <span className="required">*</span></label>
            <input type="email" id="correo" name="correo" required value={formData.correo} onChange={handleInputChange} title="Dirección de correo electrónico" />

            <label htmlFor="telefono">Número telefónico</label>
            <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} minLength="10" maxLength="10" title="Número de teléfono (opcional)" />

            <label htmlFor="sexo">Género <span className="required">*</span></label>
            <select id="sexo" name="sexo" required value={formData.sexo} onChange={handleInputChange} title="Género del cliente">
              <option value="" disabled>Seleccione el género</option>
              <option value="Hombre">Masculino</option>
              <option value="Mujer">Femenino</option>
            </select>

            <label htmlFor="peso">Peso</label>
            <input type="text" id="peso" name="peso" value={formData.peso} onChange={handleInputChange} minLength="2" maxLength="3" title="Peso en kilogramos (opcional)" />

            <label htmlFor="altura">Altura</label>
            <input type="text" id="altura" name="altura" value={formData.altura} onChange={handleInputChange} minLength="3" maxLength="3" title="Altura en centímetros (opcional)" />
          </div>
        </div>

        <input type="hidden" name="password" value={formData.password} />

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

        {emailError && (
          <Alert severity="error" style={{ marginTop: '10px' }}>
            {emailError}
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