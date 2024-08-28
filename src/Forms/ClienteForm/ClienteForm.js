import React, { useState, useEffect } from 'react';
import './ClienteForm.css';
import { useNavigate } from 'react-router-dom';
import userIcon from '../../assets/icons/userIcon.png';
import fingerprintIcon from '../../assets/icons/fingerprintIcon.png';
import Button from '../../components/Button/Button';
import eyeIcon from '../../assets/icons/OjoAbierto.png';
import eyeOffIcon from '../../assets/icons/OjoBloqueado.png';

const ClienteForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    sexo: '',
    tipoCuerpo: '', // Rutina del cliente
    peso: '',
    altura: '',
    usuario: '',
    password: '',
    rutinas: '' // Nuevo campo agregado para rutinas
  });
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
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
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d.*\d)[^\s]{10,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError('La contraseña del usuario debe tener al menos 10 caracteres, 1 mayúscula, 1 caracter especial, 2 números y no debe contener espacios.');
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

    const requiredFields = ['nombre', 'apellido', 'sexo', 'peso', 'altura', 'usuario', 'password'];
    const isFormValid = requiredFields.every(field => formData[field].trim() !== '');

    if (isFormValid && !passwordError) {
      const newClient = { 
        nombre: formData.nombre,
        apellido: formData.apellido,
        sexo: formData.sexo,
        tipoCuerpo: formData.tipoCuerpo, // Rutina del cliente
        peso: formData.peso,
        altura: formData.altura,
        usuario: formData.usuario,
        password: formData.password,
        rutinas: formData.rutinas, // Nuevo campo para rutinas
        id: currentId.toString() 
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
          alert('Cliente agregado exitosamente');
          navigate('/adminEmpleadoIndex');
        } else {
          alert('Error al agregar el cliente');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al agregar el cliente.');
      }
    } else {
      setFormError('Por favor, completa todos los campos requeridos y asegúrate de que la contraseña cumpla con los requisitos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cliente-form">
      <h2>Formulario</h2>
      <div className="form-content">
        <div className="form-fields">
          <div className="input-row">
            <input type="text" name="nombre" placeholder="Nombre" required value={formData.nombre} onChange={handleInputChange} />
            <input type="text" name="apellido" placeholder="Apellido" required value={formData.apellido} onChange={handleInputChange} />
            <select name="sexo" required value={formData.sexo} onChange={handleInputChange}>
              <option value="" disabled>Sexo</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
            </select>
          </div>
          <div className="input-row">
            <input type="number" name="peso" placeholder="Peso" required value={formData.peso} onChange={handleInputChange} />
            <input type="number" name="altura" placeholder="Altura" required value={formData.altura} onChange={handleInputChange} />
            <input type="text" name="tipoCuerpo" placeholder="Rutina del cliente" readOnly value={formData.tipoCuerpo} onChange={handleInputChange} />
          </div>
          <div className="input-row">
            <input type="text" readOnly placeholder='Membresía actual' className="full-width" />
            <input type="text" readOnly placeholder='Plan actual' className="full-width" />
            <input type="text" readOnly placeholder='Ticketera' className="full-width" />
          </div>
          <div className="input-row">
            <input type="text" name="usuario" placeholder='Usuario' className="full-width" required value={formData.usuario} onChange={handleInputChange} />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder='Contraseña'
                className="full-width"
                required
                value={formData.password}
                onChange={(e) => validatePassword(e.target.value)}
              />
              <img
                src={showPassword ? eyeIcon : eyeOffIcon}
                alt="Toggle Password Visibility"
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          {passwordError && <p className="error-message">{passwordError}</p>}
          {formError && <p className="error-message">{formError}</p>}
        </div>
      </div>
      <div className="form-buttons">
        <Button type="submit" className="add-button">Agregar</Button>
      </div>
    </form>
  );
};

export default ClienteForm;