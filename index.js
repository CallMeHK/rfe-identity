require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { pg } = require('./src/config')

const pgConnection = require('./src/connections/pg-connection')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/time', async (req, res) => {
  const time = await pgConnection.runGetPgTime()
  res.send(time)
})


app.listen(port, () => console.log(`Listening on port ${port}...`))