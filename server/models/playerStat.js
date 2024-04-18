const { DataTypes, Model } = require('sequelize');
const { sequelize, player} = require('.');

module.exports = () => {
    class PlayerStat extends Model {
        static associate (models) {
            PlayerStat.belongsTo(player, {foreignKey: {name: 'player_id', type: DataTypes.STRING}})
        }
    }
    PlayerStat.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        surface: DataTypes.ENUM('Cl', 'C', 'G', 'H'),
        career: DataTypes.BOOLEAN,
        year: DataTypes.INTEGER,
        aces: DataTypes.INTEGER,
        dfs: DataTypes.INTEGER,
        serve1: DataTypes.INTEGER,
        serve1_pts: DataTypes.INTEGER,
        serve2_pts: DataTypes.INTEGER,
        bps_faced: DataTypes.INTEGER,
        bps_saved: DataTypes.INTEGER,
        sv_gms_played: DataTypes.INTEGER,
        sv_gms_won: DataTypes.INTEGER,
        sv_pts_won: DataTypes.INTEGER,
        return1_pts: DataTypes.INTEGER,
        return2_pts: DataTypes.INTEGER,
        bp_opps: DataTypes.INTEGER,
        bps_converted: DataTypes.INTEGER,
        ret_gms_played: DataTypes.INTEGER,
        ret_gms_won: DataTypes.INTEGER,
        ret_pts_won: DataTypes.INTEGER,
        pts_won: DataTypes.INTEGER
    },
    {
        sequelize,
        modelName: 'PlayerStat'
    })

    return PlayerStat
}