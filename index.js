var Shoe = require('shoe')
var Dnode = require('dnode')
var createSession = require('./createSession.js')
var EventEmitter = require('events').EventEmitter

module.exports = function client(cb) {
	var emitter = new EventEmitter()
	var stream = Shoe('/dnode')
	var d = Dnode()
	d.on('remote', function (api) {
		createSession(api, emitter, cb)
	})
	d.pipe(stream).pipe(d);
	return emitter
}
