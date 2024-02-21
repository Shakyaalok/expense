const Sequelize = require('sequelize');
const sequelize = require('../utils/db')
const Contact = sequelize.define('contact', {
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
        type: Sequelize.STRING,
        allowNull: false,
    },
    query: {
        type: Sequelize.STRING,
        allowNull: false
    },

})


module.exports = Contact;