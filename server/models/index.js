const dotenv = require('dotenv')
dotenv.config()
const config = require('../config/config')
const Sequelize = require('sequelize')
// const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.PASSWORD, {
//     host: process.env.HOST,
//     dialect: process.env.dialect
// })

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.Tournament = require('./tournament')(sequelize, db)
db.Player = require('./player')(sequelize, db)
db.Edition = require('./edition')(sequelize, db)
db.Entry = require('./entry')(sequelize, db)
db.MatchScore = require('./matchScore')(sequelize, db)
db.MatchStat = require('./matchStat')(sequelize, db)
db.Tie = require('./tie')(sequelize, db)
db.NonCount = require('./nonCount')(sequelize, db)
db.WTA = require('./wta')(sequelize, db)

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db