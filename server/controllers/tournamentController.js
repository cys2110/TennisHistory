const db = require('../models')
const Tournament = db.Tournament
const Op = db.Sequelize.Op

exports.findById = (req, res) => {
    const { id } = req.params
    Tournament.findByPk(id, {
        attributes: ['id', 'name', 'start_year', 'end_year', 'website'],
        include: {
            model: db.Edition,
            attributes: ['id', 'edition_no', 'year', 'final_score', 'end_date'],
            include: [
                {
                    model: db.Player,
                    as: 'winner',
                    attributes: ['id', 'first_name', 'last_name', 'full_name', 'country']
                },
                {
                    model: db.Player,
                    as: 'finalist',
                    attributes: ['id', 'first_name', 'last_name', 'full_name', 'country']
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
            },
            attributes: ['id', 'name']
        })
        const players = await db.Player.findAll({
            where: db.sequelize.literal(`first_name || ' ' || last_name ILIKE '%${search}%'`),
            attributes: ['id', 'first_name', 'last_name', 'full_name', 'country']
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