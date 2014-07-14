var test = require('tap').test
var createSession = require('../index.js')

if (typeof localStorage === "undefined" || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage
	localStorage = new LocalStorage('./fakeLocalStorage')
}

var jlsid = "justLoginSessionId" //key
var fakeSessionId = "fakeSessionId" //value
var fakeArgApi = {isAuthenticated: function (cb) {cb(null, "ex@mp.le")}}
var newSessionId = "newSessionId"
var fakeApi = {
	continueExistingSession: function (get, cb) {
		if (get == fakeSessionId) {
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
	t.plan(12)
	localStorage.setItem(jlsid, fakeSessionId) //set the session id
	t.equal(localStorage.getItem(jlsid), fakeSessionId, "localStorage works")
	var tryContinue = createSession(fakeApi, function (err, api, session) {
		t.notOk(err, "no error")
		t.equal(session, fakeSessionId, "sessionId must be old") //must retrieve session id
		t.notEqual(session, newSessionId, "sessionId must not be new")
		t.equal(fakeArgApi, api, "these must be the same")

		localStorage.removeItem("justLoginSessionId") //delete the session id
		var tryNew = createSession(fakeApi, function (err, api, session) {
			t.notOk(err, "no error")
			t.notEqual(session, fakeSessionId, "sessionId must not be old") //creates session id
			t.equal(session, newSessionId, "sessionId must be new")
			t.equal(fakeArgApi, api, "these must be the same")
			setTimeout(t.end.bind(t), 100)
		})

		tryNew.on('new session', function() {t.ok(true, "created a new session")})
		tryNew.on('continue session', function() {t.notOk(true, "did not continue an existing session")})
		tryNew.on('authenticated', function() {t.ok(true, "got authenticated")})
	})
	tryContinue.on('new session', function (sessionId) {
		t.notOk(true, "did not create a new session")
		t.ok(true, "make plan right length")
	})
	tryContinue.on('continue session', function (sessionId) {
		t.ok(true, "continued an existing session")
		t.equal(sessionId, fakeSessionId, "got correct id")
	})
})
