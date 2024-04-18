const db = require('../models')
const Edition = db.Edition
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if (!req.body.id) {
        res.status(400).send({
            message: 'Id needs to be completed'
        })
        return
    }

    const edition = req.body

    Edition.create(edition)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

// exports.findAll = (req, res) => {
//     Tournament.findAll({})
//     .then(response => res.send(response))
//     .catch(error => res.status(500).send(error.message))
// }