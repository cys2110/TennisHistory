const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class Entry extends Model {
        static associate () {
            const { Player, Edition, MatchScore } = models
            Entry.belongsTo(Edition)
            Entry.belongsTo(Player)
            Entry.hasMany(MatchScore)
        }
    }
    Entry.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        entry_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rank: DataTypes.INTEGER,
        seed: DataTypes.INTEGER,
        status: DataTypes.ENUM('A', 'LL', 'PR', 'Q', 'SE', 'WC'),
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