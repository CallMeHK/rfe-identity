const pgConnection = require('../connections/pg-connection')
const userService = require('./user-service')
const {sendResponse, peelBody} = require('./express-service')
const {task} = require('../chainable')

const getRoutes = {
  getTime: (req, res) =>
    task(pgConnection.query('SELECT NOW()'))
      .chain(pgConnection.getOneResultFromQuery)
      .willMatch(sendResponse(res)),
  getUsers: (req, res) =>
    task(userService.getAllUsers()).willMatch(sendResponse(res)),
}

const postRoutes = {
  getUser: (req, res) => {
    peelBody(req, 'username')
      .chainP(userService.getOneUser('username'))
      .willMatch(sendResponse(res))
  },
}

module.exports = {getRoutes, postRoutes}
