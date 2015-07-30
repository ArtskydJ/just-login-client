var shoe = require('shoe')
var dnode = require('dnode')

module.exports = function srv(core, sessionState) {

	var clientApi = {
		createSession: sessionState.createSession, //.bind(null, sessionId),
		sessionExists: sessionState.sessionExists, //.bind(null, sessionId),
		beginAuthentication: core.beginAuthentication, //.bind(null, sessionId),
		isAuthenticated: sessionState.isAuthenticated, //.bind(null, sessionId),
		unauthenticate: sessionState.unauthenticate //.bind(null, sessionId)
	}

	var sock = shoe(function (stream) { //Basic authentication api
		var d = dnode(clientApi)
		d.pipe(stream).pipe(d)
	})

	return sock
}
