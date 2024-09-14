import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import '../Ticketera.css';

function AdminConfirmacion() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filtered = tickets.filter(ticket => 
                ticket.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTickets(filtered);
        } else {
            setFilteredTickets(tickets.slice(0, 4));
        }
    }, [searchTerm, tickets]);

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:3001/ticketera');
            const data = await response.json();
            setTickets(data);
            setFilteredTickets(data.slice(0, 4));
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        if (newStatus === 'Pagado') {
            setSelectedTicket(tickets.find(ticket => ticket.id === ticketId));
            setOpenModal(true);
        } else {
            await updateTicketStatus(ticketId, newStatus);
        }
    };

    const updateTicketStatus = async (ticketId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/ticketera/${ticketId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                fetchTickets();
            } else {
                console.error('Error al actualizar el estado del ticket');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleConfirmPayment = async () => {
        if (selectedTicket) {
            await updateTicketStatus(selectedTicket.id, 'Pagado');
            await updateClientTickets(selectedTicket);
            await deleteTicket(selectedTicket.id);
            setOpenModal(false);
            fetchTickets();
        }
    };

    const updateClientTickets = async (ticket) => {
        try {
            const clientResponse = await fetch(`http://localhost:3001/client/${ticket.clientId}`);
            const clientData = await clientResponse.json();
            const updatedTickets = clientData.tickets + ticket.quantity;

            const updateResponse = await fetch(`http://localhost:3001/client/${ticket.clientId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tickets: updatedTickets }),
            });

            if (!updateResponse.ok) {
                console.error('Error al actualizar los tickets del cliente');
            }
        } catch (error) {
            console.error('Error al actualizar los tickets del cliente:', error);
        }
    };

    const deleteTicket = async (ticketId) => {
        try {
            const response = await fetch(`http://localhost:3001/ticketera/${ticketId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Ticket eliminado correctamente');
            } else {
                console.error('Error al eliminar el ticket');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="confirmacion-container">
                <div className="confirmacion-content">
                    <div className="confirmacion-form-section">
                        <h2 className="confirmacion-title">Verificación de compra de Tickets</h2>
                        <div className="confirmacion-input-group">
                            <label htmlFor="name" className="confirmacion-label">Nombre y apellido</label>
                            <div className="confirmacion-input-container">
                                <input 
                                    id="name" 
                                    placeholder="Ingrese nombre y apellido" 
                                    className="confirmacion-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="confirmacion-table-container">
                        {filteredTickets.length > 0 ? (
                            <table className="confirmacion-table">
                                <thead>
                                    <tr>
                                        <th className="confirmacion-table-header">Nombre</th>
                                        <th className="confirmacion-table-header">Cantidad</th>
                                        <th className="confirmacion-table-header">Precio Total</th>
                                        <th className="confirmacion-table-header">Fecha</th>
                                        <th className="confirmacion-table-header">Hora</th>
                                        <th className="confirmacion-table-header">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td className="confirmacion-table-cell">{ticket.nombre}</td>
                                            <td className="confirmacion-table-cell">{ticket.quantity}</td>
                                            <td className="confirmacion-table-cell">${ticket.totalPrice}</td>
                                            <td className="confirmacion-table-cell">{ticket.date}</td>
                                            <td className="confirmacion-table-cell">{ticket.time}</td>
                                            <td className="confirmacion-table-cell">
                                                <select 
                                                    value={ticket.status} 
                                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                                    className="confirmacion-select"
                                                >
                                                    <option value="No Pagado">No Pagado</option>
                                                    <option value="Pagado">Pagado</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-tickets-message">No hay tickets que mostrar</p>
                        )}
                    </div>
                </div>
            </div>

            {openModal && selectedTicket && (
                <div className="modal-Ticket">
                    <div className="modal-content-Ticket">
                        <h2>Confirmación de Pago</h2>
                        <p>
                            ¿Estás seguro que {selectedTicket.nombre} pagó los tickets 
                            por el precio total de ${selectedTicket.totalPrice}?
                        </p>
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={() => setOpenModal(false)}>Cancelar</button>
                            <button className="confirm-button" onClick={handleConfirmPayment}>Confirmar Pago</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default AdminConfirmacion;