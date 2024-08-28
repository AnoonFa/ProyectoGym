import React, { useState, useContext } from 'react';
import { ProductsContext } from '../../context/ProductsContext';
import { useAuth } from '../../context/RoleContext';
import Button from '../Button/Button';
import './ProductForm.css';

const ProductForm = () => {
    const { addProduct } = useContext(ProductsContext);
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);

    const [product, setProduct] = useState({
      name: '',
      description: '',
      price: '',
      image: '',
      category: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addProduct(product);
      setProduct({ name: '', description: '', price: '', image: '', category: '' });
      setShowForm(false);
    };

    if (user.role === 'client') {
      return null;
    }

    return (
      <div className="product-form-container">
        {user.role === 'admin' && (
        <div className="Button-Ver-Añadir" style={{ marginTop: '20px' }}>
          <Button onClick={() => setShowForm(!showForm)} variant="add">
            {showForm ? 'Cancelar' : 'Añadir Producto'}
          </Button>
        </div>)} 
        {showForm && (
          <form className="product-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre del producto"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Descripción"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Precio"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="URL de la imagen"
              value={product.image}
              onChange={(e) => setProduct({ ...product, image: e.target.value })}
              required
            />
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              required
            >
              <option value="" disabled>Seleccione categoría</option>
              <option value="ropa deportiva mujer">Ropa Deportiva Mujer</option>
              <option value="ropa deportiva hombre">Ropa Deportiva Hombre</option>
              <option value="alimentos">Alimentos</option>
              <option value="bebidas">Bebidas</option>
              <option value="accesorios">Accesorios</option>
              <option value="suplementos">Suplementos</option>
            </select>
            <Button variant="add">Agregar Producto</Button>
          </form>
        )}
      </div>
    );
};

export default ProductForm;
