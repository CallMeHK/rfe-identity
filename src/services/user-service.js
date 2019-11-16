const pgConn = require('../connections/pg-connection')
const { fromPromised } = require('folktale/concurrency/task');
const r = require('ramda')

const queries = {
  getAllUsers: `SELECT * FROM users`,
  getOneUser: param => `SELECT * FROM users WHERE ${param}=$1`
}

const userService = {
  getAllUsers: async () => await pgConn.runQuery(queries.getAllUsers),
  getOneUser: r.curry(async (param, value) =>
    await pgConn.runQueryChain({
      text: queries.getOneUser(param),
      values: [value]
    })),
  getOneUserTask: r.curry(async (param, value) =>
    fromPromised(pgConn.queryTaskP)({
      text: queries.getOneUser(param),
      values: [value]
    }))
}

module.exports = userService