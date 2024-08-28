import React, { useEffect, useState } from 'react';
import './ProductForm.css';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

function ProductForm() {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/adminEmpleadoIndex/Productos'); // Redirige a la página de productos
  };

  useEffect(() => {
    setShowModal(true); // Mostrar el modal al cargar la página
  }, []);

  return (
    <div className="ProductForm">
      {showModal && (
        <div className="modal-background">
          <div className="modal-content">
            <div className="product-container">
              <div className="image-container">
                {/* Imagen del producto */}
                <img src="tu-imagen.jpg" alt="Imagen del producto" />
              </div>
              <div className="info-container">
                <h2>Información del producto</h2>
                <form>
                  <label>Nombre:</label>
                  <input type="text" />
                  {/* ... otros campos */}
                </form>
              </div>
            </div>
            <Button onClick={handleCloseModal}>Volver</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductForm;
