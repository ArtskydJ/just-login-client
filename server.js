var shoe = require('shoe')
var dnode = require('dnode')

module.exports = function srv(core, sessionState) {

	var clientApi = {
		createSession: sessionState.createSession,
		getFullApi: getFullApi
	}
	function getFullApi(sessionId, cb) {
		sessionState.sessionExists(sessionId, function (err, date) {
			if (err) {
				cb(err)
			} else if (date) {
				cb(null, fullApi(sessionId))
			} else {
				cb(new Error('Session does not exist'))
			}
		})
	}
	function fullApi(sessionId) {
		return {
			beginAuthentication: core.beginAuthentication.bind(core, sessionId),
			isAuthenticated: sessionState.isAuthenticated.bind(sessionState, sessionId),
			unauthenticate: sessionState.unauthenticate.bind(sessionState, sessionId),
			sessionExists: sessionState.sessionExists.bind(sessionState, sessionId)
		}
	}

	var sock = shoe(function (stream) { //Basic authentication api
		var d = dnode(clientApi)
		d.pipe(stream).pipe(d)
	})

	return sock
}
