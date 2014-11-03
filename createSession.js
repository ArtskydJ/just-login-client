function emitIfAuthenticated(emitter, fullApi, cb) {
	fullApi.isAuthenticated(function (err, name) {
		if (!err && name) {
			emitter.emit('authenticated', name)
			cb && cb()
		}
	})
}

function beginWatchingForAuthentication(emitter, fullApi) {
	var timer = setInterval(function() {
		emitIfAuthenticated(emitter, fullApi, clearInterval.bind(null, timer) )
	}, 2000)
}

function overwriteBeginAuthentication(emitter, fullApi) {
	var exposedApi = Object.create(fullApi)
	exposedApi.beginAuthentication = function beginAuthentication(emailAddress, cb) {
		beginWatchingForAuthentication(emitter, fullApi)
		fullApi.beginAuthentication(emailAddress, cb)
	}
	return exposedApi
}

function end(err, continued, emitter, fullApi, sessionId, cb) {
	if (err) {
		cb(err)
	} else {
		if (!continued) {
			localStorage.setItem("justLoginSessionId", sessionId)
		}
		process.nextTick(function() {
			emitter.emit('session', {
				sessionId: sessionId,
				continued: continued
			})
		})
		cb(null, overwriteBeginAuthentication(emitter, fullApi), sessionId)
	}
}

function createSession(api, emitter, cb) { //cb(err, api, session)
	var existingSessionId = localStorage.getItem("justLoginSessionId")

	api.continueExistingSession(existingSessionId, function (err, fullApi, sessionId) {
		if (!err) { //good session id attempt
			end(null, true, emitter, fullApi, sessionId, cb)
		} else { //bad session id attempt
			api.createNewSession(function (err, fullApi, sessionId) {
				end(err, false, emitter, fullApi, sessionId, cb)
			})
		}
	})
}

module.exports = createSession
