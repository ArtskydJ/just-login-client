function overwriteBeginAuthentication(fullApi, beginWatchingForAuthentication) {
	var exposedApi = Object.create(fullApi)
	exposedApi.beginAuthentication = function beginAuthentication(emailAddress, cb) {
		beginWatchingForAuthentication(fullApi)
		fullApi.beginAuthentication(emailAddress, cb)
	}
	return exposedApi
}

function createSession(api, emitter, cb) { //cb(err, api, session)
	var existing = localStorage.getItem("justLoginSessionId")

	var beginWatchingForAuthentication = function beginWatchingForAuthentication(fullApi) {
		var timer = setInterval(function() {
			fullApi.isAuthenticated(function(err, name) {
				if (!err && name) {
					emitter.emit('authenticated', name)
					clearInterval(timer)
				}
			})
		}, 2000)
	}

	api.continueExistingSession(existing, function (err, fullApi, sessionId) {

		if (err) { //bad session id attempt
			api.createNewSession(function (err, fullApi, sessionId) {
				if (err) {
					cb(err)
				} else {
					localStorage.setItem("justLoginSessionId", sessionId)
					process.nextTick(function() {
						emitter.emit('new session', sessionId)
					})

					beginWatchingForAuthentication(fullApi)

					cb(null, overwriteBeginAuthentication(fullApi, beginWatchingForAuthentication), sessionId)
				}
			})
		} else {
			process.nextTick(function() {
				emitter.emit('continue session', sessionId)
			})
			cb(null, overwriteBeginAuthentication(fullApi, beginWatchingForAuthentication), sessionId)
		}
	})
}

module.exports = createSession
