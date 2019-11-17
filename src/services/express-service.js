const Result = require('folktale/result')
const {Chainable} = require('../chainable')
const C = Chainable
const r = require('ramda')

const send = {
  sendSuccess: r.curry((resFn, response) =>
    resFn.send({success: true, data: response}),
  ),
  sendError: r.curry((resFn, status, response) =>
    resFn.status(status).send({success: false, data: response}),
  ),
  sendResponse: (resFn, errorStatus = 400) => ({
    ok: response => send.sendSuccess(resFn, response.value),
    error: response => send.sendError(resFn, errorStatus, response.value),
  }),
  peelBody: r.curry((req, prop) =>
    req.body[prop] ? C.ok(req.body[prop]) : C.error('Could not parse body'),
  ),
  parseBody: req => (...props) => {
    const {body} = req
    const parsedBody = props.reduce((accumulator, currentValue) => ({
      ...accumulator,
      [currentValue]: body[currentValue],
    }),{})
    return parsedBody
  },
}

module.exports = send
