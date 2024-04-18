const { DataTypes, Model } = require('sequelize');
const { sequelize, edition, player, matchScore} = require('.');

module.exports = () => {
    class Entry extends Model {
        static associate (models) {
            Entry.belongsTo(edition, {targetKey: 'edition_no', foreignKey: 'edition'})
            Entry.belongsTo(player, {foreignKey: 'player_id'})
            Entry.hasMany(matchScore)
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