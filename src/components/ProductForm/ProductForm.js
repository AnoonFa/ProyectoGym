import React, { useState, useEffect, useContext } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { ProductsContext } from '../../context/ProductsContext';
import { useAuth } from '../../context/RoleContext';
import './ProductForm.css';

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
    const { addProduct } = useContext(ProductsContext);
    const { user } = useAuth();
    const [productData, setProductData] = useState({
        name: initialProduct?.name || '',
        description: initialProduct?.description || '',
        price: initialProduct?.price || '',
        image: initialProduct?.image || '',
        category: initialProduct?.category || '',
    });

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        setProductData({
            name: initialProduct?.name || '',
            description: initialProduct?.description || '',
            price: initialProduct?.price || '',
            image: initialProduct?.image || '',
            category: initialProduct?.category || '',
        });
    }, [initialProduct]);

    const validateField = (field, value) => {
        const newErrors = { ...errors };

        switch (field) {
            case 'name':
                if (!value || value.length < 3 || value.length > 50) {
                    newErrors.name = 'El nombre debe tener entre 3 y 50 caracteres.';
                } else {
                    delete newErrors.name;
                }
                break;
            case 'price':
                if (isNaN(value) || parseFloat(value) <= 0) {
                    newErrors.price = 'El precio debe ser un número mayor a 0.';
                } else {
                    delete newErrors.price;
                }
                break;
            case 'description':
                if (!value || value.length < 20 || value.length > 200) {
                    newErrors.description = 'La descripción debe tener entre 20 y 200 caracteres.';
                } else {
                    delete newErrors.description;
                }
                break;
            case 'category':
                if (!value) {
                    newErrors.category = 'Debes seleccionar una categoría.';
                } else {
                    delete newErrors.category;
                }
                break;
            case 'image':
                if (!value || !value.startsWith('http')) {
                    newErrors.image = 'Debes proporcionar una URL válida de la imagen.';
                } else {
                    delete newErrors.image;
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
        validateField(name, value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    
      if (Object.keys(errors).length === 0 && productData.name && productData.price && productData.description && productData.category && productData.image) {
        const updatedProduct = {
          ...initialProduct,
          ...productData,
        };
    
        // Asegúrate de que `onSubmit` esté haciendo correctamente la llamada a la API
        fetch('http://localhost:3001/products', {
          method: initialProduct?.id ? 'PUT' : 'POST',  // Si el producto existe, usa PUT, de lo contrario POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al agregar el producto a la API');
          }
          return response.json();
        })
        .then((data) => {
          onSubmit(data); // Esto llamará la función `onSubmit` pasada como prop
          showAlertWithTimeout('success', 'Producto guardado exitosamente.');
        })
        .catch((error) => {
          showAlertWithTimeout('error', `Error en el servidor: ${error.message}`);
          console.error('Error al agregar el producto:', error);
        });
      } else {
        showAlertWithTimeout('error', 'Error en el formulario, revisa los campos.');
      }
    };

    const showAlertWithTimeout = (type, message, timeout = 5000) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setAlertType(type);
        setAlertMessage(message);
        setShowAlert(true);

        const id = setTimeout(() => {
            setShowAlert(false);
            setAlertType(null);
            setAlertMessage('');
        }, timeout);

        setTimeoutId(id);
    };

    const handleCancel = () => {
      setShowForm(false); // O cualquier otra lógica para cerrar el modal

    };

    if (user.role !== 'admin') {
        return null;
    }

    return (
        <div className="modal-producto-container">
            <div className="modal-producto-content">
                <form onSubmit={handleSubmit} className="modify-product-form-modal">
                    <h2 className="form-title-modal">Modificar Producto</h2>

                    <div className="form-field-modal field-row-modal">
                        <div className="field-half-modal">
                            <label className="form-product-modal">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={productData.name}
                                onChange={handleChange}
                                required
                                className="product-input-field-modal"
                                maxLength="50"
                                minLength="3"
                                autoFocus
                            />
                            {errors.name && (
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="error">{errors.name}</Alert>
                                </Stack>
                            )}
                        </div>
                    </div>

                    <div className="form-field-modal field-row-modal">
                        <div className="field-half-modal">
                            <label className="form-product-modal">Precio</label>
                            <input
                                type="number"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                required
                                className="product-input-field-modal"
                                min="0"
                            />
                            {errors.price && (
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="error">{errors.price}</Alert>
                                </Stack>
                            )}
                        </div>
                    </div>

                    <div className="form-field-modal">
                        <label className="form-product-modal">Descripción</label>
                        <textarea
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            required
                            className="product-input-field-modal descripcion-field-modal"
                            maxLength="200"
                            minLength="20"
                        />
                        <div className="char-counter-modal">{productData.description.length}/200</div>
                        {errors.description && (
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Alert severity="error">{errors.description}</Alert>
                            </Stack>
                        )}
                    </div>

                    <div className="form-field-modal">
                        <label className="form-product-modal">URL de la imagen</label>
                        <input
                            type="text"
                            name="image"
                            value={productData.image}
                            onChange={handleChange}
                            required
                            className="product-input-field-modal"
                        />
                        {errors.image && (
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Alert severity="error">{errors.image}</Alert>
                            </Stack>
                        )}
                    </div>

                    <div className="form-field-modal">
                        <label className="form-product-modal">Categoría</label>
                        <select
                            name="category"
                            value={productData.category}
                            onChange={handleChange}
                            required
                            className="product-input-field-modal"
                        >
                            <option value="" disabled>
                                Selecciona una categoría
                            </option>
                            <option value="ropa deportiva mujer">Ropa Deportiva Mujer</option>
                            <option value="ropa deportiva hombre">Ropa Deportiva Hombre</option>
                            <option value="alimentos">Alimentos</option>
                            <option value="bebidas">Bebidas</option>
                            <option value="accesorios">Accesorios</option>
                            <option value="suplementos">Suplementos</option>
                        </select>
                        {errors.category && (
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Alert severity="error">{errors.category}</Alert>
                            </Stack>
                        )}
                    </div>

                    <div className="form-button-modal">
                        <button type="button" className="product-button-l-modal" onClick={handleCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className="product-button-modal">
                            Guardar Cambios
                        </button>
                    </div>

                    {showAlert && alertType && (
                        <Stack sx={{ width: '100%', marginTop: 2 }} spacing={2}>
                            <Alert variant="filled" severity={alertType}>
                                {alertMessage}
                            </Alert>
                        </Stack>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
