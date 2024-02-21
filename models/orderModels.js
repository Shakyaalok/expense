const Sequelize = require('sequelize');
const sequelize = require('../utils/db')
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    paymentid: {
        type: Sequelize.STRING,

    },
    orderid: {
        type: Sequelize.STRING,

    },
    status: {
        type: Sequelize.STRING,

    },


})


module.exports = Order;