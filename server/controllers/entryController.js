const db = require('../models')
const Entry = db.Entry
const Op = db.Sequelize.Op

exports.create = (req, res) => {

    const entry = req.body

    Entry.create(entry)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}