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
// db.MatchStat.sync({force: true})
//     .then(() => {
//         console.log('Synced db')
//     })
//     .catch((err) => {
//         console.log("Failed to sync db:" + err.message)
//     })

const tournamentController = require('./controllers/tournamentController')
const editionController = require('./controllers/editionController')
const playerController = require('./controllers/playerController')
const matchStatController = require('./controllers/matchStatController')
const entryController = require('./controllers/entryController')
const matchScoreController = require('./controllers/matchScoreController')

app.get('/', (req, res) => res.send('This is the root!'))
app.get('/search/:search', tournamentController.search)

// Player endpoints
app.get('/players/id/:id', playerController.findById)
app.post('/players', playerController.create)

// Tournament endpoints
app.get('/tournaments/id/:id', tournamentController.findById)
app.post('/tournaments', tournamentController.create)

// Edition endpoints
app.get('/editions/id/:edition', editionController.findByEditionNo)
app.get('/editions/upcoming', editionController.findUpcoming)
app.get('/editions/year/:year', editionController.findByYear)
app.get('/editions/player/:player', editionController.findByPlayer)
app.post('/editions', editionController.create)

// Entry endpoints
app.get('/editions/entries', entryController.getEntriesByPlayer)

// MatchScore endpoints
app.get('/h2h', matchScoreController.findH2H)
app.get('/players/wl-index/:player', matchScoreController.wlIndex)

// MatchStat endpoints
app.get('/editions/match/:id', matchStatController.findMatch)
app.get('/editions/stats', matchStatController.findPlayerStats)
app.post('/match-stats', matchStatController.create)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))