const Result = require('folktale/result')
const r = require('ramda')

const send = {
  sendSuccess: r.curry((resFn, response) => resFn.send({ success: true, data: response })),
  sendError: r.curry((resFn, status, response) => resFn.status(status).send({ success: false, data: response })),
  sendResponse: (resFn, errorStatus = 400) => ({
    Ok: response => send.sendSuccess(resFn, response.value),
    Error: response => send.sendError(resFn, errorStatus, response.value) 
  }),
  parseBody: r.curry((req, prop) => req.body[prop] ? Result.Ok(req.body[prop]) : Result.Error('Could not parse body'))
}

module.exports = send