import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const PlanModel = db.define('planes', {
  id_planes: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // Cambié el tipo a STRING si es una ruta a una imagen
    allowNull: false,
  },
  duration: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  benefits: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
}, {
  timestamps: false, // Si no tienes columnas `createdAt` y `updatedAt`
  tableName: 'planes', // Nombre de la tabla en la base de datos
});

export default PlanModel;
