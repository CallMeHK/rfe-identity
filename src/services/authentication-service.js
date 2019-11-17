const {Chainable} = require('../chainable')
const C = Chainable
const r = require('ramda')

const authentication = {
				comparePasswords: r.curry((userPassword, userData) => 
								userPassword === userData.password ? C.ok(userData) : C.error('Incorrect password'))
}
module.exports = authentication
