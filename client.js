var Shoe = require('shoe')
var Dnode = require('dnode')
var createSession = require('./createSession.js')
var EventEmitter = require('events').EventEmitter

module.exports = function client(dnodeEndpoint, cb) {
	if (typeof dnodeEndpoint === 'function') {
		cb = dnodeEndpoint
		dnodeEndpoint = '/dnode'
	}
	var emitter = new EventEmitter()
	var stream = Shoe(dnodeEndpoint)
	var d = Dnode()
	d.on('remote', function (api) {
		createSession(api, emitter, cb)
	})
	d.pipe(stream).pipe(d)
	return emitter
}
