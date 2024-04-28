const db = require('../models')
const Tournament = db.Tournament
const Op = db.Sequelize.Op

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
            where: db.sequelize.literal(`first_name || ' ' || last_name ILIKE '%${search}%'`)
        })
        const response = {
            tournaments,
            players
        }
        res.send(response)
    } catch (error) {
        res.status(500).send(error.message)
    }
}