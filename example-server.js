var dnode = require('dnode')
var browserApi = require('./browserApi.js')
var fs = require('fs')
var http = require('http');
var shoe = require('shoe');


/*var server = http.createServer();
server.listen(9999);
server.on('request', function(req, res) {*/
var server = http.createServer().listen(9999).on('request', function(req, res) {
	console.log("connection initiated")
	fs.readFile("./client-b.js", {encoding:'utf8'}, function(err, data) {
		if (err)
			res.end('<h1>joseph</h1>', 'utf8')
		else
			res.end("<script>"+data+"</script>", 'utf8')
	})
})

var sock = shoe(function (stream) {
	var d = dnode(browserApi);
	d.pipe(stream).pipe(d);
});
sock.install(server, '/dnode');
