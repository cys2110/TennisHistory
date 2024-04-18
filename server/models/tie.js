const { DataTypes, Model } = require('sequelize');
const { sequelize, edition} = require('.');

module.exports = () => {
    class Tie extends Model {
        static associate (models) {
            Tie.belongsTo(edition, {targetKey: 'edition_no', foreignKey: 'edition'})
        }
    }
    Tie.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        round: DataTypes.ENUM('QF', 'SF', 'HCF', 'F', 'G'),
        country1: DataTypes.STRING(3),
        coutrny2: DataTypes.STRING(3),
        winner: DataTypes.STRING(3),
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        venue: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING(3),
        environment: DataTypes.ENUM('I', 'O'),
        surface: DataTypes.ENUM('Cl', 'C', 'G', 'H'),
        hard_type: DataTypes.ENUM('L', 'PC', 'PP', 'A', 'G', 'RA', 'O', 'R' ,'DT', 'SM'),
        score: DataTypes.STRING
    },
    {
        sequelize,
        modelName: 'Tie'
    })

    return Tie
}