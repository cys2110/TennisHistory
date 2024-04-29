const { DataTypes, Model } = require('sequelize')

module.exports = (sequelize, models) => {
    class NonCount extends Model {
        static associate() {
            const { Player, Tie, WTA, Entry } = models
            NonCount.belongsTo(Tie)
            NonCount.belongsTo(Player, {foreignKey: {name: 'p1', type: DataTypes.STRING}, as: 'atp1'})
            NonCount.belongsTo(Player, {foreignKey: {name: 'p2', type: DataTypes.STRING}, as: 'atp2'})
            NonCount.belongsTo(Entry, {foreignKey: {name: 'p1_no', type: DataTypes.STRING}, as: 'atpe1'})
            NonCount.belongsTo(Entry, {foreignKey: {name: 'p2_no'}, as: 'atpe2'})
            NonCount.belongsTo(WTA, {foreignKey: 'wta_p1', as: 'wta1'})
            NonCount.belongsTo(WTA, {foreignKey: 'wta_p2', as: 'wta2'})
        }
    }

    NonCount.init({
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
        winner: DataTypes.ENUM('p1', 'p2', 'wta1', 'wta2')
    },
    {
        sequelize,
        modelName: 'NonCount'
    })

    return NonCount
}