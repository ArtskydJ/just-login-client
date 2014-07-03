var dnode = require('dnode')
//var domready = require('domready');
var shoe = require('shoe');
var stream = shoe('/dnode')
var events = require('events')

var api = {
	beginAuthentication: function() {},
	isAuthenticated: function(cb) {cb(null, false)},
	unauthenticate: function() {},
}
var d = dnode() //no listening, and do not run d.end()!
d.on('remote', function (tempApi) {
	api = tempApi //the api at the module's scope
	console.log("yo found it!", api)
	glob = api //allows me to run these functions in the browser console
})
d.pipe(stream).pipe(d);

function createSession(cb) { //cb(err, api, session)
	//must get actual session id if existing, instead of hardcoded 13 below
	api.continueExistingSession(13, function(err, fullApi, sessionId) {
		if (err && err.invalidSessionId) { //bad session id attempt
			api.createNewSession(cb)
		}
		else if (err)
			cb(err)
		else
			cb(null, fullApi, sessionId)
	})
}

var onLoginTimer = null
var emitter = new events.EventEmitter()
function onLogin() {
	if (!onLoginTimer) {
		onLoginTimer = setInterval(function() {
			api.isAuthenticated(function(err, addr) {
				if (!err && addr) {
					clearInterval(onLoginTimer)
					emitter.emit('login')
				}
			})
		}, 1000)
	}
	return emitter
}

module.exports = {
	createSession: createSession,
	onLogin: onLogin
}

/*
var events = require('events')

	var emitter = new events.EventEmitter()
	var loggedIn, prevLoggedIn
	emitter.beginAuthentication = jlc.beginAuthentication.bind(jlc, sessionId)
	emitter.isAuthenticated =     jlc.isAuthenticated.bind(jlc, sessionId)
	emitter.unauthenticate =      jlc.unauthenticate.bind(jlc, sessionId)
	prevLoggedIn = emitter.isAuthenticated()
	setInterval(function() {
		loggedIn = emitter.isAuthenticated()
		if (loggedIn != prevLoggedIn) {
			emitter.emit('log'+loggedIn?'in':'out')
		}
	}, 1000)
*/
