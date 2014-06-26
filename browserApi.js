var JustLoginCore = require('just-login-core')
var level = require('level-mem')
var jlc = JustLoginCore(level('idk'))
var sendTheEmail = require('./emailWrapper.js')

var fakeId = "LOLThisIsAFakeSessionId"
var fakeAddress = "example@example.com"

function getFullApi(sessionId) { //MOD THIS FUNCTION NOW!!!
	return {
		tryToLogIn: function(emailAddress) {
			console.log("Attempting a login with id", sessionId, "using email", emailAddress)
		}
	}
}

function cns(cb) { //create new session, cb(err, api, token)
	console.log('creating new session')
	var emitter = jlc.beginAuthentication(fakeId, fakeAddress)
	sendTheEmail( emitter ) //waits for 'auth' to be emmitted

	emitter.on('auth', function(obj) {
		console.log("'auth' emitted")
		cb(null, getFullApi(obj.token), obj.token) //obj = {token, contactAddress}
	})
}

function ces(sessionId, cb) { //continue existing session, cb(err, api, token)
	console.log('continuing old session: '+sessionId)
	jlc.isAuthenticated(sessionId, function(err, addr) {
		if (!err) {
			cb(null, getFullApi(sessionId), sessionId)
		} else { //wouldn't you want to run createNewSession here?
			var error = new Error("Invalid session identification")
			cb()
		}
	})
}

module.exports = { //dnode functions exposed to the browser
	createNewSession: cns,
	continueExistingSession: ces
}
