import React from 'react';
import './VerProductos.css';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

function VerProducto() {
  const navigate = useNavigate();

  const handleBuscarClick = () => {
    navigate('/ProductForm'); // Redirige a la página de resultados
  };

  return (
    <div className="VerProducto">
      <h2>Buscar producto</h2>
      <div className="ClienteForm">
        <div>
          <label>Nombre: </label>
          <input type="text" />
        </div>
        <div>
          <label>Precio: </label>
          <input type="text" />
        </div>
        <Button onClick={handleBuscarClick}>Buscar</Button>
      </div>
      <div className="ClienteDatabase">
        <h3>Base de datos de los productos</h3>
        <div className="ClienteLista">
          <div className="ClienteItem">
            <input type="text" readOnly value="Producto 1" />
            <Button>Modificar</Button>
          </div>
          <div className="ClienteItem">
            <input type="text" readOnly value="Producto 2" />
            <Button>Modificar</Button>
          </div>
          <div className="ClienteItem">
            <input type="text" readOnly value="Producto 3" />
            <Button>Modificar</Button>
          </div>
          <div className="ClienteItem">
            <input type="text" readOnly value="Producto 4" />
            <Button>Modificar</Button>
          </div>
        </div>
        <div className="Boton">
          <Button>Agregar Producto</Button>
        </div>
      </div>
    </div>
  );
}

export default VerProducto;
