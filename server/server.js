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
// db.sequelize.sync({alter: true})
//     .then(() => {
//         console.log('Synced db')
//     })
//     .catch((err) => {
//         console.log("Failed to sync db:" + err.message)
//     })

const tournamentController = require('./controllers/tournamentController')
const editionController = require('./controllers/editionController')
const playerController = require('./controllers/playerController')

app.get('/', (req, res) => res.send('This is the root!'))

// Player endpoints
app.get('/players/id/:id', playerController.findById)
app.post('/players', playerController.create)

// Tournament endpoints
app.get('/tournaments/id/:id', tournamentController.findById)
app.post('/tournaments', tournamentController.create)

// Edition endpoints
app.get('/editions/id/:id', editionController.findById)
app.get('/editions/upcoming', editionController.findUpcoming)
app.get('/editions/year/:year', editionController.findByYear)
app.get('/editions/player/:player', editionController.findByPlayer)
app.post('/editions', editionController.create)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))