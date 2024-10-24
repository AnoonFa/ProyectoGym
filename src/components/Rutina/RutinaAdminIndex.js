import React, { useState } from 'react';
import FormularioCliente from './FormularioCliente';
import EjerciciosCliente from './EjerciciosCliente';
import AñadirRutina from './AñadirRutina';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './RutinaAdminIndex.css';
import imageReferencia from '../../assets/images/Ejercicios/icono-del-calendario-y-reloj-104702326.jpg';
import Relleno from '../Relleno/Relleno';

const RutinaAdminIndex = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [formularioVisible, setFormularioVisible] = useState(null); // 'modificar', 'añadir' o null
  const [expansionState, setExpansionState] = useState('collapsed'); // Estado para la expansión
  const [noMargin, setNoMargin] = useState(false); // Estado para manejar el margen
  const [imagenVisible, setImagenVisible] = useState(true); // Nuevo estado para la visibilidad de la imagen

  const handleClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormularioVisible('modificar');
    setExpansionState('modificar-phase');
    setNoMargin(true); // Elimina el margen al seleccionar un cliente
    setImagenVisible(false); // Oculta la imagen al seleccionar un cliente
  };

  const mostrarFormulario = (tipo) => {
    setFormularioVisible(tipo);
    setNoMargin(true); // Elimina el margen al hacer clic en un botón
    setImagenVisible(false); // Oculta la imagen al hacer clic en un botón
    if (tipo === 'añadir') {
      setExpansionState('añadir-phase');
    } else if (tipo === 'modificar') {
      setExpansionState('modificar-phase');
    }
  };

  return (
    <>
      <Header />
      <Relleno/>
      <div className={`rutina-admin-container ${expansionState} ${noMargin ? 'no-margin-bottom' : ''}`}>
        <h1>Rutinas</h1>
        <div className="button-container-rutina">
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

        {imagenVisible && (
          <div className="Cotenedor-image">
            <img src={imageReferencia} alt="Icono de calendario y reloj" className="imagen-referencia" />
          </div>
        )}

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
