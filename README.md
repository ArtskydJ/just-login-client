just-login-client
=================

#usage

	var client = require('just-login-client');
	client(function (remote) {
		console.log("successful connection");

		remote.createNewSession(function (err, api) {
			console.log("create new session initiated");
			if (err) {
				console.log("err:", err);
			} else {
				console.log("api:", api);
				api.isAuthenticated(function (err, addr) { e
					if (err) {
						console.log("err:", err);
					} else {
						console.log("Who is logged in:", addr);
					}
				})
			}
		});
	});
