import React from 'react';
import Payments from '../../../components/Payments/Payments';

const adminPaymentsData = [
    { id: 1, name: 'Sebastian', amount: '1500.00', date: '2024-07-01', description: 'Pago de salario' },
    { id: 2, name: 'Esteban', amount: '1600.00', date: '2024-08-01', description: 'Pago de salario' },
    
];

function AdminPayments() {
    return (
        <Payments userType="admin" payments={adminPaymentsData} />
    );
}

export default AdminPayments;
