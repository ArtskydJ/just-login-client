function createSession(api, cb) { //cb(err, api, session)
	var existing = localStorage.getItem("justLoginSessionId")
	api.continueExistingSession(existing, function (err, fullApi, sessionId) {
		if (err && err.invalidSessionId) { //bad session id attempt
			api.createNewSession(function (err, newFullApi, newSessionId){
				localStorage.setItem("justLoginSessionId", newSessionId)
				if (err)
					cb(err)
				else
					cb(null, newFullApi, newSessionId)
			})
		}
		else if (err)
			cb(err)
		else
			cb(null, fullApi, sessionId)
	})
}

module.exports = createSession
