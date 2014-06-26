
process.nextTick(function () { //instead of domready? seems to work...
	console.log("build 005")
	var dnode = require('dnode')
	//var domready = require('domready');
	var shoe = require('shoe');
	var d = dnode()
	var stream = shoe('/dnode');
	d.on('remote', function (api) {
		glob = api //allows me to run these functions in the browser console

		api.createNewSession(function(err, fullApi, sessionId) {
			fullApi.tryToLogIn("hi@lol.com")
			console.log("if the mailer console.logs anything, than you are maybe logged in!")
		})

		api.continueExistingSession(13, function(err, fullApi, sessionId) {
			if (err)
				console.log("Whoops, bad session id attempt")
			else
				console.log("The server told me that my sessionid was", sessionId)
			fullApi.tryToLogIn('me@JoshDuff.com')
			fullApi.tryToLogIn('butts@JoshDuff.com')
		})

		api.createNewSession(function(err, fullApi) {
			fullApi.tryToLogIn('someoneelse@fake.com')
		})

		api.createNewSession(function(err, fullApi) {
			fullApi.tryToLogIn('MORE PERSON@fake.com')
		})

		//do not run d.end()!
	})
	d.pipe(stream).pipe(d);
});

