const db = require('../models')
const Edition = db.Edition
const Op = db.Sequelize.Op

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
                    attributes: ['id', 'first_name', 'last_name', 'full_name', 'country']
                },
            },
            {
                model: db.MatchScore,
                attributes: ['id', 'match_no', 'round', 'incomplete', 'umpire', 'date', 'duration_mins', 's1p1', 's1p2', 't1p1', 't1p2', 's2p1', 's2p2', 't2p1', 't2p2', 's3p1', 's3p2', 't3p1', 't3p2', 's4p1', 's4p2', 't4p1', 't4p2', 's5p1', 's5p2', 't5p1', 't5p2', 'winner_id'],
                include: [
                    {
                        model: db.Player,
                        as: 'player1',
                        attributes: ['id', 'first_name', 'last_name', 'country', 'full_name']
                    },
                    {
                        model: db.Player,
                        as: 'player2',
                        attributes: ['id', 'first_name', 'last_name', 'full_name', 'country']
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
            attributes: ['id', 'name']
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
        attributes: ['id', 'edition_no', 'sponsor_name', 'year', 'start_date', 'end_date', 'category', 'city', 'country', 'environment', 'surface', 'hard_type'],
        order: [['start_date', 'ASC']],
        include: {
            model: db.Tournament,
            attributes: ['id', 'name']
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
        order: [['start_date', 'ASC']],
        include: db.Tournament
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}