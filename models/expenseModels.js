const Sequelize = require('sequelize');
const sequelize = require('../utils/db')
const Expense = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    productName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    productPrice: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    productCategory: {
        type: Sequelize.STRING,
        allowNull: false
    },
    remarks: {
        type: Sequelize.STRING,
        allowNull: true
    }
})


module.exports = Expense;