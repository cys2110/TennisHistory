const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class Player extends Model {
        static associate () {
        const { Edition, Entry, MatchScore, WlIndex, PlayerStat } = models
            Player.hasMany(Edition, {foreignKey: 'winner_id'})
            Player.hasMany(Edition, {foreignKey: 'finalist_id'})
            Player.hasMany(Entry)
            Player.hasMany(MatchScore, {foreignKey: 'p1'})
            Player.hasMany(MatchScore, {foreignKey: 'p2'})
            Player.hasMany(MatchScore, {foreignKey: 'winner_id'})
            Player.hasOne(WlIndex)
            Player.hasMany(PlayerStat)
        }
        getFullName() {
            return [this.first_name, this.last_name].join(' ')
        }
    }
    Player.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: DataTypes.BOOLEAN,
        turned_pro: DataTypes.INTEGER,
        retired: DataTypes.INTEGER,
        country: DataTypes.STRING(3),
        country_yr: DataTypes.INTEGER,
        prev_country: DataTypes.STRING(3),
        prev_country_yr: DataTypes.INTEGER,
        first_country: DataTypes.STRING(3),
        dob: DataTypes.DATEONLY,
        rh: DataTypes.BOOLEAN,
        bh1: DataTypes.BOOLEAN,
        height_cm: DataTypes.INTEGER,
        height_ft: DataTypes.INTEGER,
        coaches: DataTypes.ARRAY(DataTypes.STRING),
        career_high: DataTypes.INTEGER,
        ch_date: DataTypes.DATEONLY,
        pm_USD: DataTypes.INTEGER,
        titles: DataTypes.INTEGER,
        win: DataTypes.INTEGER,
        loss: DataTypes.INTEGER,
        gladiator: DataTypes.BOOLEAN,
        headshot: DataTypes.BOOLEAN,
        ao_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        ao_years: DataTypes.ARRAY(DataTypes.INTEGER),
        rg_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        rg_years: DataTypes.ARRAY(DataTypes.INTEGER),
        wimbledon_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        wimbledon_years: DataTypes.ARRAY(DataTypes.INTEGER),
        uso_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        uso_years: DataTypes.ARRAY(DataTypes.INTEGER),
        finals_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        finals_years: DataTypes.ARRAY(DataTypes.INTEGER),
        davis_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        davis_years: DataTypes.ARRAY(DataTypes.INTEGER),
        olympics_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        olympics_years: DataTypes.ARRAY(DataTypes.INTEGER),
        hopman_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        hopman_years: DataTypes.ARRAY(DataTypes.INTEGER),
        gs_cup_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        gs_cup_years: DataTypes.ARRAY(DataTypes.INTEGER),
        wct_round: DataTypes.ENUM('128', '64', '32', 'QF', 'SF', 'F', 'W', 'RR', 'G', 'S', 'B', 'A'),
        wct_years: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    {
        sequelize,
        modelName: 'Player'
    })

    return Player
}