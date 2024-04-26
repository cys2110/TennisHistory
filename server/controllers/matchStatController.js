const db = require('../models')
const MatchStat = db.MatchStat
const Op = db.Sequelize.Op
const sequelize = db.sequelize

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

exports.findPlayerStats = async (req, res) => {
    try {
        const { year, player, surface } = req.query

        const whereCondition1 = {
            p1: player
        }

        const whereCondition2 = {
            p2: player
        }

       if (surface) {
        whereCondition1['$MatchScore.Edition.surface$'] = surface
        whereCondition2['$MatchScore.Edition.surface$'] = surface
       }
       if (year) {
        whereCondition1['$MatchScore.Edition.year$'] = year
        whereCondition2['$MatchScore.Edition.year$'] = year
       }

       const p1Stats = await MatchStat.findOne({
        attributes: [
            [sequelize.fn('sum', sequelize.col('p1_aces')), 'total_aces'],
            [sequelize.fn('sum', sequelize.col('p1_dfs')), 'total_dfs'],
            [sequelize.fn('sum', sequelize.col('p1_serve1')), 'total_serve1'],
            [sequelize.fn('sum', sequelize.col('p1_total_serve1')), 'total_serve1'],
            [sequelize.fn('sum', sequelize.col('p1_serve1_pts_w')), 'total_serve1_pts_w'],
            [sequelize.fn('sum', sequelize.col('p1_serve2_pts_w')), 'total_serve2_pts_w'],
            [sequelize.fn('sum', sequelize.col('p1_serve2_pts')), 'total_serve2_pts'],
            [sequelize.fn('sum', sequelize.col('p1_bps_saved')), 'total_bps_saved'],
            [sequelize.fn('sum', sequelize.col('p1_bps_faced')), 'total_bps_faced'],
            [sequelize.fn('sum', sequelize.col('p1_ret1_w')), 'total_ret1_w'],
            [sequelize.fn('sum', sequelize.col('p1_ret1')), 'total_ret1'],
            [sequelize.fn('sum', sequelize.col('p1_ret2_w')), 'total_ret2_w'],
            [sequelize.fn('sum', sequelize.col('p1_ret2')), 'total_ret2'],
            [sequelize.fn('sum', sequelize.col('p1_bp_opps')), 'total_bp_opps'],
            [sequelize.fn('sum', sequelize.col('p1_bps_converted')), 'total_bps_converted'],
            [sequelize.fn('sum', sequelize.col('p1_sv_pts')), 'total_sv_pts'],
            [sequelize.fn('sum', sequelize.col('p1_sv_pts_total')), 'total_sv_pts_total'],
            [sequelize.fn('sum', sequelize.col('p1_ret_pts')), 'total_ret_pts'],
            [sequelize.fn('sum', sequelize.col('p1_ret_pts_total')), 'total_ret_pts_total'],
            [sequelize.fn('sum', sequelize.col('p1_pts')), 'total_pts_w'],
            [sequelize.fn('sum', sequelize.col('total_pts')), 'total_pts']
        ],
        where: whereCondition1,
            include: {
                model: db.MatchScore,
                attributes: ['id'],
                include: {
                    model: db.Edition,
                    as: 'Edition',
                    attributes: ['id']
                }
            },
            group: ['MatchScore.id', 'MatchScore.Edition.id']
       })

       const p2Stats = await MatchStat.findOne({
        attributes: [
            [sequelize.fn('sum', sequelize.col('p2_aces')), 'total_aces'],
            [sequelize.fn('sum', sequelize.col('p2_dfs')), 'total_dfs'],
            [sequelize.fn('sum', sequelize.col('p2_serve1')), 'total_serve1'],
            [sequelize.fn('sum', sequelize.col('p2_total_serve1')), 'total_serve1'],
            [sequelize.fn('sum', sequelize.col('p2_serve1_pts_w')), 'total_serve1_pts_w'],
            [sequelize.fn('sum', sequelize.col('p2_serve2_pts_w')), 'total_serve2_pts_w'],
            [sequelize.fn('sum', sequelize.col('p2_serve2_pts')), 'total_serve2_pts'],
            [sequelize.fn('sum', sequelize.col('p2_bps_saved')), 'total_bps_saved'],
            [sequelize.fn('sum', sequelize.col('p2_bps_faced')), 'total_bps_faced'],
            [sequelize.fn('sum', sequelize.col('p2_ret1_w')), 'total_ret1_w'],
            [sequelize.fn('sum', sequelize.col('p2_ret1')), 'total_ret1'],
            [sequelize.fn('sum', sequelize.col('p2_ret2_w')), 'total_ret2_w'],
            [sequelize.fn('sum', sequelize.col('p2_ret2')), 'total_ret2'],
            [sequelize.fn('sum', sequelize.col('p2_bp_opps')), 'total_bp_opps'],
            [sequelize.fn('sum', sequelize.col('p2_bps_converted')), 'total_bps_converted'],
            [sequelize.fn('sum', sequelize.col('p2_sv_pts')), 'total_sv_pts'],
            [sequelize.fn('sum', sequelize.col('p2_sv_pts_total')), 'total_sv_pts_total'],
            [sequelize.fn('sum', sequelize.col('p2_ret_pts')), 'total_ret_pts'],
            [sequelize.fn('sum', sequelize.col('p2_ret_pts_total')), 'total_ret_pts_total'],
            [sequelize.fn('sum', sequelize.col('p2_pts')), 'total_pts_w'],
            [sequelize.fn('sum', sequelize.col('total_pts')), 'total_pts']
        ],
        where: whereCondition2,
            include: {
                model: db.MatchScore,
                attributes: ['id'],
                include: {
                    model: db.Edition,
                    as: 'Edition',
                    attributes: ['id']
                }
            },
            group: ['MatchScore.id', 'MatchScore.Edition.id']
       })

       function addStats(p1, p2) {
        const result = {}
        for (const key in p1) {
            if (p1.hasOwnProperty(key) && p2.hasOwnProperty(key)) {
                result[key] = parseInt(p1[key]) + parseInt(p2[key])
            }
        }
       }

       let stats

       if (p1Stats && p2Stats) {
        stats = addStats(p1Stats, p2Stats)
       } else if (p1Stats) {
        stats = p1Stats
       } else if (p2Stats) {
        stats = p2Stats
       }

        const response = {
            stats
        }

        res.json(response)
    } catch (error) {
        res.status(500).send(error.message)
    }
}