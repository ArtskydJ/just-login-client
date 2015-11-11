var shoe = require('shoe')
var instance = require('./instance.js')

module.exports = function srv(core, sessionState) {
	return shoe(instance(core, sessionState))
}
