var shoe = require('shoe')
var instance = require('./instance.js')

module.exports = function client(dnodeEndpoint, cb) {
	return instance(shoe(dnodeEndpoint), cb)
}
