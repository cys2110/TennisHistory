const dbConfig = require('../config/config')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.tournament = require('./tournament')(sequelize, Sequelize)
db.player = require('./player')(sequelize, Sequelize)
db.edition = require('./edition')(sequelize, Sequelize)
db.entry = require('./entry')(sequelize, Sequelize)
db.matchScore = require('./matchScore')(sequelize, Sequelize)
db.wlIndex = require('./wlindex')(sequelize, Sequelize)
db.playerStat = require('./playerStat')(sequelize, Sequelize)
db.matchStat = require('./matchStat')(sequelize, Sequelize)
db.tie = require('./tie')(sequelize, Sequelize)

module.exports = db