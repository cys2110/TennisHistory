const db = require('../models')
const Edition = db.Edition
const Op = db.Sequelize.Op
const { TournamentAttributes, EditionAttributes, PlayerAttributes, MatchScoreAttributes } = require('./attributes.cjs')

exports.findByEditionNo = (req, res) => {
    const { edition } = req.params
    Edition.findOne({
        where: {
            edition_no: edition
        },
        attributes: ['id', 'edition_no', 'sponsor_name', 'category', 'city', 'country', 'start_date', 'end_date', 'environment', 'surface', 'hard_type', 'year', 'type_of_draw', 'currency', 'pm', 'tfc', 'supervisors', 'venue', 'winner_pm', 'winner_pts', 'finalist_pm', 'finalist_pts', 'semifinalist_pm', 'semifinalist_pts', 'quarterfinalist_pm', 'quarterfinalist_pts', 'r16_pm', 'r16_pts', 'r32_pm', 'r32_pts', 'r64_pm', 'r64_pts', 'r128_pm', 'r128_pts'],
        include: [
            {
                model: db.Entry,
                attributes: ['rank', 'seed', 'status', 'wd', 'ret', 'wo', 'lda', 'defaulted'],
                include: {
                    model: db.Player,
                    attributes: PlayerAttributes
                },
            },
            {
                model: db.MatchScore,
                attributes: ['match_no', 'umpire', 'date', 'duration_mins', ...MatchScoreAttributes],
                include: [
                    {
                        model: db.Entry,
                        as: 'entry1',
                        attributes: ['seed', 'status'],
                        include: {
                            model: db.Player,
                            attributes: PlayerAttributes
                        }
                    },
                    {
                        model: db.Entry,
                        as: 'entry2',
                        attributes: ['seed', 'status'],
                        include: {
                            model: db.Player,
                            attributes: PlayerAttributes
                        }
                    }
                ]
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
        attributes: ['id', 'sponsor_name', 'category', 'environment', 'surface', 'hard_type', 'city', 'country', 'start_date', 'end_date', 'edition_no'],
        include: {
            model: db.Tournament,
            attributes: TournamentAttributes
        }
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
        attributes: EditionAttributes,
        order: [['start_date', 'ASC']],
        include: {
            model: db.Tournament,
            attributes: TournamentAttributes
        }
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
        attributes: ['id', 'edition_no', 'sponsor_name', 'year', 'environment', 'surface', 'hard_type', 'winner_id', 'finalist_id'],
        order: [['edition_no', 'ASC']],
        include: {
            model: db.Tournament,
            attributes: TournamentAttributes
        }
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}