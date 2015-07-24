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

function end(emitter, fullApi, sessionId, continued, cb) {
	process.nextTick(function() {
		emitter.emit('session', {
			sessionId: sessionId,
			continued: continued
		})
	})
	cb(null, overwriteBeginAuthentication(emitter, fullApi), sessionId)
}

function acquireSession(api, emitter, cb) { //cb(err, api, session)
	var existingSessionId = localStorage.getItem('justLoginSessionId')

	api.continueSession(existingSessionId, function (err, fullApi, sessionId) {
		if (!err) { //good session id attempt
			end(emitter, fullApi, sessionId, true, cb)
		} else { //bad session id attempt
			api.createSession(function (err, fullApi, newSessionId) {
				if (err) {
					cb(err)
				} else {
					localStorage.setItem('justLoginSessionId', newSessionId)
					end(emitter, fullApi, newSessionId, false, cb)
				}
			})
		}
	})
}

module.exports = acquireSession
