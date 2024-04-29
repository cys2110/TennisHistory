const db = require('../models')
const Tie = db.Tie
const Op = db.Sequelize.Op

exports.findTieByEdition = (req, res) => {
    const { edition } = req.params
    Tie.findAll({
        where: {
            EditionId: edition
        },
        include: [
            {
                model: db.MatchScore,
                include: [
                    {
                        model: db.Player,
                        as: 'player1',
                        attributes: ['first_name', 'last_name', 'full_name', 'headshot']
                    },
                    {
                        model: db.Player,
                        as: 'player2',
                        attributes: ['first_name', 'last_name', 'full_name', 'headshot']
                    }
                ]
            },
            {
                model: db.NonCount,
                include: [
                    {
                        model: db.WTA,
                        as: 'wta1'
                    },
                    {
                        model: db.WTA,
                        as: 'wta2'
                    },
                    {
                        model: db.Player,
                        as: 'atp1',
                        attributes: ['first_name', 'last_name', 'full_name', 'headshot']
                    },
                    {
                        model: db.Player,
                        as: 'atp2',
                        attributes: ['first_name', 'last_name', 'full_name', 'headshot']
                    }
                ],
                order: [['id', 'ASC']]
            }
        ],
        order: [['id', 'ASC']]
    })
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error.message))
}

exports.findPlayersByEdition = async(req, res) => {
    try {
        const { edition } = req.params

        const wta = await db.WTA.findAll({
            where: {
                EditionId: edition
            }
        })

        const atp = await db.Entry.findAll({
            where: {
                EditionId: edition
            },
            include: {
                model: db.Player,
                attributes: ['first_name', 'last_name', 'full_name', 'country', 'headshot']
            },
            raw: true
        })

        function groupObjectsByKey(array, key) {
            const groupedArrays = {};
            
            array.forEach(obj => {
              const value = obj[key];
              if (!groupedArrays[value]) {
                groupedArrays[value] = [obj];
              } else {
                groupedArrays[value].push(obj);
              }
            });
            
            return groupedArrays;
        }

        const groupedWTA = groupObjectsByKey(wta, 'country')
        const groupedATP = groupObjectsByKey(atp, 'Player.country')

        const response = {
            groupedWTA,
            groupedATP
        }

        res.json(response)
    } catch (error) {
        console.log(error)
    }
}