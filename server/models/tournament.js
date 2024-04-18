const { DataTypes, Model } = require('sequelize');
const { sequelize, edition} = require('.');

module.exports = () => {
    class Tournament extends Model {
        static associate (models) {
            Tournament.hasMany(edition)
        }
    }
    Tournament.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        start_year: DataTypes.INTEGER,
        end_year: DataTypes.INTEGER,
        website: DataTypes.STRING
    },
    {
        sequelize,
        modelName: 'Tournament'
    })

    return Tournament
}