require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { fromPromised, of } = require('folktale/concurrency/task');

const pgConnection = require('./src/connections/pg-connection')
const userService = require('./src/services/user-service')
const { sendResponse, parseBody } = require('./src/services/express-service')
const { then, log } = require('./src/fn')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/time', async (req, res) => {
  const time = await pgConnection.runGetPgTime()
  res.send(time)
})

app.get('/users', async (req, res) => {
  const users = await userService.getAllUsers()
  res.send(users)
})

app.post('/user', async (req, res) => {
  // const { username } = req.body
  // const users = await userService.getOneUser('username', username)
  // users.matchWith(sendResponse(res))
  // parseBody(req, 'username')
  // userService.getOneUserTask('username', req.body.username)
  //   .willMatchWith({
  //     Cancelled: () => of('cancelled'),
  //     Resolved: (value) => console.log(value),
  //     Rejected: (error) => of(error - 1)
  //   });

  const response = await fromPromised(pgConnection.runPgQuery)({
    text: `SELECT * FROM users WHERE username=$1`,
    values: ['bob']
  })
    .willMatchWith({
      Cancelled: () => of('cancelled'),
      Rejected: (error) => of(`rejected ${error}`),
      Resolved: (value) => of(value)
    })
    .run().promise()

  // .matchWith({
  //   Cancelled: () => of('cancelled'),
  //   Resolved: (value) => console.log(value),
  //   Rejected: (error) => console.log(error)
  // });
  res.send(response)


})


app.listen(port, () => console.log(`Listening on port ${port}...`))