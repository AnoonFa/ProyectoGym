const ticketModel = require('../models/ticketModel');

// Obtener todos los tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketModel.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error al obtener los tickets:', error);
        res.status(500).json({ error: 'Error al obtener los tickets' });
    }
};

// Obtener un ticket específico
const getTicketById = async (req, res) => {
    const { id } = req.params;
    try {
        const ticket = await ticketModel.getTicketById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error al obtener el ticket:', error);
        res.status(500).json({ error: 'Error al obtener el ticket' });
    }
};

// Obtener tickets por cliente
const getTicketsByClientId = async (req, res) => {
    const { clientId } = req.params;
    try {
        const tickets = await ticketModel.getTicketsByClientId(clientId);
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error al obtener tickets del cliente:', error);
        res.status(500).json({ error: 'Error al obtener los tickets' });
    }
};

// Crear un nuevo ticket
const createTicket = async (req, res) => {
    const { clientId, nombre, quantity, totalPrice, status } = req.body;

    if (!clientId || !nombre || !quantity || !totalPrice) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const ticket = {
        id: Math.random().toString(36).substring(2, 12),
        clientId,
        nombre,
        quantity,
        totalPrice,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        status,
    };

    try {
        await ticketModel.createTicket(ticket);
        res.status(201).json({ message: 'Ticket creado exitosamente', ticketId: ticket.id });
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        res.status(500).json({ error: 'Error al crear el ticket' });
    }
};

// Actualizar el estado de un ticket
const updateTicketStatus = async (req, res) => {
    const { ticketId, newStatus } = req.body;

    if (!ticketId || !newStatus) {
        return res.status(400).json({ error: 'Datos faltantes' });
    }

    try {
        await ticketModel.updateTicketStatus(ticketId, newStatus);
        res.status(200).json({ message: 'Estado del ticket actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el estado del ticket:', error);
        res.status(500).json({ error: 'Error al actualizar el ticket' });
    }
};

module.exports = {
    getAllTickets,
    getTicketById,
    getTicketsByClientId,
    createTicket,
    updateTicketStatus,
};
