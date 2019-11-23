const {Chainable, task} = require('../chainable')
const r = require('ramda')

const C = Chainable

const {tryCatchP} = require('../fn')
const {pg} = require('../config')
const {pool} = pg

const pgConn = {
  runPgQueryNoPool: async (pgPool, pgQuery) => {
    // query can be 'string' or
    // {
    //  text: 'INSERT INTO users(name, email) VALUES($1, $2)',
    //  values: ['brianc', 'brian.m.carlson@gmail.com'],
    // }
    const result = await pgPool.query(pgQuery)
    console.log(result)
    //   throw new Error('oops')
    return C.ok(result)
  },

  runPgQuery: async pgQuery => await pgConn.runPgQueryNoPool(pool, pgQuery),

  runPgError: e => C.error(e.message),

  tryPgQuery: async (pgQuery, catcher = pgConn.runPgError) =>
    await tryCatchP(pgConn.runPgQuery, catcher)(pgQuery),

  getResultFromQuery: result =>
    r.prop('rows', result)
      ? C.ok(r.prop('rows', result))
      : C.error('No rows returned'),

  getOneResultFromQuery: result => C.ok(r.head(result)),

  query: async (
    queryString,
    formatterFn = pgConn.getResultFromQuery,
    catcherFn = pgConn.runPgError,
  ) => await task(pgConn.tryPgQuery(queryString, catcherFn)).chain(formatterFn),
}

module.exports = pgConn
