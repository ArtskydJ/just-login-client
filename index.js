var connectToServer = function connectToServer(cb) {
	var domready = require('domready');
	var shoe = require('shoe');
	var dnode = require('dnode');

	domready(function () {
		var stream = shoe('/dnode');
		
		var d = dnode();
		d.on('remote', cb);
		d.pipe(stream).pipe(d);
		//d.end();
	})
}

module.exports = connectToServer
