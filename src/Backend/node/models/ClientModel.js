import { DataTypes } from "sequelize";
import db from "../database/db.js";

const ClientModel = db.define("client", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: false },
    tipoDocumento: { type: DataTypes.STRING, allowNull: false },
    numeroDocumento: { type: DataTypes.STRING, unique: true, allowNull: false },
    sexo: { type: DataTypes.STRING, allowNull: true },
    tipoCuerpo: { type: DataTypes.STRING, allowNull: true },
    peso: { type: DataTypes.FLOAT, allowNull: true },
    altura: { type: DataTypes.FLOAT, allowNull: true },
    usuario: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING, unique: true, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: true },
    rutinas: { type: DataTypes.TEXT, allowNull: true },
    tickets: { type: DataTypes.INTEGER, defaultValue: 0 },
    fechaCreacion: { type: DataTypes.DATEONLY, allowNull: false },
    horaCreacion: { type: DataTypes.TIME, allowNull: false },
    habilitado: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    timestamps: false,
    tableName: "client",
});

export default ClientModel;
