const r = require('ramda')
const Result = require('folktale/result')

const tryCatchP = r.curry(async (_fn, _log, _obj) => {
  try {
    return await _fn(_obj)
  } catch (e) {
    return _log(e)
  }
})

const then = r.curry((f, p) => p.then(f))

const log = x => {
  console.log('logging: ', x)
  return Result.Ok(x)
}

module.exports = {
  tryCatchP,
  then
}