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
var JustLoginCore = require('just-login-core')
var JustLoginSessionManager = require('just-login-example-session-manager')
var http = require('http')
var level = require('level')
var shoe = require('shoe')
var dnode = require('dnode')

var db = level('./databases/core')
var core = JustLoginCore(db)
var sessionManager = JustLoginSessionManager(core)
var server = http.createServer()

shoe(function(stream) {
	var d = dnode(sessionManager)
	d.pipe(stream).pipe(d)
}).install(server, "/dnode-example")
```

Create a client:

```js
var justLoginClient = require('just-login-client')

var client = justLoginClient("/dnode-example", function (err, newApi, sessionId) {
	if (!err) {
		//do stuff with the api
	}
})

client.on('session', function (session) {
	if (session.continued) {
		console.log("Reusing my session:", session.sessionId)
	} else {
		console.log("New session:", session.sessionId)
	}
})
client.on('authenticated', function (email) {
	console.log("I'm ecstatic! ' + email +' just got logged in!")
})
```

#License

[VOL](http://veryopenlicense.com/)
