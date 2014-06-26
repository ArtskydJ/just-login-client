var JustLoginCore = require('just-login-core')
var level = require('level-mem')
var jlc = JustLoginCore(level('idk'))
var sendTheEmail = require('./emailWrapper.js')

var fakeId = "LOLThisIsAFakeSessionId"
var fakeAddress = "example@example.com"

//jlc ('->' signifies 'returns')
//    isAuthenticated(sessionId, cb) -> null
//    beginAuthentication(session id, contact address) -> event emitter
//    authenticate(token, cb) -> null

function getFullApi(sessionId) { //MOD THIS FUNCTION NOW!!!
	return {
		tryToLogIn: function(emailAddress) {
			console.log("I'm trying to log in with sessionid", sessionId, "and email address", emailAddress)
		}
	}
}

function cns(cb) { //create new session
	var tEmit = jlc.beginAuthentication(fakeId, fakeAddress)
	sendTheEmail( tEmit ) //waits for 'auth' to be emmitted

	tEmit.on('auth', function(obj) { //obj = {token, contactAddress}
		cb(null, getFullApi(obj.token), obj.token) //obj.token = sessionId
	})
}

function ces(sessionId, cb) { //continue existing session
	jlc.isAuthenticated(sessionId, function(err, addr) {
		if (!err) {
			cb(null, getFullApi(sessionId), sessionId)
		} else { //wouldn't you want to run createNewSession here?
			cb(new Error("Invalid session identification"))
		}
	})
}

module.exports = { //dnode functions exposed to the browser
	createNewSession: cns,
	continueExistingSession: ces
}
