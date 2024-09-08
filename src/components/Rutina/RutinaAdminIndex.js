import React, { useState } from 'react';
import FormularioCliente from './FormularioCliente';
import EjerciciosCliente from './EjerciciosCliente';
import AñadirRutina from './AñadirRutina';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './RutinaAdminIndex.css';

const RutinaAdminIndex = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [formularioVisible, setFormularioVisible] = useState(null); // 'modificar', 'añadir' o null
  const [botonClickeado, setBotonClickeado] = useState(false); // Estado para controlar si se hizo clic en un botón

  const handleClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormularioVisible('modificar');
    setBotonClickeado(true); // Cambiar estado al hacer clic
  };

  const mostrarFormulario = (tipo) => {
    setFormularioVisible(tipo);
    setBotonClickeado(true); // Cambiar estado al hacer clic
  };

  return (
    <>
      <Header />
      <div className={`rutina-admin-container ${botonClickeado ? 'no-margin-bottom' : ''}`}>
        <h1>Rutinas</h1>
        <div className="button-container">
          <button
            className="btn-añadir"
            onClick={() => mostrarFormulario('modificar')}
          >
            <i className="fas fa-edit"></i> Modificar
          </button>
          <button
            className="btn-modificar"
            onClick={() => mostrarFormulario('añadir')}
          >
            <i className="fas fa-plus"></i> Añadir
          </button>
        </div>

        {formularioVisible === 'modificar' && (
          <div className="form-container slide-down">
            <FormularioCliente onClienteSeleccionado={handleClienteSeleccionado} />
          </div>
        )}

        {formularioVisible === 'añadir' && (
          <div className="form-container slide-down">
            <AñadirRutina /> {/* Mostrar el formulario de añadir */}
          </div>
        )}

        {clienteSeleccionado && formularioVisible === 'modificar' && (
          <div className="ejercicios-container">
            <EjerciciosCliente cliente={clienteSeleccionado} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RutinaAdminIndex;
