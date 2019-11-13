const r = require('ramda')

const tryCatchP = r.curry(async (_fn, _log, _obj) => {
  try {
    return await _fn(_obj)
  } catch (e) {
    return _log(e)
  }
})

module.exports = {
  tryCatchP
}