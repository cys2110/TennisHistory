const db = require('../models')
const Player = db.Player
const Op = db.Sequelize.Op
const { PlayerAttributes } = require('./attributes.cjs')

exports.findById = (req, res) => {
    const { id } = req.params
    Player.findByPk(id)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findByName = (req, res) => {
    const { player } = req.params
    Player.findAll({
        where: db.sequelize.literal(`first_name || ' ' || last_name ILIKE '%${player}%'`),
        attributes: PlayerAttributes
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}