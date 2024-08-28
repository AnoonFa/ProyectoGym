import React from 'react';
import './Payments.css';

function Payments({ userType, payments = [], userId }) {
    // Verifica si payments es un array y filtra los pagos si se proporciona un userId
    const filteredPayments = Array.isArray(payments)
        ? userId
            ? payments.filter(payment => payment.userId === userId)
            : payments
        : []; // Si payments no es un array, usa un array vacío

    return (
        <div className="PaymentsContainer">
            <h2>{userType === 'cliente' ? 'Pagos de Clientes' : 'Pagos de Administradores/Empleados'}</h2>
            {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, index) => (
                    <div key={index} className="PaymentItem">
                        <p><strong>ID:</strong> {payment.id}</p>
                        <p><strong>Nombre:</strong> {payment.name}</p>
                        <p><strong>Monto:</strong> {payment.amount}</p>
                        <p><strong>Fecha:</strong> {payment.date}</p>
                        <p><strong>Descripción:</strong> {payment.description}</p>
                    </div>
                ))
            ) : (
                <p>No hay pagos para mostrar.</p>
            )}
        </div>
    );
}

export default Payments;
