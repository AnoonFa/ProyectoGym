const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

//Despliegue
const url = require('url');
const url = require('url');

// Parsear la URL para obtener las credenciales
const dbParams = url.parse(dbUrl);
const [username, password] = dbParams.auth.split(':');
const dbName = dbParams.pathname.split('/')[1];


const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'ProyectoGym'
// });

// Configuración de la conexión
const db = mysql.createConnection({
    host: dbParams.hostname,
    user: username,
    password: password,
    database: dbName
});
// mysql://vmdlgmcmgh7azdmh:a6apzim09v1v7ca1@wvulqmhjj9tbtc1w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/vcmdb0gjowzzxrcq


db.connect((err) => {
    if (err) {
        console.error('Error al conectarse a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a MySQL');
});

// Ruta para verificar que el servidor está funcionando
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
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

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { correo, password } = req.body;
    
    if (!correo || !password) {
        res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        return;
    }

    // Añadido para incluir al usuario con rol 'employee'
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
                res.status(200).json(user);
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
    const query = "SELECT * FROM clases";
    db.query(query, (err, results) => {
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
                    estadoPago: 'pendiente'
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});