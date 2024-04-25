const dbConfig = require('../config/config')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.Tournament = require('./tournament')(sequelize, db)
db.Player = require('./player')(sequelize, db)
db.Edition = require('./edition')(sequelize, db)
db.Entry = require('./entry')(sequelize, db)
db.MatchScore = require('./matchScore')(sequelize, db)
db.WlIndex = require('./wlindex')(sequelize, db)
db.PlayerStat = require('./playerStat')(sequelize, db)
db.MatchStat = require('./matchStat')(sequelize, db)
db.Tie = require('./tie')(sequelize, db)

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db