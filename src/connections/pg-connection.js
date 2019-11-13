const Result = require('folktale/result')
const r = require('ramda')

const { tryCatchP } = require('../fn')
const { pg } = require('../config')
const { pool } = pg

const pgConn = {
  runPgQueryNoPool: async (pgPool, pgQuery) => {
    const result = await pgPool.query(pgQuery)
    // throw new Error('oops')
    return Result.Ok(result)
  },

  runPgQuery: async (pgQuery) => await pgConn.runPgQueryNoPool(pool, pgQuery),

  runPgError: (e) => Result.Error(e.message),

  tryPgQuery: async (pgQuery, catcher = pgConn.runPgError) =>
    await tryCatchP(pgConn.runPgQuery, catcher)(pgQuery),

  getResultFromQuery: (result) =>
    r.prop('rows', result) ? Result.Ok(r.prop('rows', result)) : Result.Error('No rows returned'),

  getOneResultFromQuery: (result) => Result.Ok(r.head(result)),

  runQuery: async (queryString, formatterFn = pgConn.getResultFromQuery, catcherFn = pgConn.runPgError) => {
    const result = await pgConn.tryPgQuery(queryString, catcherFn)
    return result.chain(formatterFn).matchWith({
      Ok: x => ({ success: true, data: x.value }),
      Error: e => ({ success: false, data: { error: e.value } })
    })
  },

  runGetPgTime: async () => await pgConn.runQuery(
    'SELECT NOW()',
    (result) =>
      pgConn.getResultFromQuery(result)
        .chain(pgConn.getOneResultFromQuery)
  )
}

module.exports = pgConn