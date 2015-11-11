var test = require('tape')
var EventEmitter = require('events').EventEmitter
var acquireSession = require('../client/acquire-session.js')
var makeClientApi = require('../server/api-for-client.js')
var mockDomStorage = require('mock-dom-storage')

localStorage = (typeof localStorage !== 'undefined') ? localStorage : mockDomStorage() // jshint ignore:line

var fakeApi = makeClientApi({
	beginAuthentication: function (sessionId, addr, cb) {
		if (cb) setTimeout(cb, 0, null, { contactAddress: addr, token: 'a token' })
	}
}, {
	isAuthenticated: function () {},
	unauthenticate: function () {},
	createSession: function (cb) {
		setTimeout(cb, 0, null, 'new session id')
	},
	sessionExists: function (sessionId, cb) {
		setTimeout(cb, 0, null, sessionId ? new Date() : null)
	}
})


test('create a new session with acquireSession', function (t) {
	t.plan(12)
	var emitter = new EventEmitter()
	var email = 'ex@mp.le'

	acquireSession(fakeApi, emitter, function (err, api, sessionId) {
		t.ifError(err)
		t.equal(sessionId, 'new session id', 'sessionId must be new')
		t.equal(typeof api.beginAuthentication, 'function', 'api.beginAuthentication is a function')
		t.equal(typeof api.isAuthenticated, 'function', 'api.isAuthenticated is a function')
		t.equal(typeof api.unauthenticate, 'function', 'api.unauthenticate is a function')
		t.equal(typeof api.sessionExists, 'function', 'api.sessionExists is a function')

		api.beginAuthentication(email, function (err, authReqInfo) {
			t.ifError(err)
			t.ok(authReqInfo && authReqInfo.token)
			t.equal(authReqInfo && authReqInfo.contactAddress, email)
		})
	})

	emitter.on('session', function (data) {
		t.notOk(data.continued, 'created a NEW session')
		t.ok(data.sessionId, 'has sessionId property')
		t.equal(data.sessionId, 'new session id', 'created a session id')
	})

	emitter.on('authenticated', function (whom) {
		t.ok(whom, 'got authenticated')
		t.equal(whom, email, 'correct email (new)')
		t.end()
	})
})

test('continue an existing session with acquireSession', function (t) {
	t.plan(6)

	localStorage.clear()
	localStorage.setItem('justLoginSessionId', 'existing session id') //set the session id
	t.equal(localStorage.getItem('justLoginSessionId'), 'existing session id', 'localStorage works')

	var emitter = new EventEmitter()
	var authEventFired = false

	acquireSession(fakeApi, emitter, function (err, api, sessionId) {
		t.ifError(err)
		t.equal('existing session id', sessionId, 'sessionId must continued')
	})

	emitter.on('session', function (data) {
		t.ok(data.continued, 'continued an existing session')
		t.equal(data.sessionId, 'existing session id', 'got correct id')
	})
	emitter.on('authenticated', function (whom) { authEventFired = true })
	setTimeout(function () {
		t.notOk(authEventFired, 'no auth event')
		t.end()
	}, 2100)
})
