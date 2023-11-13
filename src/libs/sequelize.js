const {Sequelize} = require ('sequelize');
const setUpModels = require('../../db/models');

const sequelize = new Sequelize('peliculas-db', 'postgres', 'jose1993',{
host: 'localhost',
dialect: 'postgres',
logging: true
});
const models = setUpModels(sequelize);
console.log(" ESTO LLEVA",models);
setUpModels(sequelize);
module.exports = sequelize;


