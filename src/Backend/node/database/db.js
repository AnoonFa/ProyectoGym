import { Sequelize } from "sequelize";

const db = new Sequelize('', 'root', '',{
    host:'localhost',
    dialect: 'mysql'
})

export default db;