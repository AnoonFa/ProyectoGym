const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { Sequelize, DataTypes } = require('sequelize');
const nodemailer = require('nodemailer');

/* 
   Despliegue
   const url = require('url')
   
   Obtener la URL de la base de datos desde la variable de entorno de Heroku
   const dbUrl = process.env.JAWSDB_URL
   Si JAWSDB_URL está disponible (en Heroku), usaremos esa conexión
   Parsear la URL para extraer la información de conexión
   const dbParams = url.parse(dbUrl);
   const [username, password] = dbParams.auth.split(':');
   const dbName = dbParams.pathname.split('/')[1];
   const dbHost = dbParams.hostname;
   const dbPort = dbParams.port;
   mysql://vmdlgmcmgh7azdmh:a6apzim09v1v7ca1@wvulqmhjj9tbtc1w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/vcmdb0gjowzzxrc

   Configurar la conexión con los parámetros extraídos
   const db = mysql.createConnection({
       host: dbHost,
       user: username,
       password: password,
       database: dbName,
       port: dbPort || 3306 // Si no se especifica el puerto, usamos el puerto por defecto (3306)
   });

   db.query('SELECT 1 + 1 AS result', (err, results) => {
       if (err) {
           console.error('Error al hacer la consulta:', err);
       } else {
           console.log('Resultado de la consulta:', results);
       }
   });
   
   
   app.listen(PORT, () => {
       console.log(`Servidor escuchando en el puerto ${PORT}`);
   });

*/

const app = express();
const PORT = process.env.PORT || 3005;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de Sequelize
const sequelize = new Sequelize('ProyectoGym', 'root', '', {
    host: 'localhost', // Dirección de tu servidor MySQL
    dialect: 'mysql',  // Dialecto que utiliza Sequelize
    port: 3306,        // Puerto personalizado de tu servidor MySQL
  });

// Verificar conexión con Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente con la base de datos.');
  })
  .catch((error) => {
    console.error('Error al conectarse a la base de datos:', error);
  });

// Conexión directa con MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ProyectoGym',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectarse a la base de datos con MySQL2:', err);
        return;
    }
    console.log('Conexión exitosa a MySQL con MySQL2');
});

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true })
    .then(() => console.log('Modelos sincronizados con la base de datos'))
    .catch((err) => console.error('Error al sincronizar modelos:', err));

// Rutas

// Verificar funcionamiento del servidor
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

// Exportar la instancia para usar en otros módulos
module.exports = sequelize;

// Definición de modelos con Sequelize
const PlanModel = sequelize.define('planes', {
    id: { type: DataTypes.STRING(10), primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING },
    duration: { type: DataTypes.INTEGER },
    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },
    benefits: { type: DataTypes.TEXT },
});

const ClienteModel = sequelize.define('client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(20) },
    apellido: { type: DataTypes.STRING(20) },
    tipoDocumento: { type: DataTypes.STRING(3) },
    numeroDocumento: { type: DataTypes.STRING(20) },
    sexo: { type: DataTypes.STRING(10) },
    tipoCuerpo: { type: DataTypes.STRING(20) },
    peso: { type: DataTypes.INTEGER },
    altura: { type: DataTypes.INTEGER },
    usuario: { type: DataTypes.STRING(40) },
    password: { type: DataTypes.STRING(40) },
    correo: { type: DataTypes.STRING(40) },
    telefono: { type: DataTypes.STRING(10) },
    rutinas: { type: DataTypes.TEXT },
    tickets: { type: DataTypes.INTEGER },
    fechaCreacion: { type: DataTypes.DATE },
    horaCreacion: { type: DataTypes.TIME },
    habilitado: { type: DataTypes.BOOLEAN },
    planes: { type: DataTypes.TEXT },
});


// Configurar el transporte de correo usando Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gimnasiodavidgoliat@gmail.com', // Tu correo de Gmail
        pass: 'ukjx ekbv frpr dvna', // Tu contraseña de Gmail o App Password
    },
});
// Ruta para resetear contraseña
app.post('/reset-password', async (req, res) => {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({ message: 'Correo es requerido' });
    }

    try {
        // Buscar cliente en la base de datos por correo
        const query = 'SELECT id, nombre, correo FROM client WHERE correo = ?';
        db.query(query, [correo], async (err, result) => {
            if (err) {
                console.error('Error al buscar cliente:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const cliente = result[0];
            const resetLink = `http://localhost:3000/restablecer-contraseña/${cliente.id}`;

            // Configurar el correo
            const mailOptions = {
                from: 'gimnasiodavidgoliat@gmail.com',
                to: cliente.correo,
                subject: 'Restablecer Contraseña',
                html: `
                    <p>Hola ${cliente.nombre},</p>
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="${resetLink}">${resetLink}</a>
                `,
            };

            // Enviar el correo con Nodemailer
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    return res.status(500).json({ message: 'Error al enviar el correo' });
                }
                res.json({ message: 'Correo enviado exitosamente.' });
            });
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});


// Ruta para restablecer la contraseña
app.post('/restablecer-contrasena/:id', async (req, res) => {
    const { id } = req.params;  // Aquí recibimos el ID desde la URL
    const { password } = req.body;  // La nueva contraseña llega en el cuerpo de la solicitud

    try {
        const query = 'SELECT * FROM client WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error al buscar cliente:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const updateQuery = 'UPDATE client SET password = ? WHERE id = ?';
            db.query(updateQuery, [password, id], (err, updateResult) => {
                if (err) {
                    console.error('Error al actualizar la contraseña:', err);
                    return res.status(500).json({ message: 'Error al actualizar la contraseña' });
                }

                res.status(200).json({ message: 'Contraseña restablecida con éxito' });
            });
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});


// Obtener datos de un plan
app.get('/planes/:id', async (req, res) => {
    try {
        const plan = await PlanModel.findByPk(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el plan', error: err });
    }
});

// Actualizar fecha de expiración de un plan
app.patch('/planes/:id', async (req, res) => {
    try {
        const { endDate } = req.body;
        const [updated] = await PlanModel.update({ endDate }, { where: { id: req.params.id } });
        if (!updated) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }
        res.json({ message: 'Fecha de expiración actualizada exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el plan', error: err });
    }
});

// Verificar si un cliente tiene un plan activo
app.get('/client/:id/activePlan', async (req, res) => {
    try {
        const cliente = await ClienteModel.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        const planes = cliente.planes ? JSON.parse(cliente.planes) : [];
        const activePlan = planes.find((plan) => new Date(plan.endDate) > new Date());
        res.json({ hasActivePlan: !!activePlan });
    } catch (err) {
        res.status(500).json({ message: 'Error al verificar el plan activo', error: err });
    }
});

// Añadir un plan a un cliente
app.post('/client/:id/planes', async (req, res) => {
    try {
        const cliente = await ClienteModel.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        const planesActuales = cliente.planes ? JSON.parse(cliente.planes) : [];
        planesActuales.push(req.body);

        await ClienteModel.update(
            { planes: JSON.stringify(planesActuales) },
            { where: { id: req.params.id } }
        );

        res.json({ message: 'Plan añadido exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al añadir el plan', error: err });
    }
});

// Ruta modificada para obtener clientes con filtro opcional por número de documento
app.get('/client', (req, res) => {
    const { numeroDocumento } = req.query;
    let query = 'SELECT * FROM client';
    let queryParams = [];

    if (numeroDocumento) {
        query += ' WHERE numeroDocumento = ?';
        queryParams.push(numeroDocumento);
    }

    db.query(query, queryParams, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(result);
    });
});

// Ruta para obtener cliente por correo
app.get('/client', (req, res) => {
    const { correo } = req.query;  // Ahora buscamos por 'correo'
    let query = 'SELECT * FROM client';
    let queryParams = [];

    if (correo) {
        query += ' WHERE correo = ?';  // Buscamos por el campo 'correo'
        queryParams.push(correo);
    }

    db.query(query, queryParams, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(result);
    });
});


// Ruta para obtener un cliente específico por ID
app.get('/client/:id', (req, res) => {
    const { id } = req.params; // Get the client ID from the request parameters

    const query = `
        SELECT id, nombre, apellido, tipoDocumento, numeroDocumento, sexo, 
               tipoCuerpo, peso, altura, usuario, password, correo, telefono, 
               rutinas, tickets, fechaCreacion, horaCreacion, habilitado
        FROM client 
        WHERE id = ?`; // SQL query to select all necessary fields, filtered by ID

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching client details:', err);
            res.status(500).json({ error: 'Error fetching client details' });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: 'Client not found' });
            return;
        }

        res.json(result[0]); // Send the client's data as JSON
    });
});

// Ruta para obtener empleados
app.get('/employee', (req, res) => {
    const query = 'SELECT * FROM employee';
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error al consultar los empleados:', err);
        res.status(500).json({ error: err });
        return;
      }
      res.json(result);
    });
  });
  

// Ruta para obtener todos los clientes
app.get('/client', (req, res) => {
    const { numeroDocumento, correo } = req.query;
    let query = 'SELECT * FROM client WHERE 1=1';  // Always true condition to append other conditions
    let queryParams = [];

    if (numeroDocumento) {
        query += ' AND numeroDocumento = ?';
        queryParams.push(numeroDocumento);
    }

    if (correo) {
        query += ' AND correo = ?';
        queryParams.push(correo);
    }

    db.query(query, queryParams, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(result);
    });
});

// Ruta para crear nuevo cliente
app.post('/client', (req, res) => {
    const {
        nombre, apellido, tipoDocumento, numeroDocumento, 
        sexo, peso, altura, usuario, password, correo, 
        telefono
    } = req.body;

    const fechaCreacion = new Date().toISOString().split('T')[0];
    const horaCreacion = new Date().toTimeString().split(' ')[0];

    const query = `
        INSERT INTO client (
            nombre, apellido, tipoDocumento, numeroDocumento, 
            sexo, peso, altura, usuario, password, 
            correo, telefono, tickets, fechaCreacion, 
            horaCreacion, habilitado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        nombre, apellido, tipoDocumento, numeroDocumento,
        sexo, peso || null, altura || null, usuario,
        password, correo, telefono || null, 0,
        fechaCreacion, horaCreacion, true
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar cliente:', err);
            res.status(500).json({ error: 'Error al crear el cliente', details: err });
            return;
        }
        res.status(201).json({ 
            message: 'Cliente creado exitosamente',
            clientId: result.insertId 
        });
    });
});

app.post('/login', (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        return;
    }

    // Lista de roles que se van a verificar
    const roles = ['admin', 'client', 'employee'];
    let foundUser = null;

    const checkUserInRole = (role, callback) => {
        const query = `SELECT * FROM ${role} WHERE correo = ?`;
        db.query(query, [correo], (err, results) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return callback(err);
            }
            if (results.length > 0 && results[0].password === password) {
                // Comprobar si el usuario está habilitado
                    // Comprobar si el usuario está habilitado (1 para habilitado, 0 para deshabilitado)
                    if (results[0].habilitado === 0) {
                        return callback(null, { habilitado: false });
                    }

                foundUser = {
                    role,
                    id: results[0].id,
                    username: results[0].usuario,
                    correo: results[0].correo,
                    nombre: results[0].nombre || null,  // Para clientes y empleados
                    apellido: results[0].apellido || null, // Para clientes y empleados
                    tickets: results[0].tickets || 0,
                    habilitado: results[0].habilitado !== false
                };
                return callback(null, foundUser);
            }
            callback(null, null);
        });
    };

    // Itera sobre los roles y encuentra el usuario
    const checkAllRoles = (index) => {
        if (index >= roles.length) {
            if (foundUser) {
                res.status(200).json(foundUser);
            } else {
                res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }
            return;
        }
        checkUserInRole(roles[index], (err, user) => {
            if (err) {
                res.status(500).json({ error: 'Error en el servidor' });
            } else if (user) {
                if (user.habilitado === false) {
                    res.status(401).json({ error: 'Usuario deshabilitado' });
                } else {
                    res.status(200).json(user);
                }
            } else {
                checkAllRoles(index + 1);
            }
        });
    };

    checkAllRoles(0); // Comienza con el primer rol en la lista
});


app.get('/planes/:planId', (req, res) => {
    const { planId } = req.params;
    
    const sqlQuery = 'SELECT * FROM planes WHERE id = ?';
    
    db.query(sqlQuery, [planId], (err, result) => {
        if (err) {
            console.error('Error al obtener el plan:', err);
            res.status(500).json({ error: 'Error al obtener los datos del plan', details: err });
            return;
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ error: 'Plan no encontrado' });
        }
    });
});



// Ruta para verificar usuario existente
app.get('/check-user', (req, res) => {
    const { usuario } = req.query;
    const query = 'SELECT id FROM client WHERE usuario = ?';
    
    db.query(query, [usuario], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json({ exists: result.length > 0 });
    });
});

// Agregar esta nueva ruta para actualizar cliente
app.put('/client/:id', (req, res) => {
    const { id } = req.params;
    const { tipoCuerpo, rutinas } = req.body;

    const query = `
        UPDATE client 
        SET tipoCuerpo = ?, 
            rutinas = ?
        WHERE id = ?
    `;

    db.query(query, [tipoCuerpo, rutinas, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar cliente:', err);
            res.status(500).json({ 
                error: 'Error al actualizar el cliente', 
                details: err 
            });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ 
                message: 'Cliente no encontrado' 
            });
            return;
        }

        res.json({ 
            message: 'Cliente actualizado exitosamente',
            affectedRows: result.affectedRows
        });
    });
});


// Obtener todos los tickets (ordenados por fecha y hora)
app.get('/ticketera', (req, res) => {
    const query = 'SELECT * FROM ticketera ORDER BY date DESC, time DESC';
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(result);
    });
});

// Obtener un ticket específico
app.get('/ticketera/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM ticketera WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Ticket no encontrado' });
            return;
        }
        res.json(result[0]);
    });
});

// Obtener tickets por cliente
app.get('/ticketera/client/:clientId', (req, res) => {
    const { clientId } = req.params;
    const query = 'SELECT * FROM ticketera WHERE clientId = ?';
    
    db.query(query, [clientId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        res.json(result);
    });
});

// Crear nuevo ticket
app.post('/ticketera', (req, res) => {
    const {
        clientId,
        nombre,
        quantity,
        totalPrice,
        status
    } = req.body;

    // Generar un ID único de 10 caracteres
    const id = Math.random().toString(36).substring(2, 12);
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0];

    const query = `
        INSERT INTO ticketera (
            id, clientId, nombre, quantity, totalPrice,
            date, time, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id, clientId, nombre, quantity, totalPrice,
        date, time, status || 'No Pagado'
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al crear ticket:', err);
            res.status(500).json({ error: 'Error al crear el ticket', details: err });
            return;
        }
        res.status(201).json({ 
            message: 'Ticket creado exitosamente',
            ticketId: id
        });
    });
});

// Ruta para verificar y actualizar el estado de un ticket
app.post('/verify-ticket', async (req, res) => {
    const { ticketId, newStatus } = req.body;

    db.beginTransaction(async (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al iniciar la transacción',
                error: err
            });
        }

        try {
            // 1. Obtener información del ticket
            const getTicketQuery = 'SELECT * FROM ticketera WHERE id = ?';
            db.query(getTicketQuery, [ticketId], (err, ticketResult) => {
                if (err || ticketResult.length === 0) {
                    db.rollback();
                    return res.status(404).json({
                        success: false,
                        message: 'Ticket no encontrado'
                    });
                }

                const ticket = ticketResult[0];

                // Verificar si el ticket ya está pagado
                if (ticket.status === 'Pagado') {
                    db.rollback();
                    return res.status(400).json({
                        success: false,
                        message: 'No se puede modificar un ticket que ya está pagado'
                    });
                }

                // 2. Verificar si se deben actualizar los tickets del cliente
                const shouldUpdateClientTickets = newStatus === 'Pagado' && ticket.status !== 'Pagado';

                // 3. Actualizar el estado del ticket
                const updateTicketQuery = 'UPDATE ticketera SET status = ? WHERE id = ?';
                db.query(updateTicketQuery, [newStatus, ticketId], (err) => {
                    if (err) {
                        db.rollback();
                        return res.status(500).json({
                            success: false,
                            message: 'Error al actualizar el ticket',
                            error: err
                        });
                    }

                    // Si se debe actualizar los tickets del cliente
                    if (shouldUpdateClientTickets) {
                        const updateClientQuery = `
                            UPDATE client 
                            SET tickets = tickets + ? 
                            WHERE id = ?
                        `;
                        
                        db.query(updateClientQuery, [ticket.quantity, ticket.clientId], (err) => {
                            if (err) {
                                db.rollback();
                                return res.status(500).json({
                                    success: false,
                                    message: 'Error al actualizar los tickets del cliente',
                                    error: err
                                });
                            }

                            // Commit de la transacción si todo sale bien
                            db.commit((err) => {
                                if (err) {
                                    db.rollback();
                                    return res.status(500).json({
                                        success: false,
                                        message: 'Error al finalizar la transacción',
                                        error: err
                                    });
                                }

                                res.json({
                                    success: true,
                                    message: 'Ticket verificado y actualizado correctamente',
                                    ticketInfo: {
                                        id: ticket.id,
                                        clientId: ticket.clientId,
                                        quantity: ticket.quantity,
                                        newStatus: newStatus,
                                        updateDate: new Date()
                                    }
                                });
                            });
                        });
                    } else {
                        // Commit si el estado solo se actualiza sin sumar tickets
                        db.commit((err) => {
                            if (err) {
                                db.rollback();
                                return res.status(500).json({
                                    success: false,
                                    message: 'Error al finalizar la transacción',
                                    error: err
                                });
                            }

                            res.json({
                                success: true,
                                message: 'Estado del ticket actualizado correctamente',
                                ticketInfo: {
                                    id: ticket.id,
                                    newStatus: newStatus,
                                    updateDate: new Date()
                                }
                            });
                        });
                    }
                });
            });
        } catch (error) {
            db.rollback();
            res.status(500).json({
                success: false,
                message: 'Error en el proceso de verificación',
                error: error
            });
        }
    });
});

// Actualizar cliente (tickets y password)
app.patch('/client/:id', (req, res) => {
    const { id } = req.params;
    const { tickets, password } = req.body;
    
    let query = 'UPDATE client SET';
    const queryParams = [];
    
    if (tickets !== undefined) {
        query += ' tickets = ?';
        queryParams.push(tickets);
    }
    
    if (password !== undefined) {
        if (tickets !== undefined) query += ',';
        query += ' password = ?';
        queryParams.push(password);
    }
    
    query += ' WHERE id = ?';
    queryParams.push(id);

    db.query(query, queryParams, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }
        res.json({ 
            message: 'Cliente actualizado exitosamente',
            affectedRows: result.affectedRows
        });
    });
});

// Obtener admin por ID
app.get('/admin/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM admin WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Admin no encontrado' });
            return;
        }
        res.json(result[0]);
    });
});




// obtener clases
app.get('/clases', (req, res) => {
    const { nombre } = req.query;

    let query = "SELECT * FROM clases";
    const params = [];

    if (nombre) {
        query += " WHERE nombre = ?";
        params.push(nombre.trim());
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al obtener clases:', err);
            res.status(500).json({ error: 'Error al obtener clases' });
            return;
        }
        res.json(results);
    });
});

  
// obtener empleados
app.get('/empleados', (req, res) => {
    const query = "SELECT id, name FROM employee";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener empleados:', err);
            res.status(500).json({ error: 'Error al obtener empleados' });
            return;
        }
        res.json(results);
    });
});

// Validar horario del gimnasio
const validarHorarioGimnasio = (fecha, horaInicio, horaFin) => {
    const dia = new Date(fecha).getDay();
    
    const [inicioHora, inicioMin] = horaInicio.split(':').map(Number);
    const [finHora, finMin] = horaFin.split(':').map(Number);
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const finMinutos = finHora * 60 + finMin;

    const horarios = {
        semana: { inicio: 6 * 60, fin: 16 * 60 },
        sabado: { inicio: 8 * 60, fin: 16 * 60 },
        domingo: { inicio: 6 * 60, fin: 12 * 60 }
    };

    if (dia === 0) {
        return inicioMinutos >= horarios.domingo.inicio && finMinutos <= horarios.domingo.fin;
    } else if (dia === 6) {
        return inicioMinutos >= horarios.sabado.inicio && finMinutos <= horarios.sabado.fin;
    } else {
        return inicioMinutos >= horarios.semana.inicio && finMinutos <= horarios.semana.fin;
    }
};

// Crear nueva clase
app.post('/clases', (req, res) => {
    const { nombre, entrenador, startTime, endTime, descripcion, totalCupos, fecha, precio } = req.body;

    const [inicioHora, inicioMin] = startTime.split(':').map(Number);
    const [finHora, finMin] = endTime.split(':').map(Number);
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const finMinutos = finHora * 60 + finMin;

    if (finMinutos <= inicioMinutos) {
        return res.status(400).json({ 
            error: 'La hora de fin debe ser posterior a la hora de inicio' 
        });
    }

    if (!validarHorarioGimnasio(fecha, startTime, endTime)) {
        return res.status(400).json({ 
            error: 'El horario está fuera del horario de operación del gimnasio' 
        });
    }

    const id = Date.now().toString();

    const query = `
        INSERT INTO clases (id, nombre, entrenador, startTime, endTime, descripcion, 
                          totalCupos, cuposDisponibles, fecha, precio, day) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query, 
        [id, nombre, entrenador, startTime, endTime, descripcion, 
         totalCupos, totalCupos, fecha, precio, fecha],
        (err, results) => {
            if (err) {
                console.error('Error al crear clase:', err);
                res.status(500).json({ error: 'Error al crear la clase' });
                return;
            }
            res.status(201).json({ 
                id, 
                nombre, 
                entrenador, 
                startTime, 
                endTime, 
                descripcion, 
                totalCupos,
                cuposDisponibles: totalCupos,
                fecha,
                precio
            });
        }
    );
});

// Actualizar clase existente
app.put('/clases/:id', (req, res) => {
    const { id } = req.params;
    const { 
        nombre, 
        entrenador, 
        startTime, 
        endTime, 
        descripcion, 
        totalCupos, 
        fecha, 
        precio 
    } = req.body;

    // Validar que el horario sea válido
    const [inicioHora, inicioMin] = startTime.split(':').map(Number);
    const [finHora, finMin] = endTime.split(':').map(Number);
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const finMinutos = finHora * 60 + finMin;

    if (finMinutos <= inicioMinutos) {
        return res.status(400).json({ 
            error: 'La hora de fin debe ser posterior a la hora de inicio' 
        });
    }

    // Validar horario del gimnasio
    if (!validarHorarioGimnasio(fecha, startTime, endTime)) {
        return res.status(400).json({ 
            error: 'El horario está fuera del horario de operación del gimnasio' 
        });
    }

    // Verificar que el entrenador exista por nombre en lugar de usuario
    const checkTrainerQuery = 'SELECT id FROM employee WHERE name = ?';
    db.query(checkTrainerQuery, [entrenador], (err, trainerResults) => {
        if (err) {
            console.error('Error al verificar entrenador:', err);
            return res.status(500).json({ error: 'Error al verificar entrenador' });
        }

        if (trainerResults.length === 0) {
            return res.status(400).json({ error: 'El entrenador especificado no existe' });
        }

        // Verificar si la clase existe y obtener cupos disponibles actuales
        const getClassQuery = 'SELECT totalCupos, cuposDisponibles FROM clases WHERE id = ?';
        db.query(getClassQuery, [id], (err, classResults) => {
            if (err) {
                console.error('Error al obtener información de la clase:', err);
                return res.status(500).json({ error: 'Error al obtener información de la clase' });
            }

            if (classResults.length === 0) {
                return res.status(404).json({ error: 'Clase no encontrada' });
            }

            const currentClass = classResults[0];
            // Calcular nuevos cupos disponibles manteniendo la proporción
            const cuposOcupados = currentClass.totalCupos - currentClass.cuposDisponibles;
            const nuevosCuposDisponibles = Math.max(0, totalCupos - cuposOcupados);

            // Actualizar la clase
            const updateQuery = `
                UPDATE clases 
                SET nombre = ?,
                    entrenador = ?,
                    startTime = ?,
                    endTime = ?,
                    descripcion = ?,
                    totalCupos = ?,
                    cuposDisponibles = ?,
                    fecha = ?,
                    precio = ?,
                    day = ?
                WHERE id = ?
            `;

            db.query(
                updateQuery,
                [
                    nombre,
                    entrenador,
                    startTime,
                    endTime,
                    descripcion,
                    totalCupos,
                    nuevosCuposDisponibles,
                    fecha,
                    precio,
                    fecha,
                    id
                ],
                (err, results) => {
                    if (err) {
                        console.error('Error al actualizar clase:', err);
                        return res.status(500).json({ error: 'Error al actualizar la clase' });
                    }

                    // Enviar respuesta con los datos actualizados
                    res.json({
                        id,
                        nombre,
                        entrenador,
                        startTime,
                        endTime,
                        descripcion,
                        totalCupos,
                        cuposDisponibles: nuevosCuposDisponibles,
                        fecha,
                        precio
                    });
                }
            );
        });
    });
});

// Nuevo endpoint para crear inscripción
app.post('/inscripciones', (req, res) => {
    const { clientId, claseId } = req.body;

    // Primero verificamos si el cliente existe
    const checkClientQuery = 'SELECT id FROM client WHERE id = ?';
    db.query(checkClientQuery, [clientId], (err, clientResults) => {
        if (err) {
            console.error('Error al verificar cliente:', err);
            return res.status(500).json({ error: 'Error al verificar cliente' });
        }

        if (clientResults.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Luego verificamos si la clase existe y tiene cupos disponibles
        const checkClassQuery = 'SELECT id, cuposDisponibles FROM clases WHERE id = ?';
        db.query(checkClassQuery, [claseId], (err, classResults) => {
            if (err) {
                console.error('Error al verificar clase:', err);
                return res.status(500).json({ error: 'Error al verificar clase' });
            }

            if (classResults.length === 0) {
                return res.status(404).json({ error: 'Clase no encontrada' });
            }

            if (classResults[0].cuposDisponibles <= 0) {
                return res.status(400).json({ error: 'No hay cupos disponibles' });
            }

            // Verificamos si el cliente ya está inscrito en esta clase
            const checkInscripcionQuery = 'SELECT id FROM inscripciones WHERE clientId = ? AND claseId = ?';
            db.query(checkInscripcionQuery, [clientId, claseId], (err, inscripcionResults) => {
                if (err) {
                    console.error('Error al verificar inscripción:', err);
                    return res.status(500).json({ error: 'Error al verificar inscripción' });
                }

                if (inscripcionResults.length > 0) {
                    return res.status(400).json({ error: 'Ya estás inscrito en esta clase' });
                }

                // Si todo está bien, creamos la inscripción
                const inscripcion = {
                    clientId,
                    claseId,
                    fechaInscripcion: new Date(),
                    estadoPago: 'inscrito pero no pagado'
                };

                const createInscripcionQuery = 'INSERT INTO inscripciones SET ?';
                db.query(createInscripcionQuery, inscripcion, (err, result) => {
                    if (err) {
                        console.error('Error al crear inscripción:', err);
                        return res.status(500).json({ error: 'Error al crear inscripción' });
                    }

                    // Actualizamos los cupos disponibles de la clase
                    const updateCuposQuery = 'UPDATE clases SET cuposDisponibles = cuposDisponibles - 1 WHERE id = ?';
                    db.query(updateCuposQuery, [claseId], (err) => {
                        if (err) {
                            console.error('Error al actualizar cupos:', err);
                            return res.status(500).json({ error: 'Error al actualizar cupos' });
                        }

                        res.status(201).json({
                            message: 'Inscripción creada exitosamente',
                            inscripcionId: result.insertId,
                            ...inscripcion
                        });
                    });
                });
            });
        });
    });
});

// Endpoint para obtener las inscripciones de un cliente
app.get('/inscripciones/cliente/:clientId', (req, res) => {
    const { clientId } = req.params;
    
    const query = `
        SELECT i.*, c.nombre as nombreClase, c.fecha, c.startTime, c.endTime, c.entrenador 
        FROM inscripciones i 
        JOIN clases c ON i.claseId = c.id 
        WHERE i.clientId = ?
    `;
    
    db.query(query, [clientId], (err, results) => {
        if (err) {
            console.error('Error al obtener inscripciones:', err);
            return res.status(500).json({ error: 'Error al obtener inscripciones' });
        }
        res.json(results);
    });
});

// Endpoint para actualizar el estado de pago de una inscripción
app.patch('/inscripciones/:id', (req, res) => {
    const { id } = req.params;
    const { estadoPago } = req.body;
    
    const query = 'UPDATE inscripciones SET estadoPago = ? WHERE id = ?';
    db.query(query, [estadoPago, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar estado de pago:', err);
            return res.status(500).json({ error: 'Error al actualizar estado de pago' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }
        
        res.json({ message: 'Estado de pago actualizado exitosamente' });
    });
});


// Endpoint para cancelar una inscripción
app.delete('/inscripciones/:id', (req, res) => {
    const { id } = req.params;
    
    // Primero obtenemos la información de la inscripción
    const getInscripcionQuery = `
        SELECT i.*, c.cuposDisponibles 
        FROM inscripciones i 
        JOIN clases c ON i.claseId = c.id 
        WHERE i.id = ?
    `;
    
    db.query(getInscripcionQuery, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener inscripción:', err);
            return res.status(500).json({ error: 'Error al obtener inscripción' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }
        
        const inscripcion = results[0];
        
        // Iniciamos una transacción para asegurar la integridad de los datos
        db.beginTransaction(err => {
            if (err) {
                console.error('Error al iniciar transacción:', err);
                return res.status(500).json({ error: 'Error al iniciar transacción' });
            }
            
            // Eliminamos la inscripción
            const deleteQuery = 'DELETE FROM inscripciones WHERE id = ?';
            db.query(deleteQuery, [id], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error al eliminar inscripción:', err);
                        res.status(500).json({ error: 'Error al eliminar inscripción' });
                    });
                }
                
                // Actualizamos los cupos disponibles
                const updateCuposQuery = 'UPDATE clases SET cuposDisponibles = cuposDisponibles + 1 WHERE id = ?';
                db.query(updateCuposQuery, [inscripcion.claseId], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error al actualizar cupos:', err);
                            res.status(500).json({ error: 'Error al actualizar cupos' });
                        });
                    }
                    
                    // Confirmamos la transacción
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error al confirmar transacción:', err);
                                res.status(500).json({ error: 'Error al confirmar transacción' });
                            });
                        }
                        
                        res.json({ 
                            message: 'Inscripción cancelada exitosamente',
                            inscripcionId: id
                        });
                    });
                });
            });
        });
    });
});

// Función para limpiar inscripciones vencidas
const limpiarInscripcionesVencidas = () => {
    const query = `
        DELETE i FROM inscripciones i
        WHERE i.estadoPago = 'pendiente'
        AND TIMESTAMPDIFF(HOUR, i.fechaInscripcion, NOW()) >= 24
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al limpiar inscripciones vencidas:', err);
            return;
        }
        
        if (result.affectedRows > 0) {
            console.log(`Se eliminaron ${result.affectedRows} inscripciones vencidas`);
            
            // Actualizamos los cupos disponibles para las clases afectadas
            const updateCuposQuery = `
                UPDATE clases c
                JOIN (
                    SELECT claseId, COUNT(*) as count
                    FROM inscripciones i
                    WHERE i.estadoPago = 'pendiente'
                    AND TIMESTAMPDIFF(HOUR, i.fechaInscripcion, NOW()) >= 24
                    GROUP BY claseId
                ) deleted ON c.id = deleted.claseId
                SET c.cuposDisponibles = c.cuposDisponibles + deleted.count
            `;
            
            db.query(updateCuposQuery, (err) => {
                if (err) {
                    console.error('Error al actualizar cupos después de limpieza:', err);
                }
            });
        }
    });
};

// Ejecutar la limpieza cada hora
setInterval(limpiarInscripcionesVencidas, 3600000);

// Ejecutar la limpieza al iniciar el servidor
limpiarInscripcionesVencidas();

// Endpoint para obtener todas las inscripciones de una clase específica
app.get('/inscripciones/:claseId', (req, res) => {
    const { claseId } = req.params;
    
    const query = `
        SELECT 
            i.id,
            i.clientId,
            i.fechaInscripcion,
            i.estadoPago,
            c.nombre,
            c.apellido,
            c.correo
        FROM inscripciones i
        JOIN client c ON i.clientId = c.id
        WHERE i.claseId = ?
    `;
    
    db.query(query, [claseId], (err, results) => {
        if (err) {
            console.error('Error al obtener inscripciones:', err);
            return res.status(500).json({ error: 'Error al obtener inscripciones' });
        }
        
        // Formatea los resultados
        const inscripciones = results.map(inscripcion => ({
            id: inscripcion.id,
            idCliente: inscripcion.clientId,
            nombre: `${inscripcion.nombre} ${inscripcion.apellido}`,
            correo: inscripcion.correo,
            fechaInscripcion: inscripcion.fechaInscripcion,
            estadoPago: inscripcion.estadoPago
        }));
        
        res.json(inscripciones);
    });
});

// Endpoint para actualizar el estado de pago de una inscripción
app.patch('/inscripciones/:inscripcionId/pago', (req, res) => {
    const { inscripcionId } = req.params;
    
    const query = `
        UPDATE inscripciones 
        SET estadoPago = 'pagado'
        WHERE id = ?
    `;
    
    db.query(query, [inscripcionId], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado de pago:', err);
            return res.status(500).json({ error: 'Error al actualizar el estado de pago' });
        }
        
        // Obtener la inscripción actualizada
        const getUpdatedInscripcion = `
            SELECT 
                i.id,
                i.clientId,
                i.fechaInscripcion,
                i.estadoPago,
                c.nombre,
                c.apellido,
                c.correo
            FROM inscripciones i
            JOIN client c ON i.clientId = c.id
            WHERE i.id = ?
        `;
        
        db.query(getUpdatedInscripcion, [inscripcionId], (err, results) => {
            if (err) {
                console.error('Error al obtener la inscripción actualizada:', err);
                return res.status(500).json({ error: 'Error al obtener la inscripción actualizada' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Inscripción no encontrada' });
            }
            
            const inscripcionActualizada = {
                id: results[0].id,
                idCliente: results[0].clientId,
                nombre: `${results[0].nombre} ${results[0].apellido}`,
                correo: results[0].correo,
                fechaInscripcion: results[0].fechaInscripcion,
                estadoPago: results[0].estadoPago
            };
            
            res.json(inscripcionActualizada);
        });
    });
});


// Ruta para obtener las clases en las que está inscrito un cliente
app.get('/client-classes/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    const query = `
        SELECT c.*, 
               i.id as inscripcionId,
               i.fechaInscripcion,
               i.estadoPago,
               cl.nombre as clienteNombre,
               cl.apellido as clienteApellido,
               cl.correo as clienteCorreo
        FROM inscripciones i
        JOIN clases c ON i.claseId = c.id
        JOIN client cl ON i.clientId = cl.id
        WHERE i.clientId = ?
        ORDER BY c.fecha DESC, c.startTime ASC`;

    db.query(query, [clientId], (err, results) => {
        if (err) {
            console.error('Error al obtener las clases del cliente:', err);
            return res.status(500).json({ 
                error: 'Error al obtener las clases del cliente',
                details: err.message 
            });
        }

        // Transformar los resultados para que coincidan con el formato esperado por el frontend
        const classesWithInscriptions = results.map(row => ({
            id: row.id,
            nombre: row.nombre,
            entrenador: row.entrenador,
            startTime: row.startTime,
            endTime: row.endTime,
            descripcion: row.descripcion,
            totalCupos: row.totalCupos,
            cuposDisponibles: row.cuposDisponibles,
            fecha: row.fecha,
            precio: row.precio,
            day: row.day,
            inscritos: [{
                id: row.inscripcionId,
                idCliente: clientId,
                nombre: `${row.clienteNombre} ${row.clienteApellido}`,
                correo: row.clienteCorreo,
                fechaInscripcion: row.fechaInscripcion,
                estadoPago: row.estadoPago
            }]
        }));

        res.json(classesWithInscriptions);
    });
});

// Ruta para obtener los detalles de las inscripciones de una clase específica
app.get('/inscripciones/:claseId', (req, res) => {
    const claseId = req.params.claseId;
    const query = `
        SELECT 
            i.id,
            i.clientId as idCliente,
            CONCAT(c.nombre, ' ', c.apellido) as nombre,
            c.correo,
            i.fechaInscripcion,
            i.estadoPago
        FROM inscripciones i
        JOIN client c ON i.clientId = c.id
        WHERE i.claseId = ?
        ORDER BY i.fechaInscripcion DESC`;

    db.query(query, [claseId], (err, results) => {
        if (err) {
            console.error('Error al obtener las inscripciones:', err);
            return res.status(500).json({ 
                error: 'Error al obtener las inscripciones',
                details: err.message 
            });
        }

        res.json(results);
    });
});

// Ruta para crear un nuevo producto
app.post('/productos', (req, res) => {
    const { name, description, price, image, category } = req.body;
    
    // Obtener el ID del usuario logueado 
    const createdBy = req.body.createdBy;  

    // Validar que todos los campos requeridos estén presentes
    if (!name || !description || !price || !image || !category || !createdBy) {
        return res.status(400).json({ 
            error: 'Todos los campos son obligatorios, incluyendo el ID del admin' 
        });
    }

    const query = `
        INSERT INTO productos 
        (name, description, price, image, category, createdBy) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [name, description, price, image, category, createdBy];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al crear el producto:', err);
            return res.status(500).json({ 
                error: 'Error interno del servidor al crear el producto',
                details: err.message 
            });
        }

        // Obtener el ID del producto recién insertado
        const newProductId = result.insertId;

        // Consultar el producto recién creado para devolverlo
        const selectQuery = 'SELECT * FROM productos WHERE id = ?';
        db.query(selectQuery, [newProductId], (selectErr, products) => {
            if (selectErr) {
                console.error('Error al recuperar el producto:', selectErr);
                return res.status(500).json({ 
                    error: 'Error al recuperar el producto creado',
                    details: selectErr.message 
                });
            }

            res.status(201).json(products[0]);
        });
    });
});

// Ruta para obtener todos los productos con información del admin
app.get('/productos', (req, res) => {
    const query = `
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.price, 
            p.image, 
            p.category, 
            p.createdBy,
            a.usuario as admin_name,
            a.correo as admin_email
        FROM 
            productos p
        LEFT JOIN 
            admin a ON p.createdBy = a.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los productos:', err);
            return res.status(500).json({ 
                error: 'Error interno del servidor al obtener los productos',
                details: err.message 
            });
        }

        // Formatear los resultados para que sean más amigables
        const formattedProducts = results.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            image: product.image,
            category: product.category,
            createdBy: {
                id: product.createdBy,
                name: product.admin_name,
                email: product.admin_email
            }
        }));

        res.status(200).json(formattedProducts);
    });
});

// Ruta para eliminar un producto por su ID
app.delete('/productos/:id', (req, res) => {
    const productId = req.params.id;

    // Verificar si se proporcionó un ID válido
    if (!productId) {
        return res.status(400).json({ 
            error: 'Se requiere un ID de producto válido' 
        });
    }

    // Consulta SQL para eliminar el producto
    const deleteQuery = 'DELETE FROM productos WHERE id = ?';

    db.query(deleteQuery, [productId], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto:', err);
            return res.status(500).json({ 
                error: 'Error interno del servidor al eliminar el producto',
                details: err.message 
            });
        }

        // Verificar si se eliminó algún producto
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Producto no encontrado' 
            });
        }

        // Producto eliminado exitosamente
        res.status(200).json({ 
            message: 'Producto eliminado exitosamente',
            productId: productId 
        });
    });
});

// Ruta para actualizar el perfil del clienteapp.patch('/client/:id', (req, res) => {
app.patch('/client/:id', (req, res) => {

  const { id } = req.params;
  const { nombre, apellido, sexo, tipoCuerpo, peso, altura, correo, telefono } = req.body;

  console.log('Datos recibidos:', req.body);  // Ver los datos recibidos
  console.log('ID del cliente:', id);  // Verificar si el ID es correcto

  const sql = `UPDATE client SET
    nombre = ?, 
    apellido = ?, 
    sexo = ?, 
    tipoCuerpo = ?, 
    peso = ?, 
    altura = ?, 
    correo = ?, 
    telefono = ?
  WHERE id = ?`;

  const values = [nombre, apellido, sexo, tipoCuerpo, peso, altura, correo, telefono, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error al actualizar el perfil' });
    }

    console.log('Resultado de la consulta:', result);  // Ver el resultado de la consulta
    if (result.affectedRows > 0) {
      // Si affectedRows > 0, la base de datos se actualizó
      return res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } else {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
