
function getFullApi(sessionId) {
	return {
		tryToLogIn: function(emailAddress) {
			console.log("I'm trying to log in with sessionid", sessionId, "and email address", emailAddress)
		}
	}
}

var i = 0
function generateNewSessionId() {
	i = i + 1
	return i
}

function sessionIsValid(sessionId) {
	return true
}

var dnodeFunctionsExposedToTheBrowser = {
	createNewSession: function(cb) {
		var sessionId = generateNewSessionId()
		cb(null, getFullApi(sessionId), sessionId)
	},
	continueExistingSession: function(sessionId, cb) {
		if (sessionIsValid(sessionId)) {
			cb(null, getFullApi(sessionId), sessionId)
		} else {
			cb(new Error("lol that's not a valid session"))
		}
	}
}

module.exports = dnodeFunctionsExposedToTheBrowser