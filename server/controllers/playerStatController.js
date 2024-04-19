const db = require('../models')
const playerStat = db.PlayerStat
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    const stats = req.body

    playerStat.create(stats)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}