const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './db/database.sqlite',
    database: './db/database.sqlite',
});
module.exports = sequelize;