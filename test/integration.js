var test = require('tape')
var http = require('http')
var Level = require('level-mem')
var JLCore = require('just-login-core')
var JLSessionState = require('just-login-session-state')
var Server = require('../server/server.js')
var Client = require('../client/client.js')

test('integration, yo!', function (t) {
	var db = new Level()
	var core = JLCore(db)
	var sessionState = JLSessionState(core, db)
	var sock = Server(core, sessionState)
	var emitter = Client('/blah', function (err) {
		t.ifError(err)
	})

	var server = http.createServer()
	sock.listen(server, '/blah')

	emitter.on('session', function (info) {
		t.notOk(info.continued)
		t.ok(info.sessionId)
		t.end()
	})
})
