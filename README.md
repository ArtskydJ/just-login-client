just-login-client
=================

- [Install](#install)
- [Require](#require)
- [client(api, emitter, cb)](#clientapi-emitter-cb)
- [Events](#events)
- [Example](#example)

#Install

	npm install just-login-client

#Require

	var client = require('just-login-client')

#client(api, emitter, cb)

This function handles remembering the session id in the browser's local storage.

###Arguments:

- `dnodeEndpoint` is a string for the endpoint that dnode uses for communication. This argument optional, and defaults to "/dnode".
- `cb` is a function that has the following arguments:
	- `err` is obviously the error, if there is one.
	- `newApi` is documented [here](https://github.com/ArtskydJ/just-login-server-api#api-methods).
	- `sessionId` is the new (or previous, when applicable) session id.

###Returns:
An event emitter which emits the [events below](#events).

#Events

Also, client sets window.emitter as an event emitter, and it emits these events:

- `new session` is emitted if the browser did not have a previous session. Emits the session id of the user who logged in.
- `continue session` is emitted if the browser did have a previous session, and it was successfully continued. Emits the session id of the user who logged in.
- `authenticated` is emitted when the user gets authenticated. It only gets emitted on a new session. Emits the email of the user who logged in.


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

	var myEmitter = client(function (err, newApi, sessionId) {
		if (!err) {
			//do stuff with the api
		}
	})

	myEmitter.on('new session', function (sessionId) {
		console.log("Brand new, shiny session!", sessionId)
	})
	myEmitter.on('continue session', function (sessionId) {
		console.log("Reusing my session!", sessionId)
	})
	myEmitter.on('authenticated', function () {
		console.log("I'm ecstatic! I just got logged in!")
	})
