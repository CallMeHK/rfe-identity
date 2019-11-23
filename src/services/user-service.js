const pgConn = require('../connections/pg-connection')
const r = require('ramda')

const queries = {
  getAllUsers: `SELECT * FROM users`,
  getOneUser: param => `SELECT * FROM users WHERE ${param}=$1`
}

const userService = {
  getAllUsers: async () => await pgConn.query(queries.getAllUsers),
  getOneUser: r.curry(async (param, value) =>
    await pgConn.query({
      text: queries.getOneUser(param),
      values: [value]
    })),
}

module.exports = userService
