const Sequelize = require('sequelize');
const sequelize = require('../utils/db')
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mobile: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ispremiumuser: {
        type: Sequelize.BOOLEAN
    },
    totalExpenses: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }

})


module.exports = User;