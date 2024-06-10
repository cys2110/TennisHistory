const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, models) => {
    class Edition extends Model {
        static associate () {
            const { Player, Tournament, Entry, MatchScore, Tie, WTA } = models
            Edition.belongsTo(Tournament)
            Edition.belongsTo(Player, {foreignKey: {name: 'winner_id', type: DataTypes.STRING}, as: 'winner'})
            Edition.belongsTo(Player, {foreignKey: {name: 'finalist_id', type: DataTypes.STRING}, as: 'finalist'})
            Edition.hasMany(Entry)
            Edition.hasMany(MatchScore)
            Edition.hasMany(Tie)
            Edition.hasMany(WTA)
        }
    }
    Edition.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        edition_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        sponsor_name: DataTypes.STRING,
        year: DataTypes.INTEGER,
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        category: DataTypes.STRING,
        type_of_draw: DataTypes.ENUM('32', '64', '128', 'RR', 'T'),
        currency: DataTypes.ENUM('AUD', 'USD', 'GBP', 'EUR'),
        pm: DataTypes.INTEGER,
        tfc: DataTypes.INTEGER,
        supervisors: DataTypes.ARRAY(DataTypes.STRING),
        venue: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING(3),
        environment: DataTypes.ENUM('Indoor', 'Outdoor'),
        surface: DataTypes.ENUM('Clay', 'Carpet', 'Grass', 'Hard'),
        hard_type: DataTypes.STRING,
        final_score: DataTypes.STRING,
        winner_pm: DataTypes.INTEGER,
        winner_pts: DataTypes.INTEGER,
        finalist_pm: DataTypes.INTEGER,
        finalist_pts: DataTypes.INTEGER,
        semifinalist_pm: DataTypes.INTEGER,
        semifinalist_pts: DataTypes.INTEGER,
        quarterfinalist_pm: DataTypes.INTEGER,
        quarterfinalist_pts: DataTypes.INTEGER,
        r16_pm: DataTypes.INTEGER,
        r16_pts: DataTypes.INTEGER,
        r32_pm: DataTypes.INTEGER,
        r32_pts: DataTypes.INTEGER,
        r64_pm: DataTypes.INTEGER,
        r64_pts: DataTypes.INTEGER,
        r128_pm: DataTypes.INTEGER,
        r128_pts: DataTypes.INTEGER
    },
    {
        sequelize,
        modelName: 'Edition'
    })

    return Edition
}