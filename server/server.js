var shoe = require('shoe')
var dnode = require('dnode')
var makeClientApi = require('./api-for-client.js')

module.exports = function srv(core, sessionState) {
	return shoe(function (stream) {
		var d = dnode(makeClientApi(core, sessionState))
		d.pipe(stream).pipe(d)
	})
}
