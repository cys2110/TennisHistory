const db = require('../models')
const Edition = db.Edition
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    const edition = req.body

    Edition.create(edition)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findById = (req, res) => {
    const { id } = req.params
    Edition.findByPk(id)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findUpcoming = (req, res) => {
    const currentDate = new Date()
    Edition.findAll({
        where: {
            end_date: {
                [Op.gt]: currentDate
            }
        },
        order: [['end_date', 'ASC']]
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findByYear = (req, res) => {
    const { year } = req.params
    Edition.findAll({
        where: {
            year: year
        },
        order: [['start_date', 'ASC']],
        include: db.Tournament
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findByPlayer = (req, res) => {
    const { player } = req.params
    Edition.findAll({
        where: {
            [Op.or]: [{winner_id: player}, {finalist_id: player}]
        },
        order: [['start_date', 'ASC']]
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}