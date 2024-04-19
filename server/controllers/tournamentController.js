const db = require('../models')
const Tournament = db.Tournament
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if (!req.body.id) {
        res.status(400).send({
            message: 'Id needs to be completed'
        })
        return
    }

    const tourney = req.body

    Tournament.create(tourney)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findById = (req, res) => {
    const { id } = req.params
    Tournament.findByPk(id, {
        include: {
            model: db.Edition,
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
                }
            ]
        }
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.search = async (req, res) => {
    try {
        const { search } = req.params
        const tournaments = await Tournament.findAll({
            where: {
                name: {
                    [Op.iRegexp]: search
                }
            }
        })
        const players = await db.Player.findAll({
            where: {
                last_name: {
                    [Op.iRegexp]: search
                }
            }
        })
        const response = {
            tournaments: tournaments,
            players: players
        }
        res.send(response)
    } catch (error) {
        res.status(500).send(error.message)
    }
}