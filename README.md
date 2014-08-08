just-login-client
=================

- [Install](#install)
- [Require](#require)
- [client([dnodeEndpoint,] cb)](#clientdnodeendpoint-cb)
- [Events](#events)
- [Example](#example)

#Install

Install with npm

	npm install just-login-client

#Require

```js
var client = require('just-login-client')
```

#client([dnodeEndpoint,] cb)

This function handles remembering the session id in the browser's local storage.

###Arguments:

- `dnodeEndpoint` is a string for the endpoint that dnode uses for communication. This argument is optional, and defaults to `"/dnode"`. The string must start with a forward slash `/`.
- `cb` is a function that has the following arguments:
	- `err` is either `null` or an `Error` object.
	- `newApi` is documented [here](https://github.com/ArtskydJ/just-login-server-api#api-methods).
	- `sessionId` is the new (or previous, when applicable) session id.

###Returns:
An event emitter which can emit the [events](#events) shown below.

#Events

Also, client sets window.emitter as an event emitter, and it emits these events:

- `session` is emitted when a session is initiated. An object is emitted with the following properties:
	- `sessionId` The id for the current session. E.g. `3879533A-1F34-11E4-A8DE-C92C3319C4E0`
	- `continued` Whether or not the session was continued from a previous session. E.g. `true`, `false`
- `authenticated` is emitted when the user gets authenticated. It only gets emitted on a new session. Emits the email of the user who logged in. E.g. `you@youremail.com`

```js
emitter.on('session', function (data) {
	console.log(data.continued) //boolean for if the session was continued or newly created
	console.log(data.sessionId) //string for the session id
})

emitter.on('authenticated', function (whom) {
	t.ok(whom, "got authenticated")
	t.equal(whom, fakeEmailAddress, "correct email (new)")
})
```

#Example

Create a server:

```js
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
sock.install(server, "/dnode-example")
```

Create a client:

```js
var client = require('just-login-client')

var myEmitter = client("/dnode-example", function (err, newApi, sessionId) {
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
```
