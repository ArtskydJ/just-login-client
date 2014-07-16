just-login-client
=================

- [Install](#install)
- [Require](#require)
- [client(api, cb)](#clientapi-cb)
- [Events](#events)
- [Example](#example)

#Install

	npm install just-login-client

#Require

	var client = require('just-login-client')

#client(api, cb)

This function handles remembering the session id in the browser's local storage.

- `cb` has three arguments: `err`, `newApi`, and `sessionId`.
	- `err` is obviously the error, if there is one.
	- `newApi` is whatever was given from `continueExistingSession` or `createNewSession` in the api argument. For the coming example, the just-login-server-api is used, and is documented [here](https://github.com/ArtskydJ/just-login-server-api#api-methods).
	- `sessionId` is the new or previous (if applicable) session id.

#Events

Also, client sets window.emitter as an event emitter, and it emits these events:

- `new session` This event is emitted if the browser did not have a previous session.
- `continue session` This event is emitted if the browser did have a previous session, and it was successfully continued.
- `authenticated` This event is emitted when the user gets authenticated. It only gets emitted on a new session.


#Example

Create a server:

	var Jlc = require('just-login-core')
	var Jlsa = require('just-login-server-api')
	var http = require('http')
	var level = require('level-mem')
	var shoe = require('shoe')
	var dnode = require('dnode')

	var db = level('uniqueNameHere')
	var jlc = Jlc(db)
	var jlsa = Jlsa(jlc)

	var server = http.createServer()

	var sock = shoe(function(stream) {
		var d = dnode(jlsa)
		d.pipe(stream).pipe(d)
	})
	sock.install(server, "/dnode")


Create a client:

	var client = require('just-login-client')

	client(function (err, newApi, sessionId) {
		if (!err) {
			//do stuff with the api
		}
	})

	window.emitter.on('new session', function (sessionId) {
		console.log("Brand new, shiny session!", sessionId)
	})
	window.emitter.on('continue session', function (sessionId) {
		console.log("Reusing my session!", sessionId)
	})
	window.emitter.on('authenticated', function () {
		console.log("I'm ecstatic! I just got logged in!")
	})
