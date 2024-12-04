import ClientModel from "../models/ClientModel.js";

// Obtener todos los clientes (con filtro opcional por número de documento o correo)
export const getClients = async (req, res) => {
    try {
        const { numeroDocumento, correo } = req.query;
        const whereClause = {};

        if (numeroDocumento) whereClause.numeroDocumento = numeroDocumento;
        if (correo) whereClause.correo = correo;

        const clients = await ClientModel.findAll({ where: whereClause });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
    }
};

// Obtener un cliente específico por ID
export const getClientById = async (req, res) => {
    try {
        const client = await ClientModel.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el cliente", error: error.message });
    }
};

// Crear un nuevo cliente
export const createClient = async (req, res) => {
    try {
        const {
            nombre, apellido, tipoDocumento, numeroDocumento,
            sexo, peso, altura, usuario, password, correo, telefono
        } = req.body;

        const fechaCreacion = new Date().toISOString().split('T')[0];
        const horaCreacion = new Date().toTimeString().split(' ')[0];

        const newClient = await ClientModel.create({
            nombre, apellido, tipoDocumento, numeroDocumento,
            sexo, peso, altura, usuario, password,
            correo, telefono, fechaCreacion, horaCreacion, habilitado: true
        });

        res.status(201).json({
            message: "Cliente creado exitosamente",
            client: newClient
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el cliente", error: error.message });
    }
};

// Actualizar un cliente
export const updateClient = async (req, res) => {
    try {
        const { tipoCuerpo, rutinas } = req.body;
        const [updated] = await ClientModel.update(
            { tipoCuerpo, rutinas },
            { where: { id: req.params.id } }
        );

        if (!updated) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json({ message: "Cliente actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el cliente", error: error.message });
    }
};

// Verificar si un usuario existe
export const checkUserExists = async (req, res) => {
    try {
        const { usuario } = req.query;
        const client = await ClientModel.findOne({ where: { usuario } });

        res.json({ exists: !!client });
    } catch (error) {
        res.status(500).json({ message: "Error al verificar usuario", error: error.message });
    }
};
