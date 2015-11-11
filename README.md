just-login-client
=================

[![Build Status](https://travis-ci.org/coding-in-the-wild/just-login-client.svg)](https://travis-ci.org/coding-in-the-wild/just-login-client)

# Example

Create a server:

```js
var db = require('level')('./databases/core')
var core = require('just-login-core')(db)
var sessionState = require('just-login-session-state')(core, db)
var server = require('http').createServer()
var sock = require('just-login-client')(core, sessionState)

sock.install(server, '/dnode-example')
```

Create a client:

```js
var justLoginClient = require('just-login-client')

var client = justLoginClient('/dnode-example', function (err, newApi, sessionId) {
	if (!err) {
		//do stuff with the api
	}
})

client.on('session', function (session) {
	if (session.continued) {
		console.log('Reusing my session:', session.sessionId)
	} else {
		console.log('New session:', session.sessionId)
	}
})
client.on('authenticated', function (email) {
	console.log(email + ' just got logged in!')
})
```

# API

```js
var client = require('just-login-client')
```

## Server Side

## `var sock = client(core, sessionState)`

- `core` is a [`just-login-core`][jlc] object.
- `sessionState` is a [`just-login-session-state`][jlss] object.
- **Returns** a [`sock` object](https://github.com/substack/shoe#var-sock--shoeopts-cb).

```js
var sock = client(core, sessionState)
sock.install(http.createServer(), '/dnode')
```

## Client Side

## `var emitter = client(dnodeEndpoint, cb)`

This function handles remembering the session id in the browser's local storage.

- `dnodeEndpoint` is a string for the endpoint that dnode uses for communication. The string must start with a forward slash `/`.
- `cb` is a function that has the following arguments:
	- `err` is either `null` or an `Error` object.
	- `newApi` is an object with methods from [`just-login-core`][jlc] and [`just-login-session-state`][jlss], but with the `sessionId` pre-bound:
		- `beginAuthentication(contactAddress, [cb])` from `just-login-core`
		- `isAuthenticated(cb)` from `just-login-session-state`
		- `unauthenticate([cb])` from `just-login-session-state`
		- `sessionExists(cb)` from `just-login-session-state`
	- `sessionId` is the new (or previous, when applicable) session id.
- **Returns** `emitter` which can emit the following events:
	- `session` is emitted when a session is initiated. An object is emitted with the following properties:
		- `sessionId` The id for the current session. E.g. `3879533a-1f34-11e4-a8de-c92c3319c4e0`
		- `continued` Whether or not the session was continued from a previous session. E.g. `true`, `false`
	- `authenticated` is emitted when the user gets authenticated.
		- `email` is the email of the user who logged in. E.g. `you@youremail.com`

```js
emitter.on('session', function (data) {
	console.log(data.continued) //boolean for if the session was continued or newly created
	console.log(data.sessionId) //string for the session id
})

emitter.on('authenticated', function (whom) {
	t.ok(whom, 'got authenticated')
	t.equal(whom, fakeEmailAddress, 'correct email (new)')
})
```

# Install

Install with [npm](http://nodejs.org/download)

	npm install just-login-client

# License

[VOL](http://veryopenlicense.com/)


[jlc]: https://github.com/ArtskydJ/just-login-core
[jlss]: https://github.com/ArtskydJ/just-login-session-state
