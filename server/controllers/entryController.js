const db = require('../models')
const Entry = db.Entry
const Op = db.Sequelize.Op
const { TournamentAttributes, MatchScoreAttributes, PlayerAttributes } = require('./attributes.cjs')

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
                    attributes: ['id', 'edition_no', 'year', 'sponsor_name', 'environment', 'surface', 'hard_type', 'city', 'country', 'start_date', 'end_date', 'category', 'currency'],
                    include: [
                        {
                            model: db.Tournament,
                            as: 'Tournament',
                            attributes: TournamentAttributes
                        }
                    ],
                    order: [['end_date', 'ASC']]
                },
                {
                    model: db.MatchScore,
                    as: 'entry1',
                    attributes: MatchScoreAttributes,
                    include: [
                        {
                            model: db.Entry,
                            as: 'entry1',
                            attributes: ['rank'],
                            include: {
                                model: db.Player,
                                attributes: PlayerAttributes
                            }
                        },
                        {
                            model: db.Entry,
                            as: 'entry2',
                            attributes: ['rank'],
                            include: {
                                model: db.Player,
                                attributes: PlayerAttributes
                            }
                        }
                    ]
                },
                {
                    model: db.MatchScore,
                    as: 'entry2',
                    attributes: MatchScoreAttributes,
                    include: [
                        {
                            model: db.Entry,
                            as: 'entry1',
                            attributes: ['rank'],
                            include: {
                                model: db.Player,
                                attributes: PlayerAttributes
                            }
                        },
                        {
                            model: db.Entry,
                            as: 'entry2',
                            attributes: ['rank'],
                            include: {
                                model: db.Player,
                                attributes: PlayerAttributes
                            }
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