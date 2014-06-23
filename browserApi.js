var JustLoginCore = require('just-login-core')
var level = require('level-mem')

var fakeId = "LOLThisIsAFakeSessionId"
var fakeAddress = "example@example.com"

var jlc = JustLoginCore(level('idk'))

//jlc returns {
//		isAuthenticated: isAuthenticated,
//		beginAuthentication: beginAuthentication,
//		authenticate: authenticate
//	}

function getFullApi(sessionId) { //MOD THIS FUNCTION NOW!!!
	return {
		tryToLogIn: function(emailAddress) {
			console.log("I'm trying to log in with sessionid", sessionId, "and email address", emailAddress)
		}
	}
}

module.exports = { //dnode functions exposed to the browser
	createNewSession: function cns(cb) {
		jlc.beginAuthentication(fakeId, fakeAddress).on('auth', function(obj) { //obj = {token, contactAddress}
			cb(null, getFullApi(obj.token), obj.token) //obj.token = sessionId
		}
	},
	continueExistingSession: function ces(sessionId, cb) {
		if (jlc.isAuthenticated(sessionId)) {
			cb(null, getFullApi(sessionId), sessionId)
		} else { //wouldn't you want to run createNewSession here?
			cb(new Error("Invalid session identification"))
		}
	}
}
