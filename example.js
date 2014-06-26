var ba = require('./browserApi.js')

setTimeout(function() { //New session...
	ba.createNewSession(function(err,api) {
		console.log((err?"err:"+err+" | ":"")+"api:")
		console.dir(api)
		console.log("")

		setTimeout(function() { //clicky login
			api.tryToLogIn("hi@lol.com")
			console.log("if the mailer console.logs anything, than you're logged in!")
		},100)

	})
},100)
