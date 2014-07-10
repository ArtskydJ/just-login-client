var test = require('tap').test
var createSession = require('../index.js')

if (typeof localStorage === "undefined" || localStorage === null) {
	console.log("replacing localStorage")
	var LocalStorage = require('node-localstorage').LocalStorage
	localStorage = new LocalStorage('./fakeLocalStorage')
}

var jlsid = "justLoginSessionId" //key
var fakeSessionId = "fakeSessionId" //value
var fakeArgApi = "Joseph" //this would usually be an object
var newSessionId = "newSessionId"
var fakeApi = {
	continueExistingSession: function (get, cb) {
		if (get == fakeSessionId) {
			cb(null, fakeArgApi, fakeSessionId)
		} else if (get == null) {
			var err = new Error("u haz error")
			err.invalidSessionId = true
			console.log("u haz errorz!")
			cb(err)
		} else {
			cb(null)
		}
	},
	createNewSession: function (cb) {
		cb(null, fakeArgApi, newSessionId)
	}
}

test('test createSession', function (t) {
	t.plan(9)
	localStorage.setItem(jlsid, fakeSessionId) //set the session id
	t.equal(localStorage.getItem(jlsid), fakeSessionId, "localStorage works")
	createSession(fakeApi, function (err, api, session) {
		t.notOk(err, "no error")
		t.equal(session, fakeSessionId, "sessionId must be old") //must retrieve session id
		t.notEqual(session, newSessionId, "sessionId must not be new")
		t.equal(fakeArgApi, api, "these must be the same")

		localStorage.removeItem("justLoginSessionId") //delete the session id
		createSession(fakeApi, function (err, api, session) {
			t.notOk(err, "no error")
			t.notEqual(session, fakeSessionId, "sessionId must not be old") //creates session id
			t.equal(session, newSessionId, "sessionId must be new")
			t.equal(fakeArgApi, api, "these must be the same")
			t.end()
		})
	})
})
