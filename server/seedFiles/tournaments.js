const db = require('../models')
const Player = db.Edition
const Op = db.Sequelize.Op
const players = require('./tennis_edition.json')

const seedTournaments = async() => {
    const tournamentsArray = await Player.bulkCreate(players)
}

seedTournaments()