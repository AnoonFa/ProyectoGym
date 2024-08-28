import React, { useState } from 'react';
import './VerCliente.css';
import Button from '../Button/Button';
import ClienteForm from '../../Forms/ClienteForm/ClienteForm'; // Importamos el nuevo formulario
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function VerCliente() {
  const [showForm, setShowForm] = useState(false);

  const handleAddClientClick = (event) => {
    event.preventDefault(); // Evita que el formulario se envíe
    setShowForm(true);
  };

  return (
    <>
      <Header />
      <div className="vkz-container">
        <div className="vkz-form-container">
          <form>
            <div className="vkz-form-content">
              <h1 className="vkz-form-title">Buscar cliente</h1>
              <div className="vkz-input-group">
                <label htmlFor="nombre" className="vkz-input-label">
                  Nombre
                </label>
                <input id="nombre" placeholder="Nombre" className="vkz-input-field" />
                <div className="vkz-button-group">
                  <Button className="vkz-button">Buscar</Button>
                  <Button onClick={handleAddClientClick} className="vkz-button">Agregar Cliente</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
        {showForm && <ClienteForm />}
      </div>
      <Footer />
    </>
  );
}

export default VerCliente;
