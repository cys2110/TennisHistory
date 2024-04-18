const { DataTypes, Model } = require('sequelize');
const { sequelize, tournament, player, entry, matchScore, tie} = require('.');

module.exports = () => {
    class Edition extends Model {
        static associate (models) {
            Edition.belongsTo(tournament, {foreignKey: 'tournament_id'})
            Edition.belongsTo(player, {foreignKey: {name: 'winner_id', type: DataTypes.STRING}})
            Edition.belongsTo(player, {foreignKey: {name: 'finalist_id', type: DataTypes.STRING}})
            Edition.hasMany(entry)
            Edition.hasMany(matchScore)
            Edition.hasMany(tie)
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
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        category: DataTypes.ENUM('ATP250', 'ATP500', 'ATP1000', 'GS', 'Finals', 'United', 'ATPWS', 'ATPIS', 'ATPISG', 'Davis', 'Olympics', 'Hopman', 'WCT', 'GP', 'S9', 'TMS', 'MS', 'CS', 'CSSW'),
        currency: DataTypes.ENUM('AUD', 'USD', 'GBP', 'EUR'),
        pm: DataTypes.INTEGER,
        tfc: DataTypes.INTEGER,
        supervisors: DataTypes.ARRAY(DataTypes.STRING),
        venue: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING(3),
        environment: DataTypes.ENUM('I', 'O'),
        surface: DataTypes.ENUM('Cl', 'C', 'G', 'H'),
        hard_type: DataTypes.ENUM('L', 'PC', 'PP', 'A', 'G', 'RA', 'O', 'R' ,'DT', 'SM'),
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