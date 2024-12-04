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