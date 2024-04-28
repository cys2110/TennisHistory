const db = require('../models')
const Edition = db.Edition
const Op = db.Sequelize.Op

exports.findByEditionNo = (req, res) => {
    const { edition } = req.params
    Edition.findOne({
        where: {
            edition_no: edition
        },
        include: [
            {
                model: db.Player,
                as: 'winner',
                attributes: ['id', 'first_name', 'last_name', 'full_name', 'headshot', 'country']
            },
            {
                model: db.Player,
                as: 'finalist',
                attributes: ['id', 'first_name', 'last_name', 'full_name', 'headshot', 'country']
            },
            {
                model: db.Entry,
                include: {
                    model: db.Player,
                    attributes: ['id', 'first_name', 'last_name', 'full_name', 'headshot', 'country']
                },
            },
            {
                model: db.MatchScore,
                include: [
                    {
                        model: db.Player,
                        as: 'player1',
                        attributes: ['id', 'first_name', 'last_name', 'headshot', 'country', 'full_name']
                    },
                    {
                        model: db.Player,
                        as: 'player2',
                        attributes: ['id', 'first_name', 'last_name', 'full_name', 'headshot', 'country']
                    },
                    {
                        model: db.Entry,
                        as: 'entry1',
                        attributes: ['seed', 'status']
                    },
                    {
                        model: db.Entry,
                        as: 'entry2',
                        attributes: ['seed', 'status']
                    }
                ]
            },
            {
                model: db.Tournament
            }
        ]
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findUpcoming = (req, res) => {
    const currentDate = new Date()
    Edition.findAll({
        where: {
            end_date: {
                [Op.gte]: currentDate
            }
        },
        order: [['end_date', 'ASC']],
        include: db.Tournament
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
        order: [['start_date', 'ASC']],
        include: db.Tournament
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}