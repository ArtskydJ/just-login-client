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

- `api` is an object passed to `client()` that must have the functions, `createNewSession`, and `continueExistingSession`. For example, the [just-login-server-api](https://github.com/coding-in-the-wild/just-login-server-api#jlsa-methods).
- `emitter` must be an event emitter. It will emit [these events](#events).
- `cb` is a function that has the following arguments:
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

	var EventEmitter = require('events').EventEmitter
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
