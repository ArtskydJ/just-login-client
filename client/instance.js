var dnode = require('dnode')
var acquireSession = require('./acquire-session.js')
var EventEmitter = require('events').EventEmitter

module.exports = function instance(stream, cb) {
	var emitter = new EventEmitter()

	var d = dnode(null, { weak: false })

	d.on('remote', function (api) {
		acquireSession(api, emitter, cb)
	})

	d.pipe(stream).pipe(d)

	return emitter
}
