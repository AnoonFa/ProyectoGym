import express from 'express';
import cors from 'cors';
import db from './database/db.js'; // Importamos la conexión a la base de datos
import blogRoutes from './routes/routes.js'; // Importamos el enrutador de blogs
import clienteRoutes from './routes/clienteRoutes.js'; // Importamos el enrutador de clientes
import planRoutes from './routes/planRoutes.js'; // Importamos el enrutador de planes

// Inicialización de la aplicación
const app = express();

// Configuración de middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/admin', adminRoutes);// ruta para los admin
app.use('/employees', employeeRoutes); // Ruta para empleados
app.use('/blogs', blogRoutes); // Ruta para los blogs
app.use('/clients', clienteRoutes); // Ruta para los clientes
app.use('/planes', planRoutes); // Ruta para los planes
app.use('/productos', productRoutes); // Rutas para productos
app.use('/ticketera', ticketRoutes);// Rutas para tickets
app.use('/clases', classRoutes);// Rutas para clases
app.use('/inscripciones', subscriptionRoutes);// Rutas para inscripciones




// Conexión a la base de datos
try {
    await db.authenticate();
    console.log('Conexión exitosa con la base de datos');
} catch (error) {
    console.log(`El error de conexión es: ${error}`);
}

// Iniciar el servidor
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}/`);
});
