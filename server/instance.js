var dnode = require('dnode')
var makeClientApi = require('./api-for-client.js')

module.exports = function instance(core, sessionState, dnodeOpts) {
	return function (stream) {
		var d = dnode(makeClientApi(core, sessionState), dnodeOpts)
		d.pipe(stream).pipe(d)
	}
}
