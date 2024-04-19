const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class wlIndex extends Model {
        static associate () {
            const { Player } = models
            wlIndex.belongsTo(Player, {foreignKey: {type: DataTypes.STRING}})
        }
    }
    wlIndex.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        overall_w: DataTypes.INTEGER,
        overall_l: DataTypes.INTEGER,
        overall_titles: DataTypes.INTEGER,
        gs_w: DataTypes.INTEGER,
        gs_l: DataTypes.INTEGER,
        gs_titles: DataTypes.INTEGER,
        masters_w: DataTypes.INTEGER,
        masters_l: DataTypes.INTEGER,
        masters_titles: DataTypes.INTEGER,
        tb_w: DataTypes.INTEGER,
        tb_l: DataTypes.INTEGER,
        v10_w: DataTypes.INTEGER,
        v10_l: DataTypes.INTEGER,
        finals_w: DataTypes.INTEGER,
        finals_l: DataTypes.INTEGER,
        deciders_w: DataTypes.INTEGER,
        deciders_l: DataTypes.INTEGER,
        set5_w: DataTypes.INTEGER,
        set5_l: DataTypes.INTEGER,
        cl_w: DataTypes.INTEGER,
        cl_l: DataTypes.INTEGER,
        cl_titles: DataTypes.INTEGER,
        g_w: DataTypes.INTEGER,
        g_l: DataTypes.INTEGER,
        g_titles: DataTypes.INTEGER,
        h_w: DataTypes.INTEGER,
        h_l: DataTypes.INTEGER,
        h_titles: DataTypes.INTEGER,
        c_w: DataTypes.INTEGER,
        c_l: DataTypes.INTEGER,
        c_titles: DataTypes.INTEGER,
        i_w: DataTypes.INTEGER,
        i_l: DataTypes.INTEGER,
        i_titles: DataTypes.INTEGER,
        o_w: DataTypes.INTEGER,
        o_l: DataTypes.INTEGER,
        o_titles: DataTypes.INTEGER,
        w1_w: DataTypes.INTEGER,
        w1_l: DataTypes.INTEGER,
        l1_w: DataTypes.INTEGER,
        l1_l: DataTypes.INTEGER,
        rh_w: DataTypes.INTEGER,
        rh_l: DataTypes.INTEGER,
        lh_w: DataTypes.INTEGER,
        lh_l: DataTypes.INTEGER
    },
    {
        sequelize,
        modelName: 'wlIndex'
    })

    return wlIndex
}