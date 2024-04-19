const db = require('../models')
const MatchStat = db.MatchStat
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    const match = req.body

    MatchStat.create(match)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

// exports.findByEdition = (req, res) => {
//     const { edition } = req.params
//     MatchScore.findAll({
//         where: {
//             EditionId: edition
//         }
//     })
//     .then(response => res.send(response))
//     .catch(error => res.status(500).send(error.message))
// }