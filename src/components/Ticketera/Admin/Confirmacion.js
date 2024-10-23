import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import '../Ticketera.css';
import Relleno from '../../Relleno/Relleno';

function AdminConfirmacion() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const ticketsPerPage = 4;

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        filterAndSortTickets();
    }, [searchTerm, tickets, sortField, sortOrder]);

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:3001/ticketera');
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const filterAndSortTickets = () => {
        let filtered = tickets;
        if (searchTerm.length > 0) {
            filtered = filtered.filter(ticket => 
                ticket.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortField) {
            filtered.sort((a, b) => {
                if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
                if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }
        setFilteredTickets(filtered);
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
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
            const ticketResponse = await fetch(`http://localhost:3001/ticketera/${ticketId}`);
            const currentTicket = await ticketResponse.json();
            const updatedTicket = { ...currentTicket, status: newStatus };

            const response = await fetch(`http://localhost:3001/ticketera/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTicket),
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

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPaginationGroup = () => {
        let start = Math.max(currentPage - 2, 1);
        let end = Math.min(start + 4, totalPages);

        if (end - start < 4) {
            start = Math.max(end - 4, 1);
        }

        return new Array(end - start + 1).fill().map((_, idx) => start + idx);
    };

    return (
        <>
            <Header />
            <Relleno/>
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
                        {currentTickets.length > 0 ? (
                            <>
                                <table className="confirmacion-table">
                                    <thead>
                                        <tr>
                                            <th className="confirmacion-table-header" onClick={() => handleSort('nombre')}>
                                                Nombre {sortField === 'nombre' && (sortOrder === 'asc' ? '▲' : '▼')}
                                            </th>
                                            <th className="confirmacion-table-header" onClick={() => handleSort('quantity')}>
                                                Cantidad {sortField === 'quantity' && (sortOrder === 'asc' ? '▲' : '▼')}
                                            </th>
                                            <th className="confirmacion-table-header" onClick={() => handleSort('totalPrice')}>
                                                Precio Total {sortField === 'totalPrice' && (sortOrder === 'asc' ? '▲' : '▼')}
                                            </th>
                                            <th className="confirmacion-table-header" onClick={() => handleSort('date')}>
                                                Fecha {sortField === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                                            </th>
                                            <th className="confirmacion-table-header" onClick={() => handleSort('time')}>
                                                Hora {sortField === 'time' && (sortOrder === 'asc' ? '▲' : '▼')}
                                            </th>
                                            <th className="confirmacion-table-header">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTickets.map((ticket) => (
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
                                <div className="pagination-ticket-admin">
                                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                        Anterior
                                    </button>
                                    {getPaginationGroup().map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={currentPage === number ? 'active' : ''}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                                        Siguiente
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="no-tickets-message">No se encuentran tickets con ese nombre</p>
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