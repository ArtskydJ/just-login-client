module.exports = function apiForClient(core, sessionState) {
	return {
		createSession: sessionState.createSession,
		getFullApi: getFullApi
	}

	function getFullApi(sessionId, cb) {
		sessionState.sessionExists(sessionId, function (err, date) {
			if (err) {
				cb(err)
			} else if (date) {
				cb(null, {
					beginAuthentication: core.beginAuthentication.bind(null, sessionId),
					isAuthenticated: sessionState.isAuthenticated.bind(null, sessionId),
					unauthenticate: sessionState.unauthenticate.bind(null, sessionId),
					sessionExists: sessionState.sessionExists.bind(null, sessionId)
				})
			} else {
				cb(new Error('Session does not exist'))
			}
		})
	}
}
