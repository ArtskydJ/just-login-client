var dnode = require('dnode')
//var domready = require('domready');
var shoe = require('shoe');
var d = dnode() //no listening!
var stream = shoe('/dnode');

function init(cb) { //cb(api, session)
	d.on('remote', function (serverApi) {

		glob = serverApi //allows me to run these functions in the browser console

		serverApi.continueExistingSession(13, function(err, fullApi, sessionId) {
			if (err && err.invalidSessionId) {
				console.log("Whoops, bad session id attempt")
				serverApi.createNewSession(function(err, fullApi, sessionId) {

				})
			}
			else if (err)
				console.log(err)

		})


	})
	d.pipe(stream).pipe(d);
	//do not run d.end()!
}

/*
var events = require('events')

	var emitter = new events.EventEmitter()
	var loggedIn, prevLoggedIn
	emitter.beginAuthentication = jlc.beginAuthentication.bind(jlc, sessionId)
	emitter.isAuthenticated =     jlc.isAuthenticated.bind(jlc, sessionId)
	emitter.unauthenticate =      jlc.unauthenticate.bind(jlc, sessionId)
	prevLoggedIn = emitter.isAuthenticated()
	setInterval(function() {
		loggedIn = emitter.isAuthenticated()
		if (loggedIn != prevLoggedIn) {
			emitter.emit('log'+loggedIn?'in':'out')
		}
	}, 1000)
*/
