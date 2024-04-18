const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class Tournament extends Model {
        static associate () {
            const { Edition } = models
            Tournament.hasMany(Edition)
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