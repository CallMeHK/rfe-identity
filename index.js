require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const {getRoutes, postRoutes} = require('./src/services/route-service')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/time', getRoutes.getTime)
app.get('/users', getRoutes.getUsers)

app.post('/user', postRoutes.getUser)

app.listen(port, () => console.log(`Listening on port ${port}...`))
