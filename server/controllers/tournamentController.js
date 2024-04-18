const db = require('../models')
const Tournament = db.Tournament
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if (!req.body.id) {
        res.status(400).send({
            message: 'Id needs to be completed'
        })
        return
    }

    const tourney = req.body

    Tournament.create(tourney)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findById = (req, res) => {
    const { id } = req.params
    Tournament.findByPk(id)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

// search