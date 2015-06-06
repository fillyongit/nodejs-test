/**
 * Eseguire come utente apache se si vuoe poi che uno script php possa scrivere sullo stesso local socket del server.
 * sudo -u www-data /path/to/node server-ws.js
* /https://github.com/websockets/ws
 */
var net = require('net'),
    WebSocketServer = require('ws').Server,
    log4js = require('log4js'),
    fs = require('fs'),
    bl = require('bl');

console.log(__dirname + '/server-ws.log');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file(__dirname + '/server-ws.log'), 'serverws');
var logger = log4js.getLogger('serverws');
logger.setLevel('INFO');

var socketPath = '/tmp/bac.sock';

process.on('exit', function(code) {
	fs.unlinkSync(socketPath);
	logger.info('Node esce con il codice: ' + code);
});
process.on('SIGINT', function() {
	// Rimuove il socket.
	logger.info('Processo interrotto.');
	process.exit(0);
});
process.on('SIGBREAK', function() {
	// Su windows.
	logger.info('Processo interrotto.');
	process.exit(0);
});
process.on('SIGTERM', function() {
	// Su windows.
	logger.info('SIGTERM ricevuto. Processo interrotto.');
	wss.broadcast('SIGTERM');
	process.exit(0);
});

//var adminWS = [];
 
/*var notify = function(event) {
  for(c in adminWS)
    c.send(JSON.stringify({
      time: (new Date()).getTime()
    }));
};*/
 
// Rimuove il file socket.
fs.unlink(socketPath, function(err){
	if(err)
		logger.error(err);
});

var server = net.createServer(function(socket){
	// Connection callback. E' come server.on('connection', function(socket){ ... });
	// Socket è un ReadableStream.
	//socket.setEncoding('utf8');
	socket.setTimeout(30000);
	socket.on('data', function(buffer){
		logger.info('Dati ricevuti da: ' + socket.remoteAddress + ':' + socket.remotePort);
		//logger.info('data received...' + buffer.toString() + ' ' + buffer.length + ' ' + socket.bytesRead);
	});
	socket.pipe(bl(function(err,buffer){
		var data = buffer.toString();
		try {
			data = JSON.parse(data);
			if (data.pid == process.pid) {
				wss.broadcast(data.data);
			}
			else {
				logger.warn('Dati ricevuti non validi: PID non corrispondente.');
			}
		}
		catch(e){
			logger.warn('Dati ricevuti non validi: non è una stringa JSON valida.');
		}
		logger.info(buffer.toString() + ' ' + buffer.length);
	}));
	socket.on('end', function(){
		logger.info('Fine trasmissione client. Bytes ricevuti: ' + socket.bytesRead);
	});
	socket.on('close', function(){
		logger.info('Socket chiuso completamente');
	});
	socket.on('timeout', function(){
		logger.info('Timeout');
		socket.destroy();
	});	
});
server.listen(socketPath, function(){
	logger.info('Server bound on %j', server.address());
});
server.on('close', function (e) {
	logger.error('Server closed.');
});
server.on('error', function (e) {
	  if (e.code == 'EADDRINUSE') {
	    logger.error('Server socket in use!');
	  }
});

var wss = new WebSocketServer({port: process.argv[2]}, function(err, data) {
	// Listening callback.
	logger.info('WebSocketServer listening...');
});
wss.broadcast = function broadcast(data) {
	  wss.clients.forEach(function each(client) {
	    client.send(data);
	  });
};
wss.on('connection', function(ws) {
	logger.info('Nuova connessione WebSocket: ');
//	setInterval(function() {
//		ws.send(JSON.stringify({msg: 'connessione avvenuta'})); 
//	}, 2000);
    //adminWS.push(ws);
});
wss.on('error', function (e) {
	  if (e.code == 'EADDRINUSE') {
	    logger.error('WebSocketServer: indirizzo già usato');
	  }
});