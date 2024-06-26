const db = require('../models')
const MatchScore = db.MatchScore
const Op = db.Sequelize.Op
const Sequelize = db.sequelize
const { TournamentAttributes, MatchScoreAttributes } = require('./attributes.cjs')

exports.findByEdition = (req, res) => {
    const { edition } = req.params
    MatchScore.findAll({
        where: {
            EditionId: edition
        }
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findH2H = async (req, res) => {
    try {
        const { player1, player2 } = req.query

        const matches = await MatchScore.findAll({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            {
                                '$entry1.Player.id$': player1,
                                '$entry2.Player.id$': player2
                            }
                        ]
                    },
                    {
                        [Op.and]: [
                            {
                                '$entry2.Player.id$': player1,
                                '$entry1.Player.id$': player2
                            }
                        ]
                    }
                ]
            },
            attributes: MatchScoreAttributes,
            include: [
                {
                    model: db.Edition,
                    attributes: ['year', 'environment', 'surface', 'id', 'edition_no'],
                    include: {
                        model: db.Tournament,
                        attributes: TournamentAttributes
                    }
                },
                {
                    model: db.Entry,
                    as: 'entry1',
                    attributes: [],
                    include: {
                        model: db.Player,
                        attributes: []
                    }
                },
                {
                    model: db.Entry,
                    as: 'entry2',
                    attributes: [],
                    include: {
                        model: db.Player,
                        attributes: []
                    }
                }
            ],
            order: [[db.Edition, 'start_date', 'ASC']]
        })

        const p1Wins = await MatchScore.count({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {
                                '$entry1.Player.id$': player1,
                                '$entry2.Player.id$': player2
                            },
                            {
                                '$entry1.Player.id$': player2,
                                '$entry2.Player.id$': player1
                            }
                        ]
                    },
                    {
                        winner_id: player1
                    }
                ]
            },
            include: [
                {
                    model: db.Entry,
                    as: 'entry1',
                    include: [
                        {
                            model: db.Player,
                            attributes: []
                        }
                    ]
                },
                {
                    model: db.Entry,
                    as: 'entry2',
                    include: [
                        {
                            model: db.Player,
                            attributes: []
                        }
                    ]
                }
            ]
        })

        const p2Wins = await MatchScore.count({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {
                                '$entry1.Player.id$': player1,
                                '$entry2.Player.id$': player2
                            },
                            {
                                '$entry1.Player.id$': player2,
                                '$entry2.Player.id$': player1
                            }
                        ]
                    },
                    {
                        winner_id: player2
                    }
                ]
            },
            include: [
                {
                    model: db.Entry,
                    as: 'entry1',
                    include: [
                        {
                            model: db.Player,
                            attributes: []
                        }
                    ]
                },
                {
                    model: db.Entry,
                    as: 'entry2',
                    include: [
                        {
                            model: db.Player,
                            attributes: []
                        }
                    ]
                }
            ]
        })

        const total = await MatchScore.count({
            where: {
                [Op.or]: [
                    {
                        '$entry1.Player.id$': player1,
                        '$entry2.Player.id$': player2
                    },
                    {
                        '$entry1.Player.id$': player2,
                        '$entry2.Player.id$': player1
                    }
                ]
            },
            include: [
                {
                    model: db.Entry,
                    as: 'entry1',
                    include: [
                        {
                            model: db.Player,
                            attributes: []
                        }
                    ]
                },
                {
                    model: db.Entry,
                    as: 'entry2',
                    include: [
                        {
                            model: db.Player,
                            attributes: []
                        }
                    ]
                }
            ]
        })

        const count = {p1Wins, p2Wins, total}

        const response = {
            matches,
            count
        }

        res.send(response)

    } catch (error) {
        console.log(error)
    }
}

exports.wlIndex = async(req, res) => {
    try {
        const { player } = req.params

        const tbs = [];
        for (let i = 1; i <= 5; i++) {
            tbs.push([
                Sequelize.literal(`SUM(CASE WHEN "entry1->Player".id = :player AND t${i}p1 > t${i}p2 THEN 1 ELSE 0 END)`),
                `p1tb${i}Wins`
            ]);
            tbs.push([Sequelize.literal(`SUM(CASE WHEN "entry2->Player".id = :player AND t${i}p2 > t${i}p1 THEN 1 ELSE 0 END)`),
            `p2tb${i}Wins`])
            tbs.push([Sequelize.literal(`SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND t${i}p1 IS NOT NULL THEN 1 ELSE 0 END)`), `total${i}Tbs`])
        }

        const index = await MatchScore.findAll({
            attributes: [
                [Sequelize.literal('SUM(CASE WHEN "MatchScore".winner_id = :player THEN 1 ELSE 0 END)'), 'overallWins'],
                [Sequelize.literal('SUM(CASE WHEN "entry1->Player"."id" = :player OR "entry2->Player".id = :player THEN 1 ELSE 0 END)'), 'overallTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore".winner_id = :player AND round = \'F\' THEN 1 ELSE 0 END)'), 'overallTitles'],
                [Sequelize.literal('SUM(CASE WHEN round = \'F\' AND ("entry1->Player".id = :player OR "entry2->Player".id = :player) THEN 1 ELSE 0 END)'), 'finalsTotal'],
                [Sequelize.literal('SUM(CASE WHEN s5p1 IS NOT NULL AND "MatchScore".winner_id = :player THEN 1 ELSE 0 END)'), 'set5Wins'],
                [Sequelize.literal('SUM(CASE WHEN s5p1 IS NOT NULL AND ("entry1->Player".id = :player OR "entry2->Player".id = :player) THEN 1 ELSE 0 END)'), 'set5Total'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore".winner_id = :player AND ("entry1->Player".id = :player AND s1p1 > s1p2 OR "entry2->Player".id = :player AND s1p2 > s1p1) THEN 1 ELSE 0 END)'), 'win1Wins'],
                [Sequelize.literal('SUM(CASE WHEN "entry1->Player".id = :player AND s1p1 > s1p2 OR "entry2->Player".id = :player AND s1p2 > s1p1 THEN 1 ELSE 0 END)'), 'win1Total'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore".winner_id = :player AND ("entry1->Player".id = :player AND s1p2 > s1p1 OR "entry2->Player".id = :player AND s1p1 > s1p2) THEN 1 ELSE 0 END)'), 'lose1Wins'],
                [Sequelize.literal('SUM(CASE WHEN "entry1->Player".id = :player AND s1p2 > s1p1 OR "entry2->Player".id = :player AND s1p1 > s1p2 THEN 1 ELSE 0 END)'), 'lose1Total'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore".winner_id = :player AND (s5p1 IS NOT NULL OR (s3p1 IS NOT NULL AND s4p1 IS NULL)) THEN 1 ELSE 0 END)'), 'decidersWins'],
                [Sequelize.literal('SUM(CASE WHEN (s5p1 IS NOT NULL OR (s3p1 IS NOT NULL AND s4p1 IS NULL)) AND ("entry1->Player".id = :player OR "entry2->Player".id = :player) THEN 1 ELSE 0 END)'), 'decidersTotal'],
                ...tbs,
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "Edition"."surface" = \'Clay\' THEN 1 ELSE 0 END)'), 'clayWins'],
                [Sequelize.literal('SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND "Edition"."surface" = \'Clay\' THEN 1 ELSE 0 END)'), 'clayTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "MatchScore"."round" = \'F\' AND "Edition"."surface" = \'Clay\' THEN 1 ELSE 0 END)'), 'clayTitles'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "Edition"."surface" = \'Grass\' THEN 1 ELSE 0 END)'), 'grassWins'],
                [Sequelize.literal('SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND "Edition"."surface" = \'Grass\' THEN 1 ELSE 0 END)'), 'grassTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "MatchScore"."round" = \'F\' AND "Edition"."surface" = \'Grass\' THEN 1 ELSE 0 END)'), 'grassTitles'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "Edition"."surface" = \'Carpet\' THEN 1 ELSE 0 END)'), 'carpetWins'],
                [Sequelize.literal('SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND "Edition"."surface" = \'Carpet\' THEN 1 ELSE 0 END)'), 'carpetTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "MatchScore"."round" = \'F\' AND "Edition"."surface" = \'Carpet\' THEN 1 ELSE 0 END)'), 'carpetTitles'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "Edition"."surface" = \'Hard\' THEN 1 ELSE 0 END)'), 'hardWins'],
                [Sequelize.literal('SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND "Edition"."surface" = \'Hard\' THEN 1 ELSE 0 END)'), 'hardTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "MatchScore"."round" = \'F\' AND "Edition"."surface" = \'Hard\' THEN 1 ELSE 0 END)'), 'hardTitles'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "Edition"."environment" = \'Indoor\' THEN 1 ELSE 0 END)'), 'indoorWins'],
                [Sequelize.literal('SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND "Edition"."environment" = \'Indoor\' THEN 1 ELSE 0 END)'), 'indoorTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "MatchScore"."round" = \'F\' AND "Edition"."environment" = \'Indoor\' THEN 1 ELSE 0 END)'), 'indoorTitles'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "Edition"."environment" = \'Outdoor\' THEN 1 ELSE 0 END)'), 'outdoorWins'],
                [Sequelize.literal('SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND "Edition"."environment" = \'Outdoor\' THEN 1 ELSE 0 END)'), 'outdoorTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "MatchScore"."round" = \'F\' AND "Edition"."environment" = \'Outdoor\' THEN 1 ELSE 0 END)'), 'outdoorTitles'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "Edition"."category" = \'Grand Slam\' THEN 1 ELSE 0 END)'), 'gsWins'],
                [Sequelize.literal('SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND "Edition"."category" = \'Grand Slam\' THEN 1 ELSE 0 END)'), 'gsTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "MatchScore"."round" = \'F\' AND "Edition"."category" = \'Grand Slam\' THEN 1 ELSE 0 END)'), 'gsTitles'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "Edition"."category" = \'ATP Masters 1000\' THEN 1 ELSE 0 END)'), 'mastersWins'],
                [Sequelize.literal('SUM(CASE WHEN ("entry1->Player".id = :player OR "entry2->Player".id = :player) AND "Edition"."category" = \'ATP Masters 1000\' THEN 1 ELSE 0 END)'), 'mastersTotal'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "MatchScore"."round" = \'F\' AND "Edition"."category" = \'ATP Masters 1000\' THEN 1 ELSE 0 END)'), 'mastersTitles'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "entry1->Player".id = :player AND "entry2"."rank" <= 10 THEN 1 ELSE 0 END)'), 'v10Wins1'],
                [Sequelize.literal('SUM(CASE WHEN "entry1->Player".id = :player AND "entry2"."rank" <=10 THEN 1 ELSE 0 END)'), 'v10Total1'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "entry2->Player".id = :player AND "entry1"."rank" <= 10 THEN 1 ELSE 0 END)'), 'v10Wins2'],
                [Sequelize.literal('SUM(CASE WHEN "entry2->Player".id = :player AND "entry1"."rank" <=10 THEN 1 ELSE 0 END)'), 'v10Total2'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "entry1->Player".id = :player AND "entry2->Player"."rh" = TRUE THEN 1 ELSE 0 END)'), 'rhWins1'],
                [Sequelize.literal('SUM(CASE WHEN "entry1->Player".id = :player AND "entry2->Player"."rh" = TRUE THEN 1 ELSE 0 END)'), 'rhTotal1'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "entry2->Player".id = :player AND "entry1->Player"."rh" = TRUE THEN 1 ELSE 0 END)'), 'rhWins2'],
                [Sequelize.literal('SUM(CASE WHEN "entry2->Player".id = :player AND "entry1->Player"."rh" = TRUE THEN 1 ELSE 0 END)'), 'rhTotal2'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "entry1->Player".id = :player AND "entry2->Player"."rh" = FALSE THEN 1 ELSE 0 END)'), 'lhWins1'],
                [Sequelize.literal('SUM(CASE WHEN "entry1->Player".id = :player AND "entry2->Player"."rh" = FALSE THEN 1 ELSE 0 END)'), 'lhTotal1'],
                [Sequelize.literal('SUM(CASE WHEN "MatchScore"."winner_id" = :player AND "entry2->Player".id = :player AND "entry1->Player"."rh" = FALSE THEN 1 ELSE 0 END)'), 'lhWins2'],
                [Sequelize.literal('SUM(CASE WHEN "entry2->Player".id = :player AND "entry1->Player"."rh" = FALSE THEN 1 ELSE 0 END)'), 'lhTotal2']
            ],
            include: [
                {
                    model: db.Entry,
                    as: 'entry1',
                    attributes: [],
                    include: {
                        model: db.Player,
                        attributes: []
                    }
                },
                {
                    model: db.Entry,
                    as: 'entry2',
                    attributes: [],
                    include: {
                        model: db.Player,
                        attributes: []
                    }
                },
                {
                    model: db.Edition,
                    attributes: []
                }
            ],
            replacements: { player },
            raw: true
        })

        res.json(index)

    } catch (error) {
        console.log(error)
    }
}