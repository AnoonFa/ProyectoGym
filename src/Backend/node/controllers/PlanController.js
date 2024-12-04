import PlanModel from "../models/PlanModel.js";
import ClienteModel from "../models/ClientModel.js";

// Obtener datos de un plan por ID
export const getPlan = async (req, res) => {
    try {
        const plan = await PlanModel.findOne({ where: { id_planes: req.params.id } });
        if (!plan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el plan', error: error.message });
    }
};

// Actualizar fecha de expiración de un plan
export const updatePlanEndDate = async (req, res) => {
    try {
        const { duration } = req.body; // Supongo que "duration" representa la nueva fecha de expiración
        const [updated] = await PlanModel.update(
            { duration },
            { where: { id_planes: req.params.id } }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }
        res.json({ message: 'Duración del plan actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la duración del plan', error: error.message });
    }
};

// Verificar si un cliente tiene un plan activo
export const checkActivePlan = async (req, res) => {
    try {
        const cliente = await ClienteModel.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const planes = cliente.planes ? JSON.parse(cliente.planes) : [];
        const activePlan = planes.find((plan) => new Date(plan.duration) > new Date());

        res.json({ hasActivePlan: !!activePlan });
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar el plan activo', error: error.message });
    }
};

// Añadir un plan a un cliente
export const addPlanToClient = async (req, res) => {
    try {
        const cliente = await ClienteModel.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const { planId } = req.body; // ID del plan a añadir
        const plan = await PlanModel.findByPk(planId);

        if (!plan) {
            return res.status(404).json({ message: 'Plan no encontrado' });
        }

        const planesActuales = cliente.planes ? JSON.parse(cliente.planes) : [];
        planesActuales.push(plan);

        await ClienteModel.update(
            { planes: JSON.stringify(planesActuales) },
            { where: { id: req.params.id } }
        );

        res.json({ message: 'Plan añadido exitosamente', plan });
    } catch (error) {
        res.status(500).json({ message: 'Error al añadir el plan', error: error.message });
    }
};

// Obtener todos los planes (opcional)
export const getAllPlans = async (req, res) => {
    try {
        const planes = await PlanModel.findAll();
        res.json(planes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los planes', error: error.message });
    }
};
