const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const PORT = process.env.PORT || 8080

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(logger('dev'))

const db = require('./models')
// db.WTA.sync({alter: true})
//     .then(() => {
//         console.log('Synced db')
//     })
//     .catch((err) => {
//         console.log("Failed to sync db:" + err.message)
//     })

// db.Edition.sync({alter: true})
// .then(() => {
//     console.log('Synced db')
// })
// .catch((err) => {
//     console.log("Failed to sync db:" + err.message)
// })

const tournamentController = require('./controllers/tournamentController')
const editionController = require('./controllers/editionController')
const playerController = require('./controllers/playerController')
const matchStatController = require('./controllers/matchStatController')
const entryController = require('./controllers/entryController')
const matchScoreController = require('./controllers/matchScoreController')
const tieController = require('./controllers/tieController')

app.get('/', (req, res) => res.send('This is the root!'))

app.get('/search/:search', tournamentController.search)

app.get('/players/id/:id', playerController.findById)
app.get('/players/name/:player', playerController.findByName)
app.get('/players/wl-index/:player', matchScoreController.wlIndex)
app.get('/players/ties/:edition', tieController.findPlayersByEdition)

app.get('/tournaments/id/:id', tournamentController.findById)

app.get('/editions/id/:edition', editionController.findByEditionNo)
app.get('/editions/upcoming', editionController.findUpcoming)
app.get('/editions/year/:year', editionController.findByYear)
app.get('/editions/player/:player', editionController.findByPlayer)
app.get('/editions/entries', entryController.getEntriesByPlayer)
app.get('/editions/match/:id', matchStatController.findMatch)
app.get('/editions/stats', matchStatController.findPlayerStats)
app.get('/editions/ties/:edition', tieController.findTieByEdition)

app.get('/h2h', matchScoreController.findH2H)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))