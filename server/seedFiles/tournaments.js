const db = require('../models')
const Player = db.MatchScore
const Op = db.Sequelize.Op
const players = require('./tennis_matchscore.json')

const seedTournaments = async() => {
    const tournamentsArray = await Player.bulkCreate(players)
}

seedTournaments()