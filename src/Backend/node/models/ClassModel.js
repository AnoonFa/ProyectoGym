const db = require('../config/db');

// Obtener las inscripciones de un cliente
const getSubscriptionsByClientId = (clientId) => {
    const query = `
        SELECT i.*, c.nombre as nombreClase, c.fecha, c.startTime, c.endTime, c.entrenador 
        FROM inscripciones i 
        JOIN clases c ON i.claseId = c.id 
        WHERE i.clientId = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [clientId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Crear inscripción
const createSubscription = (subscription) => {
    const query = 'INSERT INTO inscripciones SET ?';
    return new Promise((resolve, reject) => {
        db.query(query, subscription, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Actualizar el estado de una inscripción
const updateSubscriptionStatus = (id, estadoPago) => {
    const query = 'UPDATE inscripciones SET estadoPago = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [estadoPago, id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Eliminar una inscripción
const deleteSubscription = (id) => {
    const query = 'DELETE FROM inscripciones WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    getSubscriptionsByClientId,
    createSubscription,
    updateSubscriptionStatus,
    deleteSubscription
};
