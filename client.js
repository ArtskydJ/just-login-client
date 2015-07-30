var shoe = require('shoe')
var dnode = require('dnode')
var createSession = require('./acquireSession.js')
var EventEmitter = require('events').EventEmitter

module.exports = function client(dnodeEndpoint, cb) {
	var emitter = new EventEmitter()
	var stream = shoe(dnodeEndpoint)
	var d = dnode()
	d.on('remote', function (api) {
		createSession(api, emitter, cb)
	})
	d.pipe(stream).pipe(d)
	return emitter
}
