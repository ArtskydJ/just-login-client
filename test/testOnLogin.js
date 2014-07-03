var test = require('tap').test
/*
var dnode = require('dnode')
var http = require('http')
var shoe = require('shoe')
//function() 
var server = http.createServer().on('request', function(req, res) {
	console.log("connection initiated")
})

server.listen(9999)

var sock = shoe(function (stream) {
	var loggedIn = false
	setTimeout(function() {
		loggedIn = true
	}, 500)

	var d = dnode({
		isAuthenticated: function(cb) {
			//process.nextTick(function () {
				cb(null, loggedIn)
			//})
		}
	})
	//d.pipe(stream).pipe(d)
})
sock.install(server, '/dnode')
*/
test('test onLogin', function(t) {
	t.plan(2)
	var client = require('../index.js')
	client.createSession(function (err, api, session) {
		console.log('err:',err,', api:',api,', session:',session)
		client.onLogin().on('login', function() {
			t.ok(true, 'yes this function')
		})

		client.onLogin().on('login', function() {
			t.ok(true, 'they both called')
		})
	})
	
})
