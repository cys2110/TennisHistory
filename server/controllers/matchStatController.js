const db = require('../models')
const MatchStat = db.MatchStat
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    const match = req.body

    MatchStat.create(match)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findMatch = (req, res) => {
    const { id } = req.params
    MatchStat.findOne({
        where: {
            MatchScoreId: id
        },
        include: {
            model: db.MatchScore,
            include: [
                {
                model: db.Edition,
                include: {
                    model: db.Tournament,
                    attributes: ['name', 'id']
                },
                attributes: ['id', 'category', 'environment', 'surface', 'hard_type', 'start_date', 'end_date', 'year', 'sponsor_name']
                },
                {
                    model: db.Player,
                    as: 'player1',
                    attributes: ['id', 'first_name', 'last_name', 'full_name', 'country', 'headshot']
                },
                {
                    model: db.Player,
                    as: 'player2',
                    attributes: ['id', 'first_name', 'last_name', 'full_name', 'country', 'headshot']
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
        }
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}