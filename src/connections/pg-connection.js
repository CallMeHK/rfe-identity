const Result = require('folktale/result')
const r = require('ramda')

const { tryCatchP } = require('../fn')
const { pg } = require('../config')
const { pool } = pg

let pgConn = {
  runPgQueryNoPool: async (pgPool, pgQuery) => {
    const result = await pgPool.query(pgQuery)
    // throw new Error('oops')
    return Result.Ok(result)
  },
  runPgQuery: async (pgQuery) => await pgConn.runPgQueryNoPool(pool, pgQuery),
  runPgError: (e) => Result.Error(e),
  tryPgQuery: async (pgQuery, catcher = pgConn.runPgError) =>
    await tryCatchP(pgConn.runPgQuery, catcher)(pgQuery),
  getResultFromQuery: (result) => {
    return r.prop('rows', result) ? Result.Ok(r.prop('rows', result)) : Result.Error('No rows returned')
  },

  getOneResultFromQuery: (result) => { return Result.Ok(r.head(result)) },

  runQuery: async (queryString, formatterFn = pgConn.getResultFromQuery, catcherFn = pgConn.runPgError) => {
    const result = await pgConn.tryPgQuery(queryString, catcherFn)
    return result.chain(formatterFn).matchWith({
      Ok: x => ({ success: true, data: x.value }),
      Error: e => ({ success: false, data: e.value })
    })
  },

  runGetPgTime: async () => {
    return await pgConn.runQuery(
      'SELECT NOW()',
      (result) =>
        pgConn.getResultFromQuery(result)
          .chain(pgConn.getOneResultFromQuery)
    )
  }
}

class pgConnection {
  static async runPgQueryNoPool(pgPool, pgQuery) {
    const result = await pgPool.query(pgQuery)
    // throw new Error('oops')
    return Result.Ok(result)
  }

  static async runPgQuery(pgQuery) { return await pgConnection.runPgQueryNoPool(pool, pgQuery) }

  static runPgError(e) { return Result.Error(e) }

  static async tryPgQuery(pgQuery, catcher = pgConnection.runPgError) {
    return await tryCatchP(pgConnection.runPgQuery, catcher)(pgQuery)
  }

  static getResultFromQuery(result) {
    return r.prop('rows', result) ? Result.Ok(r.prop('rows', result)) : Result.Error('No rows returned')
  }

  static getOneResultFromQuery(result) { return Result.Ok(r.head(result)) }

  static async runQuery(queryString, formatterFn = pgConnection.getResultFromQuery, catcherFn = pgConnection.runPgError) {
    const result = await pgConnection.tryPgQuery(queryString, catcherFn)
    return result.chain(formatterFn).matchWith({
      Ok: x => ({ success: true, data: x.value }),
      Error: e => ({ success: false, data: e.value })
    })
  }

  static async runGetPgTime() {
    return await pgConnection.runQuery(
      'SELECT NOW()',
      (result) =>
        pgConnection.getResultFromQuery(result)
          .chain(pgConnection.getOneResultFromQuery)
    )
  }
}






module.exports = pgConn