const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.Database_Schema, process.env.Database_Username, process.env.Database_Password, {
    host: process.env.Database_Host,
    dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});



module.exports = sequelize;