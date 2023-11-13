const{Model, DataTypes} = require('sequelize');

const PELI_TABLE = 'peliculas';

const PeliSchema={
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    año: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    
};

    class PeliModel extends Model {
        static associate(models){
            
        }
        static config(sequelize){
            return {
                sequelize,
                modelName: 'Peli',
                tableName: PELI_TABLE,                
                timestamps: false
            }
        }
    }

    module.exports = {PeliModel, PeliSchema, PELI_TABLE};