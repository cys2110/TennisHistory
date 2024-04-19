const db = require('../models')
const wlIndex = db.WlIndex
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    const index = req.body

    wlIndex.create(index)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findByPlayer = (req, res) => {
    const { player } = req.params

    wlIndex.findOne({
        where: {
            PlayerId: player
        }
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}