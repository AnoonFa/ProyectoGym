const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ProyectoGym'
});

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
    const { id } = req.params;
    const query = 'SELECT * FROM client WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }
        res.json(result[0]);
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

    // Consultar las tablas en orden para buscar al usuario
    const roles = ['admin', 'employee', 'client'];
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
                    nombre: results[0].nombre,
                    apellido: results[0].apellido,
                    correo: results[0].correo,
                    tickets: results[0].tickets || 0,
                    habilitado: results[0].habilitado !== false
                };
                return callback(null, foundUser);
            }
            callback(null, null);
        });
    };
    

    // Iterar sobre las tablas y encontrar el usuario
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

    checkAllRoles(0); // Empezar con el primer rol
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


// Obtener todos los tickets
app.get('/ticketera', (req, res) => {
    const query = 'SELECT * FROM ticketera';
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

// Actualizar estado del ticket
app.put('/ticketera/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const query = 'UPDATE ticketera SET status = ? WHERE id = ?';

    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar ticket:', err);
            res.status(500).json({ error: 'Error al actualizar el ticket', details: err });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Ticket no encontrado' });
            return;
        }

        // Si el estado es "Pagado", actualizar los tickets del cliente
        if (status === 'Pagado') {
            const getTicketQuery = 'SELECT clientId, quantity FROM ticketera WHERE id = ?';
            db.query(getTicketQuery, [id], (err, ticketResult) => {
                if (err || ticketResult.length === 0) {
                    console.error('Error al obtener información del ticket:', err);
                    return;
                }

                const { clientId, quantity } = ticketResult[0];
                const updateClientQuery = `
                    UPDATE client 
                    SET tickets = tickets + ? 
                    WHERE id = ?
                `;

                db.query(updateClientQuery, [quantity, clientId], (err) => {
                    if (err) {
                        console.error('Error al actualizar tickets del cliente:', err);
                    }
                });
            });
        }

        res.json({ 
            message: 'Ticket actualizado exitosamente',
            affectedRows: result.affectedRows
        });
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
