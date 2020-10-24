let express = require('express')
let bodyParser = require('body-parser')
const { sequelize } = require('./models')
let cors = require('cors')

const config = require('./config/config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/assets', express.static('public'))

require('./userPassport')

require('./routes')(app)

app.get('/status', function (req, res) {
    res.send('hello nodejs server')
})

app.get('hello/:person', function (req, res) {
    console.log('hello - ' + req.params.person)
    res.send('say hello with ' + req.params.person)
})


let port = process.env.PORT || config.port

sequelize.sync({ force: false }).then(() => {
    app.listen(port, function () {
        console.log('Server running on ' + port)
    })
})

