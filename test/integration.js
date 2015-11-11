var test = require('tape')
var net = require('net')
var Level = require('level-mem')
var JLCore = require('just-login-core')
var JLSessionState = require('just-login-session-state')
var Server = require('../server/instance.js')
var Client = require('../client/instance.js')
var mockDomStorage = require('mock-dom-storage')

localStorage = (typeof localStorage !== 'undefined') ? localStorage : mockDomStorage() // jshint ignore:line

test('basic connect and authenticate', function (t) {
	t.plan(22)

	var db = new Level()
	var core = JLCore(db)
	var sessionState = JLSessionState(core, db)

	var server = net.createServer(Server(core, sessionState, { weak: false }))
	server.listen(1234)

	var socket = net.connect(1234)
	var emitter = Client(socket, function (err, api, sessionId) {
		t.ifError(err)
		t.equal(typeof api.beginAuthentication, 'function', 'api.beginAuthentication is a function')
		t.equal(typeof api.isAuthenticated, 'function', 'api.isAuthenticated is a function')
		t.equal(typeof api.unauthenticate, 'function', 'api.unauthenticate is a function')
		t.equal(typeof api.sessionExists, 'function', 'api.sessionExists is a function')

		api.isAuthenticated(function (err, contactAddress) { // Not authenticated
			t.ifError(err)
			t.notOk(contactAddress)

			api.beginAuthentication('hello@example.com', function (err, authReqInfo) {
				t.ifError(err)
				t.equal(authReqInfo.contactAddress, 'hello@example.com')
				t.ok(authReqInfo.token)

				api.isAuthenticated(function (err, contactAddress) { // Not authenticated
					t.ifError(err)
					t.notOk(contactAddress)

					core.authenticate(authReqInfo.token, function (err, credentials) {
						t.ifError(err)
						t.equal(credentials.contactAddress, 'hello@example.com')
						t.equal(credentials.sessionId, sessionId)

						api.isAuthenticated(function (err, contactAddress) { // Authenticated
							t.ifError(err)
							t.equal(authReqInfo.contactAddress, contactAddress)

							api.unauthenticate(function (err) {
								t.ifError(err)

								api.isAuthenticated(function (err, contactAddress) { // Not authenticated
									t.ifError(err)
									t.notOk(contactAddress)

									socket.end()
									server.close()
									t.end()
								})
							})
						})
					})
				})
			})
		})
	})

	emitter.on('session', function (info) {
		t.notOk(info.continued)
		t.ok(info.sessionId)
	})
})
