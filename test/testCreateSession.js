var test = require('tap').test
var createSession = require('../createSession.js')
var EventEmitter = require('events').EventEmitter

if (typeof localStorage === "undefined" || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage
	localStorage = new LocalStorage('./fakeLocalStorage')
}

var jlsid = "justLoginSessionId" //key
var fakeSessionId = "fakeSessionId" //value
var fakeEmailAddress = "ex@mp.le"
var fakeArgApi = {isAuthenticated: function (cb) {cb(null, fakeEmailAddress)}}
var newSessionId = "newSessionId"
var fakeApi = {
	continueExistingSession: function (get, cb) {
		if (get === fakeSessionId) {
			cb(null, fakeArgApi, fakeSessionId)
		} else {
			cb(new Error("u haz error"))
		}
	},
	createNewSession: function (cb) {
		cb(null, fakeArgApi, newSessionId)
	}
}

test('test createSession', function (t) {
	t.plan(14)
	localStorage.setItem(jlsid, fakeSessionId) //set the session id
	t.equal(localStorage.getItem(jlsid), fakeSessionId, "localStorage works")
	var tryContinue = new EventEmitter()
	createSession(fakeApi, tryContinue, function (err, api, session) {
		t.notOk(err, "no error")
		t.equal(fakeSessionId, session, "sessionId must be old") //must retrieve session id
		t.notEqual(newSessionId, session, "sessionId must not be new")
		t.notEqual(fakeArgApi, api, "these must be the different because of overwriteBeginAuthentication()") //changed from .equal to .deepEqual 20140802

		localStorage.removeItem("justLoginSessionId") //delete the session id
		var tryNew = new EventEmitter()
		createSession(fakeApi, tryNew, function (err, api, session) {
			t.notOk(err, "no error")
			t.notEqual(session, fakeSessionId, "sessionId must not be old") //creates session id
			t.equal(session, newSessionId, "sessionId must be new")
			t.notEqual(fakeArgApi, api, "these must be the different because of overwriteBeginAuthentication()")
			setTimeout(t.end.bind(t), 2010) //must wait for authenticated event to be called
		})

		tryNew.on('new session', function() {
			t.ok(true, "created a new session")
		})
		tryNew.on('continue session', function() {
			t.notOk(true, "did not continue an existing session")
		})
		tryNew.on('authenticated', function (whom) {
			t.ok(true, "got authenticated (new)")
			t.equal(whom, fakeEmailAddress, "correct email (new)")
		})
	})
	tryContinue.on('new session', function (sessionId) {
		t.notOk(true, "did not create a new session")
		t.ok(true, "make plan right length") //amount of t.whatevers match 'continue session's amount
	})
	tryContinue.on('continue session', function (sessionId) {
		t.ok(true, "continued an existing session")
		t.equal(sessionId, fakeSessionId, "got correct id")
	})
	tryContinue.on('authenticated', function (whom) {
		t.ok(false, "not supposed to get this event here...")
	})
})
