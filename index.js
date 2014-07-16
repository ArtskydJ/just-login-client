var Shoe = require('shoe')
var Dnode = require('dnode')
var createSession = require('./createSession.js')

module.exports = function client(cb) {
	var stream = Shoe('/dnode')
	var d = Dnode()
	d.on('remote', function (api) {
		window.emitter = createSession(api, cb)
	})
	d.pipe(stream).pipe(d);
}
