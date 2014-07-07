var test = require('tap').test
var createSession = require('../index.js')

var fakeSessionId = "fakeSessionId"
var fakeApi

//unfortunately must create this
localStorage = require('mock-dom-storage')

test('test createSession', function (t) {

	localStorage.setItem("justLoginSessionId", fakeSessionId) //set the session id

	createSession(fakeApi, function (err, api, session) {
		t.notOk(err, "no error")
		t.equal(session, fakeSessionId, "Session Id in localStorage") //must retrieve session id
		t.notEqual(fakeApi, api, "these must be very different")

		localStorage.removeItem("justLoginSessionId") //delete the session id
		createSession(fakeApi, function (err, api, session) {
			t.notOk(err, "no error")
			t.notEqual(session, fakeSessionId, "Session Id is new") //creates session id
			t.notEqual(fakeApi, api, "these must be very different")
		})

	})
})
