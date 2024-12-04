import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const EmployeeModel = db.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING }
}, {
    tableName: 'employee',
    timestamps: false
});

export default EmployeeModel;
