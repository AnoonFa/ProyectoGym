import React from 'react';
import Payments from '../../../components/Payments/Payments';
import Footer from '../../../components/Footer/Footer';
import Relleno from '../../../components/Relleno/Relleno';


// Datos de prueba para pagos de clientes, cada pago tiene un userId
const clientPaymentsData = [
    { id: 1, name: 'Juan', amount: '50.00', date: '2024-07-01', description: 'Pago mensual', userId: 1 },
    { id: 2, name: 'Emilio', amount: '70.00', date: '2024-08-01', description: 'Pago mensual', userId: 2 },
    { id: 3, name: 'Andre', amount: '60.00', date: '2024-09-01', description: 'Pago mensual', userId: 3 },
    // Agrega más datos de pagos de clientes aquí ya con la base de datops se llaman
];

function ClientPayments() {
    // El usuario autenticado tiene userId 1
    const currentUserId = 1;

    return (
        <div>
        <Headers />
        <Relleno/>
        <Payments userType="cliente" payments={clientPaymentsData} userId={currentUserId} />
        <Footer />
   </div>
   
    );
}

export default ClientPayments;