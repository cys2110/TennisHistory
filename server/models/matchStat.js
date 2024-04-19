const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class MatchStat extends Model {
        static associate () {
            const { Player, Entry, MatchScore } = models
            MatchStat.belongsTo(MatchScore)
            MatchStat.belongsTo(Player, {foreignKey: {name: 'p1', type: DataTypes.STRING}})
            MatchStat.belongsTo(Player, {foreignKey: {name: 'p2', type: DataTypes.STRING}})
            MatchStat.belongsTo(Entry, {foreignKey: 'p1_no'})
            MatchStat.belongsTo(Entry, {foreignKey: 'p2_no'})
        }
    }
    MatchStat.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        p1_aces: DataTypes.INTEGER,
        p1_dfs: DataTypes.INTEGER,
        p1_serve1: DataTypes.INTEGER,
        p1_serve1_pts_w: DataTypes.INTEGER,
        p1_serve1_pts: DataTypes.INTEGER,
        p1_serve2_pts_w: DataTypes.INTEGER,
        p1_serve2_pts: DataTypes.INTEGER,
        p1_bps_saved: DataTypes.INTEGER,
        p1_bps_faced: DataTypes.INTEGER,
        p1_sv_gms: DataTypes.INTEGER,
        p1_sv_pts: DataTypes.INTEGER,
        p1_pts: DataTypes.INTEGER,
        total_pts: DataTypes.INTEGER,
        p2_aces: DataTypes.INTEGER,
        p2_dfs: DataTypes.INTEGER,
        p2_serve1: DataTypes.INTEGER,
        p2_serve1_pts_w: DataTypes.INTEGER,
        p2_serve1_pts: DataTypes.INTEGER,
        p2_serve2_pts_w: DataTypes.INTEGER,
        p2_serve2_pts: DataTypes.INTEGER,
        p2_bps_saved: DataTypes.INTEGER,
        p2_bps_faced: DataTypes.INTEGER,
        p2_sv_gms: DataTypes.INTEGER,
        p2_sv_gms: DataTypes.INTEGER,
        p2_sv_pts: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: 'MatchStat'
    })

    return MatchStat
}