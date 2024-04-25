const db = require('../models')
const playerStat = db.PlayerStat
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    const stats = req.body

    playerStat.create(stats)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findPlayerStat = (req, res) => {
    const { player } = req.params
    const { year, surface } = req.query
    
    playerStat.findOne({
        where: {
            PlayerId: player,
            year: year,
            surface: surface
        }
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}