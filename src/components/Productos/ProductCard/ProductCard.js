import React, { useContext } from 'react';
import './ProductCard.css';
import { useAuth } from '../../../context/RoleContext';
import { ProductsContext } from '../../../context/ProductsContext';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const { deleteProduct } = useContext(ProductsContext);

    const { image, name, description, price } = product;

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteProduct(product.id);  // Cambiar de product.name a product.id
    };

    return (
        <div className="product-card">
            <img src={image} alt={name} className="product-image" />
            {(user.role === 'admin' || user.role === 'employee') && (
                <i 
                    className="fas fa-trash delete-icon" 
                    title='Eliminar producto'
                    onClick={handleDelete}
                ></i>
            )}
            <div className="product-infos">
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>
                <p className="product-price">${price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
