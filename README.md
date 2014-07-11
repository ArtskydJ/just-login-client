just-login-client
=================

#install

	npm install just-login-client

#require

	var createSession = require('just-login-client')

#createSession(api, cb)

This function handles remembering the session id in the browser's local storage.

The callback has three arguments: `err`, `newApi`, and `sessionId`.

- `err` is obviously the error, if there is one.
- `newApi` is whatever was given from `continueExistingSession` or `createNewSession` in the api argument. For the coming example, the just-login-server-api is used, and is documented [here](https://github.com/ArtskydJ/just-login-server-api#api-methods).
- `sessionId` is the new or previous (if applicable) session id.

Also, createSession is an event emitter, and emits these events:

- `new session` This event is emitted if the browser did not have a previous session.
- `continue session` This event is emitted if the browser did have a previous session, and it was successfully continued.
- `authenticated` This event is emitted when the user gets authenticated. It only gets emitted on a new session.


#Example

Require everything:

	var Jlc = require('just-login-core')
	var Jlsa = require('just-login-server-api')
	var level = require('level-mem')
	var createSession = require('just-login-client')

Set up a Just Login Server Api object with a Just Login Core object:

	var db = level('uniqueNameHere')
	var jlc = Jlc(db)
	var jlsa = Jlsa(jlc)

Give the Api to the client:

	var emitter = createSession(jlsa, function (err, newApi, sessionId) {
		if (!err) {
			//do stuff with the api
		}
	})

	emitter.on('new session', function (sessionId) {
		console.log("Brand new, shiny session!", sessionId)
	})
	emitter.on('continue session', function (sessionId) {
		console.log("Reusing my session!", sessionId)
	})
	emitter.on('authenticated', function () {
		console.log("I'm ecstatic! I just got logged in!")
	})
