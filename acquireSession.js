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
	var exposedApi = overwriteBeginAuthentication(emitter, fullApi)
	cb(null, exposedApi, sessionId)
}

function acquireSession(api, emitter, cb) { //cb(err, api, session)
	var existingSessionId = localStorage.getItem('justLoginSessionId')

	api.sessionExists(existingSessionId, function (err, date) {
		if (!err && date) { //good session id attempt
			end(emitter, api, existingSessionId, true, cb)
		} else { //bad session id attempt
			api.createSession(function (err, newSessionId) {
				if (err) {
					cb(err)
				} else {
					localStorage.setItem('justLoginSessionId', newSessionId)
					end(emitter, api, newSessionId, false, cb)
				}
			})
		}
	})
}

module.exports = acquireSession
