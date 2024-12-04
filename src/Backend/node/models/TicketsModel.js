const db = require('../config/db'); // Asegúrate de configurar correctamente tu conexión a MySQL

// Obtener todos los tickets
const getAllTickets = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM ticketera ORDER BY date DESC, time DESC';
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Obtener un ticket por ID
const getTicketById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM ticketera WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

// Obtener tickets por cliente
const getTicketsByClientId = (clientId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM ticketera WHERE clientId = ?';
        db.query(query, [clientId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Crear un nuevo ticket
const createTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO ticketera (id, clientId, nombre, quantity, totalPrice, date, time, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            ticket.id,
            ticket.clientId,
            ticket.nombre,
            ticket.quantity,
            ticket.totalPrice,
            ticket.date,
            ticket.time,
            ticket.status || 'No Pagado',
        ];
        db.query(query, values, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Actualizar el estado de un ticket
const updateTicketStatus = (ticketId, newStatus) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE ticketera SET status = ? WHERE id = ?';
        db.query(query, [newStatus, ticketId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    getAllTickets,
    getTicketById,
    getTicketsByClientId,
    createTicket,
    updateTicketStatus,
};
