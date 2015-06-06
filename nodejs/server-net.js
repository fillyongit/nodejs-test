// Crea un server TCP.
var net = require('net');
var server = net.createServer(function(socket){
	// Connection callback. E' come server.on('connection', function(socket){ ... });
	// Socket è un ReadableStream.
	
	var date = new Date();
	socket.write(date.getFullYear() + '-' + 
			date.getMonth() + '-' + 
			date.getDay() + ' ' + 
			date.getHours() + ':' + 
			date.getMinutes()
	);
	
	socket.on('end', function(){
		console.log('client disconnected');
	})
});
// unix domain socket. Es.: /tmp/test.sock
server.listen(process.argv[2], function(){
	// Listenimg callback.
	console.log('Server bound on %j', server.address());
});