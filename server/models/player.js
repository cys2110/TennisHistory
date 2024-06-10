const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class Player extends Model {
        static associate () {
        const { Edition, Entry, MatchScore, NonCount } = models
            Player.hasMany(Edition, {foreignKey: 'winner_id', as: 'winner'})
            Player.hasMany(Edition, {foreignKey: 'finalist_id', as: 'finalist'})
            Player.belongsToMany(Edition, {as: 'edition_entries', through: Entry})
            Player.hasMany(Entry)
            Player.hasMany(MatchScore, {foreignKey: 'p1', as: 'player1'})
            Player.hasMany(MatchScore, {foreignKey: 'p2', as: 'player2'})
            Player.hasMany(MatchScore, {foreignKey: 'winner_id'})
            Player.hasMany(NonCount, {foreignKey: 'p1', as: 'atp1'})
            Player.hasMany(NonCount, {foreignKey: 'p2', as: 'atp2'})
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
        full_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.first_name} ${this.last_name}`
            },
            set(value) {
                throw new Error ('Do not try to set the `full_name` value!')
            }
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
        height_ft: DataTypes.STRING,
        coaches: DataTypes.ARRAY(DataTypes.STRING),
        career_high: DataTypes.INTEGER,
        ch_date: DataTypes.DATEONLY,
        pm_USD: DataTypes.INTEGER,
        titles: DataTypes.INTEGER,
        win: DataTypes.INTEGER,
        loss: DataTypes.INTEGER,
        gladiator: DataTypes.BOOLEAN,
        headshot: DataTypes.BOOLEAN,
        ao_round: DataTypes.STRING,
        ao_years: DataTypes.ARRAY(DataTypes.INTEGER),
        rg_round: DataTypes.STRING,
        rg_years: DataTypes.ARRAY(DataTypes.INTEGER),
        wimbledon_round: DataTypes.STRING,
        wimbledon_years: DataTypes.ARRAY(DataTypes.INTEGER),
        uso_round: DataTypes.STRING,
        uso_years: DataTypes.ARRAY(DataTypes.INTEGER),
        finals_round: DataTypes.STRING,
        finals_years: DataTypes.ARRAY(DataTypes.INTEGER),
        davis_round: DataTypes.STRING,
        davis_years: DataTypes.ARRAY(DataTypes.INTEGER),
        olympics_round: DataTypes.STRING,
        olympics_years: DataTypes.ARRAY(DataTypes.INTEGER),
        hopman_round: DataTypes.STRING,
        hopman_years: DataTypes.ARRAY(DataTypes.INTEGER),
        gs_cup_round: DataTypes.STRING,
        gs_cup_years: DataTypes.ARRAY(DataTypes.INTEGER),
        wct_round: DataTypes.STRING,
        wct_years: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    {
        sequelize,
        modelName: 'Player'
    })

    return Player
}