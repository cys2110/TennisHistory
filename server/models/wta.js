const { DataTypes, Model } = require('sequelize')

module.exports = (sequelize, models) => {
    class WTA extends Model {
        static associate() {
            const { NonCount, Edition } = models
            WTA.hasMany(NonCount, {foreignKey: 'wta_p1', as: 'wta1'})
            WTA.hasMany(NonCount, {foreignKey: 'wta_p2', as: 'wta2'})
            WTA.belongsTo(Edition)
        }
    }

    WTA.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        country: DataTypes.STRING,
        name: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: 'WTA'
    })

    return WTA
}