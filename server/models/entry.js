const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class Entry extends Model {
        static associate () {
            const { Player, Edition, MatchScore } = models
            Entry.belongsTo(Edition)
            Entry.belongsTo(Player)
            Entry.hasMany(MatchScore, {foreignKey: 'p1_no', as: 'entry1'})
            Entry.hasMany(MatchScore, {foreignKey: 'p2_no', as: 'entry2'})
        }
    }
    Entry.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        entry_no: DataTypes.INTEGER,
        rank: DataTypes.INTEGER,
        seed: DataTypes.INTEGER,
        status: DataTypes.ENUM('Alt', 'LL', 'PR', 'Q', 'SE', 'WC'),
        wd: DataTypes.STRING,
        ret: DataTypes.STRING,
        wo: DataTypes.STRING,
        lda: DataTypes.INTEGER,
        defaulted: DataTypes.STRING,
        points: DataTypes.INTEGER,
        pm: DataTypes.INTEGER
    },
    {
        sequelize,
        modelName: 'Entry'
    })

    return Entry
}