var Shoe = require('shoe')
var Dnode = require('dnode')
var createSession = require('./createSession.js')
var EventEmitter = require('events').EventEmitter

module.exports = function client(dnodeEndpoint, cb) {
	if (typeof dnodeEndpoint === "function") { //if no endpoint was passed...
		cb = dnodeEndpoint                     //...set the cb as a function and...
		dnodeEndpoint = "/dnode"               //...set the endpoint as a string
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
