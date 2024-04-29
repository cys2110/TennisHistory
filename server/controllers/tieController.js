const db = require('../models')
const Tie = db.Tie
const Op = db.Sequelize.Op

exports.findTie = (req, res) => {
    Tie.findByPk(1, {
        include: db.MatchScore
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}