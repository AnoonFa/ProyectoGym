import EmployeeModel from "../models/EmployeeModel.js";

// Obtener todos los empleados
export const getEmployees = async (req, res) => {
    try {
        const employees = await EmployeeModel.findAll({
            attributes: ['id', 'name'] // Solo selecciona las columnas necesarias
        });
        res.json(employees);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ error: 'Error al obtener empleados' });
    }
};
