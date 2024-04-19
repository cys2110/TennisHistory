const db = require('../models')
const Player = db.Player
const Op = db.Sequelize.Op

exports.create = (req,res) => {
    if (!req.body.id) {
        res.status(400).send({
            message: 'Id needs to be completed'
        })
        return
    }
    const player = req.body

    Player.create(player)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findById = (req, res) => {
    const { id } = req.params
    Player.findByPk(id)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}