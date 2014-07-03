var test = require('tap').test
var client = require('../index.js')

test('test onLogin', function(t) {
	t.plan(2)
	client(function (remote) { //connect to server (SERVER ISN'T RUNNING!!!)
		remote.createSession(function (err, api, session) {
			console.log('err:',err,', api:',api,', session:',session)
			api.onLogin().on('login', function() {
				t.ok(true, 'yes this function')
			})

			remote.onLogin().on('login', function() {
				t.ok(true, 'they both called')
			})
		})
	})
})
