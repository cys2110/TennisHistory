const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class MatchScore extends Model {
        static associate () {
            const { Player, Edition, Entry } = models
            MatchScore.belongsTo(Edition)
            MatchScore.belongsTo(Entry, {foreignKey: {name: 'p1_no'}})
            MatchScore.belongsTo(Player, {foreignKey: {name: 'p1', type: DataTypes.STRING}})
            MatchScore.belongsTo(Entry, {foreignKey: {name: 'p2_no'}})
            MatchScore.belongsTo(Player, {foreignKey: {name: 'p2', type: DataTypes.STRING}})
            MatchScore.belongsTo(Player, {foreignKey: {name: 'winner_id', type: DataTypes.STRING}})
        }
    }
    MatchScore.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        round: DataTypes.STRING,
        match_no: DataTypes.INTEGER,
        duration_mins: DataTypes.INTEGER,
        incomplete: DataTypes.ENUM('B', 'D', 'R', 'WO'),
        umpire: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        s1p1: DataTypes.INTEGER,
        s1p2: DataTypes.INTEGER,
        t1p1: DataTypes.INTEGER,
        t1p2: DataTypes.INTEGER,
        s2p1: DataTypes.INTEGER,
        s2p2: DataTypes.INTEGER,
        t2p1: DataTypes.INTEGER,
        t2p2: DataTypes.INTEGER,
        s3p1: DataTypes.INTEGER,
        s3p2: DataTypes.INTEGER,
        t3p1: DataTypes.INTEGER,
        t3p2: DataTypes.INTEGER,
        s4p1: DataTypes.INTEGER,
        s4p2: DataTypes.INTEGER,
        t4p1: DataTypes.INTEGER,
        t4p2: DataTypes.INTEGER,
        s5p1: DataTypes.INTEGER,
        s5p2: DataTypes.INTEGER,
        t5p1: DataTypes.INTEGER,
        t5p2: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: 'MatchScore'
    })

    return MatchScore
}