const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class Tie extends Model {
        static associate () {
            const { Edition, MatchScore, NonCount } = models
            Tie.belongsTo(Edition)
            Tie.hasMany(MatchScore)
            Tie.hasMany(NonCount)
        }
    }
    Tie.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        round: DataTypes.STRING,
        country1: DataTypes.STRING(3),
        country2: DataTypes.STRING(3),
        date: DataTypes.DATEONLY,
        venue: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING(3),
        environment: DataTypes.ENUM('Indoor', 'Outdoor'),
        surface: DataTypes.ENUM('Clay', 'Carpet', 'Grass', 'Hard'),
        hard_type: DataTypes.STRING
    },
    {
        sequelize,
        modelName: 'Tie'
    })

    return Tie
}