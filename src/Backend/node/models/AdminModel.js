import db from '../database/db.js';

// Función para obtener un administrador por ID
export const getAdminById = (id, callback) => {
    const query = 'SELECT * FROM admin WHERE id = ?';
    db.query(query, [id], (err, result) => {
        callback(err, result);
    });
};
