const Sequelize = require('sequelize');
const sequelize = require('../utils/db')
const FileDownload = sequelize.define('fileDownload', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    fileUrl: {
        type: Sequelize.STRING,
    }



})


module.exports = FileDownload;