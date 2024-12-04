import ProductModel from "../models/ProductModel.js";
import AdminModel from "../models/AdminModel.js"; // Modelo de Admin para las relaciones

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, createdBy } = req.body;

        // Validar campos requeridos
        if (!name || !description || !price || !image || !category || !createdBy) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo el ID del admin' });
        }

        const newProduct = await ProductModel.create({
            name, description, price, image, category, createdBy
        });

        // Devolver el producto recién creado
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto', details: error.message });
    }
};

// Obtener todos los productos con información del admin
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.findAll({
            include: [{
                model: AdminModel,
                as: 'admin',
                attributes: ['usuario', 'correo']
            }]
        });

        // Formatear resultados
        const formattedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            image: product.image,
            category: product.category,
            createdBy: {
                id: product.createdBy,
                name: product.admin?.usuario || null,
                email: product.admin?.correo || null
            }
        }));

        res.status(200).json(formattedProducts);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
    }
};

// Eliminar un producto por ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si se encontró el producto
        const deleted = await ProductModel.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente', productId: id });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
    }
};
