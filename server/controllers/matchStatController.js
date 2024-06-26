const db = require('../models')
const { PlayerAttributes, MatchScoreAttributes } = require('./attributes.cjs')
const MatchStat = db.MatchStat
const Op = db.Sequelize.Op
const sequelize = db.sequelize

exports.findMatch = (req, res) => {
    const { id } = req.params
    MatchStat.findOne({
        where: {
            MatchScoreId: id
        },
        attributes: ['id', 'p1_aces', 'p1_dfs', 'p1_serve1', 'p1_total_serve1', 'p1_serve1_pts_w', 'p1_serve1_pts', 'p1_serve2_pts_w', 'p1_serve2_pts', 'p1_bps_saved', 'p1_bps_faced', 'p1_sv_gms', 'p1_ret1_w', 'p1_ret1', 'p1_ret2_w', 'p1_ret2', 'p1_bp_opps', 'p1_bps_converted', 'p1_ret_gms', 'p1_net_w', 'p1_net', 'p1_winners', 'p1_ues', 'p1_sv_pts', 'p1_sv_pts_total', 'p1_ret_pts', 'p1_ret_pts_total', 'p1_pts', 'total_pts', 'p1_max_speed_kph', 'p1_max_speed_mph', 'p1_avg_sv1_kph', 'p1_avg_sv1_mph', 'p1_avg_sv2_kph', 'p1_avg_sv2_mph', 'p2_aces', 'p2_dfs', 'p2_serve1', 'p2_total_serve1', 'p2_serve1_pts_w', 'p2_serve1_pts', 'p2_serve2_pts_w', 'p2_serve2_pts', 'p2_bps_saved', 'p2_bps_faced', 'p2_sv_gms', 'p2_ret1_w', 'p2_ret1', 'p2_ret2_w', 'p2_ret2', 'p2_bp_opps', 'p2_bps_converted', 'p2_ret_gms', 'p2_net_w', 'p2_net', 'p2_winners', 'p2_ues', 'p2_sv_pts', 'p2_sv_pts_total', 'p2_ret_pts', 'p2_ret_pts_total', 'p2_pts', 'p2_max_speed_kph', 'p2_max_speed_mph', 'p2_avg_sv1_kph', 'p2_avg_sv1_mph', 'p2_avg_sv2_kph', 'p2_avg_sv2_mph'],
        include: {
            model: db.MatchScore,
            attributes: ['umpire', 'date', 'duration_mins', ...MatchScoreAttributes],
            include: [
                {
                model: db.Edition,
                attributes: ['id', 'category', 'environment', 'surface', 'hard_type', 'start_date', 'end_date', 'year', 'sponsor_name']
                },
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
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findPlayerStats = async (req, res) => {
    try {
        const { year, player, surface } = req.query

        const whereCondition1 = {
            '$MatchScore.entry1.Player.id$': player
        }

        const whereCondition2 = {
            '$MatchScore.entry2.Player.id$': player
        }

       if (surface !== 'All') {
        whereCondition1['$MatchScore.Edition.surface$'] = surface
        whereCondition2['$MatchScore.Edition.surface$'] = surface
       }
       if (year !== 'Career') {
        whereCondition1['$MatchScore.Edition.year$'] = year
        whereCondition2['$MatchScore.Edition.year$'] = year
       }

       const p1Stats = await MatchStat.findAll({
        attributes: [
            [sequelize.fn('sum', sequelize.col('p1_aces')), 'aces'],
            [sequelize.fn('sum', sequelize.col('p1_dfs')), 'dfs'],
            [sequelize.fn('sum', sequelize.col('p1_serve1')), 'serve1_in'],
            [sequelize.fn('sum', sequelize.col('p1_total_serve1')), 'total_serve1'],
            [sequelize.fn('sum', sequelize.col('p1_serve1_pts_w')), 'serve1_pts_w'],
            [sequelize.fn('sum', sequelize.col('p2_serve1_pts')), 'serve1_pts'],
            [sequelize.fn('sum', sequelize.col('p1_serve2_pts_w')), 'serve2_pts_w'],
            [sequelize.fn('sum', sequelize.col('p1_serve2_pts')), 'serve2_pts'],
            [sequelize.fn('sum', sequelize.col('p1_bps_saved')), 'bps_saved'],
            [sequelize.fn('sum', sequelize.col('p1_bps_faced')), 'bps_faced'],
            [sequelize.fn('sum', sequelize.col('p1_ret1_w')), 'ret1_w'],
            [sequelize.fn('sum', sequelize.col('p1_ret1')), 'ret1'],
            [sequelize.fn('sum', sequelize.col('p1_ret2_w')), 'ret2_w'],
            [sequelize.fn('sum', sequelize.col('p1_ret2')), 'ret2'],
            [sequelize.fn('sum', sequelize.col('p1_bp_opps')), 'bp_opps'],
            [sequelize.fn('sum', sequelize.col('p1_bps_converted')), 'bps_converted'],
            [sequelize.fn('sum', sequelize.col('p1_sv_pts')), 'sv_pts'],
            [sequelize.fn('sum', sequelize.col('p1_sv_pts_total')), 'sv_pts_total'],
            [sequelize.fn('sum', sequelize.col('p1_ret_pts')), 'ret_pts'],
            [sequelize.fn('sum', sequelize.col('p1_ret_pts_total')), 'ret_pts_total'],
            [sequelize.fn('sum', sequelize.col('p1_pts')), 'pts_w'],
            [sequelize.fn('sum', sequelize.col('total_pts')), 'total_pts']
        ],
        where: whereCondition1,
        include: {
            model: db.MatchScore,
            attributes: ['id'],
            include: [
                {
                    model: db.Edition,
                    attributes: ['id']
                },
                {
                    model: db.Entry,
                    as: 'entry1',
                    attributes: [],
                    include: {
                        model: db.Player,
                        attributes: ['id']
                    }
                }
            ]
        },
        group: ['MatchScore.id', 'MatchScore.Edition.id', 'MatchScore.entry1.Player.id'],
        raw: true
       })

       const p2Stats = await MatchStat.findAll({
        attributes: [
            [sequelize.fn('sum', sequelize.col('p2_aces')), 'aces'],
            [sequelize.fn('sum', sequelize.col('p2_dfs')), 'dfs'],
            [sequelize.fn('sum', sequelize.col('p2_serve1')), 'serve1_in'],
            [sequelize.fn('sum', sequelize.col('p2_total_serve1')), 'total_serve1'],
            [sequelize.fn('sum', sequelize.col('p2_serve1_pts_w')), 'serve1_pts_w'],
            [sequelize.fn('sum', sequelize.col('p2_serve1_pts')), 'serve1_pts'],
            [sequelize.fn('sum', sequelize.col('p2_serve2_pts_w')), 'serve2_pts_w'],
            [sequelize.fn('sum', sequelize.col('p2_serve2_pts')), 'serve2_pts'],
            [sequelize.fn('sum', sequelize.col('p2_bps_saved')), 'bps_saved'],
            [sequelize.fn('sum', sequelize.col('p2_bps_faced')), 'bps_faced'],
            [sequelize.fn('sum', sequelize.col('p2_ret1_w')), 'ret1_w'],
            [sequelize.fn('sum', sequelize.col('p2_ret1')), 'ret1'],
            [sequelize.fn('sum', sequelize.col('p2_ret2_w')), 'ret2_w'],
            [sequelize.fn('sum', sequelize.col('p2_ret2')), 'ret2'],
            [sequelize.fn('sum', sequelize.col('p2_bp_opps')), 'bp_opps'],
            [sequelize.fn('sum', sequelize.col('p2_bps_converted')), 'bps_converted'],
            [sequelize.fn('sum', sequelize.col('p2_sv_pts')), 'sv_pts'],
            [sequelize.fn('sum', sequelize.col('p2_sv_pts_total')), 'sv_pts_total'],
            [sequelize.fn('sum', sequelize.col('p2_ret_pts')), 'ret_pts'],
            [sequelize.fn('sum', sequelize.col('p2_ret_pts_total')), 'ret_pts_total'],
            [sequelize.fn('sum', sequelize.col('p2_pts')), 'pts_w'],
            [sequelize.fn('sum', sequelize.col('total_pts')), 'total_pts']
        ],
        where: whereCondition2,
            include: {
                model: db.MatchScore,
                attributes: ['id'],
                include: [
                    {
                        model: db.Edition,
                        as: 'Edition',
                        attributes: ['id']
                    },
                    {
                        model: db.Entry,
                        as: 'entry2',
                        attributes: [],
                        include: {
                            model: db.Player,
                            attributes: ['id']
                        }
                    }
                ]
            },
            group: ['MatchScore.id', 'MatchScore.Edition.id', 'MatchScore.entry2.Player.id'],
        raw: true
       })

       const summedP1 = p1Stats.reduce((acc, cur) => {
            Object.keys(cur).forEach(key => {
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += +cur[key];
            });
            return acc;
        }, {})

        const summedP2 = p2Stats.reduce((acc, cur) => {
            Object.keys(cur).forEach(key => {
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += +cur[key];
            });
            return acc;
        }, {})

       function addStats(p1, p2) {
            const result = {}
            for (const key in p1) {
                result[key] = parseInt(p1[key]) + parseInt(p2[key])
            }
            return result
       }

       let stats

       if (p1Stats && p2Stats) {
        stats = addStats(summedP1, summedP2)
       } else if (p1Stats) {
        stats = summedP1
       } else if (p2Stats) {
        stats = summedP2
       }

        const response = {
            stats
        }

        res.json(response)
    } catch (error) {
        res.status(500).send(error.message)
    }
}