const {PeliModel,PeliSchema} = require('./pelicula.model')

function setUpModels(sequelize) {
PeliModel.init(PeliSchema,PeliModel.config(sequelize));
}

module.exports = setUpModels;