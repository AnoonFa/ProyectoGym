import { getAdminById } from '../models/AdminModel.js';

// Controlador para obtener un administrador por ID
export const fetchAdminById = (req, res) => {
    const { id } = req.params;

    getAdminById(id, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error en el servidor', details: err });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Admin no encontrado' });
            return;
        }
        res.json(result[0]);
    });
};
