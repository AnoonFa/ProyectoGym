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
  const [expansionState, setExpansionState] = useState('collapsed'); // Estado para la expansión
  const [noMargin, setNoMargin] = useState(false); // Estado para manejar el margen

  const handleClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormularioVisible('modificar');
    setExpansionState('modificar-phase');
    setNoMargin(true); // Elimina el margen al seleccionar un cliente
  };

  const mostrarFormulario = (tipo) => {
    setFormularioVisible(tipo);
    setNoMargin(true); // Elimina el margen al hacer clic en un botón
    if (tipo === 'añadir') {
      setExpansionState('añadir-phase');
    } else if (tipo === 'modificar') {
      setExpansionState('modificar-phase');
    }
  };

  return (
    <>
      <Header />
      <div className={`rutina-admin-container ${expansionState} ${noMargin ? 'no-margin-bottom' : ''}`}>
        <h1>Rutinas</h1>
        <div className="button-container">
          <button
            className="btn-añadir"
            onClick={() => mostrarFormulario('añadir')}
          >
            <i className="fas fa-plus"></i> Añadir
          </button>
          <button
            className="btn-modificar"
            onClick={() => mostrarFormulario('modificar')}
          >
            <i className="fas fa-edit"></i> Modificar
          </button>
        </div>

        {formularioVisible === 'modificar' && (
          <div className="form-container-slide-down">
            <FormularioCliente onClienteSeleccionado={handleClienteSeleccionado} />
          </div>
        )}

        {formularioVisible === 'añadir' && (
          <div className="form-container-slide-down">
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
