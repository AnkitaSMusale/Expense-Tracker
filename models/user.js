const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: {
       type:  Sequelize.STRING,
       allowNull: false,
       unique: true
    },
    phone: Sequelize.INTEGER,
    password: Sequelize.STRING,
    //isPremium:Sequelize.BOOLEAN
    // isPremium:{
    //     type: Sequelize.BOOLEAN,
    //     defaultValue: false
    // }
})

module.exports = User;