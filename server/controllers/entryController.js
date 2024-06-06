const db = require('../models')
const Entry = db.Entry
const Op = db.Sequelize.Op

exports.getEntriesByPlayer = async (req, res) => {
    try {
        const { player, year } = req.query

        const winCount = await db.MatchScore.count({
            include: db.Edition,
            where: {
                '$Edition.year$': year,
                [Op.or]: [
                    {p1: player},
                    {p2: player}
                ],
                winner_id: player,
                incomplete: {
                    [Op.or]: [null, 'D', 'R']
                }
            }
        })

        const loseCount = await db.MatchScore.count({
            include: db.Edition,
            where: {
                '$Edition.year$': year,
                [Op.or]: [
                    {p1: player},
                    {p2: player}
                ],
                winner_id: {
                    [Op.not]: player
                },
                incomplete: {
                    [Op.or]: [null, 'D', 'R']
                }
            }
        })

        const titles = await db.Edition.count({
            where: {
                winner_id: player,
                year: year
            }
        })

        const entries = await Entry.findAll({
            include: [
                {
                    model: db.Edition,
                    as: 'Edition',
                    attributes: ['id', 'year', 'sponsor_name', 'environment', 'surface', 'hard_type', 'city', 'country', 'start_date', 'end_date', 'category', 'currency'],
                    include: [
                        {
                            model: db.Tournament,
                            as: 'Tournament',
                            attributes: ['name', 'id']
                        }
                    ],
                    order: [['end_date', 'ASC']]
                },
                {
                    model: db.MatchScore,
                    as: 'entry1',
                    attributes: ['round', 'incomplete', 's1p1', 's1p2', 't1p1', 't1p2', 's2p1', 's2p2', 't2p1', 't2p2', 's3p1', 's3p2', 't3p1', 't3p2', 's4p1', 's4p2', 't4p1', 't4p2', 's5p1', 's5p2', 't5p1', 't5p2', 'winner_id', 'id'],
                    include: [
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
                            attributes: ['rank']
                        },
                        {
                            model: db.Entry,
                            as: 'entry2',
                            attributes: ['rank']
                        }
                    ]
                },
                {
                    model: db.MatchScore,
                    as: 'entry2',
                    attributes: ['round', 'incomplete', 's1p1', 's1p2', 't1p1', 't1p2', 's2p1', 's2p2', 't2p1', 't2p2', 's3p1', 's3p2', 't3p1', 't3p2', 's4p1', 's4p2', 't4p1', 't4p2', 's5p1', 's5p2', 't5p1', 't5p2', 'winner_id', 'id'],
                    include: [
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
                            attributes: ['rank']
                        },
                        {
                            model: db.Entry,
                            as: 'entry2',
                            attributes: ['rank']
                        }
                    ]
                }
            ],
            where: {
                PlayerId: player,
                '$Edition.year$': year,
                wd: null
            },
            attributes: ['rank', 'points', 'pm', 'id']
        })

        const prizeMoney = entries.reduce((total, entry) => total + entry.pm, 0)

        const response = {
            wins: winCount,
            losses: loseCount,
            titles: titles,
            entries: entries,
            pm: prizeMoney
        }
        res.send(response)
    } catch (error) {
        res.status(500).send(error.message)
    }
}