/**
 * Eseguire come utente apache se si vuoe poi che uno script php possa scrivere sullo stesso local socket del server.
 * sudo -u www-data /path/to/node server-ws.js
 */
var net = require('net'),
	app = require('http').createServer(),
    log4js = require('log4js'),
    fs = require('fs'),
    bl = require('bl'),
    io = require('socket.io')(app),
    os = require('os');
//console.log(__dirname + '/server-ws.log');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file(__dirname + '/server-ws.log'));
var logger = log4js.getLogger();
logger.setLevel('INFO');

var socketPath = os.tmpdir() + '/bac.sock';

process.on('beforeExit', function() {
	wss.broadcast('SIGTERM');
	logger.info('BeforeExit');
});
process.on('exit', function(code) {
	fs.unlinkSync(socketPath);
	logger.info('Node esce con il codice: ' + code);
});
process.on('SIGINT', function() {
	// Rimuove il socket.
	logger.info('SIGINT ricevuto. Processo interrotto.');
	process.exit(0);
});
process.on('SIGBREAK', function() {
	// Su windows.
	logger.info('SIGBREAK ricevuto. Processo interrotto.');
	process.exit(0);
});
process.on('SIGTERM', function() {
	// Su windows.
	logger.info('SIGTERM ricevuto. Processo interrotto.');
	process.exit(0);
});
 
// Rimuove il file socket.
if (fs.existsSync(socketPath)) {
	fs.unlinkSync(socketPath);
}

var server = net.createServer(function(socket){
	// Connection callback. E' come server.on('connection', function(socket){ ... });
	// Socket è un ReadableStream.
	socket.setEncoding('utf8');
	socket.setTimeout(30000);
	socket.on('data', function(buffer){
		//logger.info('Dati ricevuti da: ' + socket.remoteAddress + ':' + socket.remotePort);
		//logger.info('data received...' + buffer.toString() + ' ' + buffer.length + ' ' + socket.bytesRead);
	});
	socket.pipe(bl(function(err,buffer){
		var data = buffer.toString();
		logger.info(data + ' ' + buffer.length);
		try {
			data = JSON.parse(data);
			if (data.pid == process.pid) {
				if (data.type == 'evento') {
					evento.emit('data', data);
				}
				else if (data.type == 'registrazione') {
					registrazione.emit('data', data);
				}
				else if (data.type == 'anomalia') {
					anomalia.emit('data', data);
				}				
			}
			else {
				logger.warn('NetServer - Dati ricevuti non validi: PID non corrispondente.');
			}
		}
		catch(e){
			logger.warn('NetServer - Dati ricevuti non validi: non è una stringa JSON valida.');
		}
	}));
	socket.on('end', function(){
		logger.info('NetServer - Fine trasmissione client. Bytes ricevuti: ' + socket.bytesRead);
	});
	socket.on('close', function(){
		logger.info('NetServer - Socket chiuso.');
	});
	socket.on('error', function(e){
		logger.info('NetServer - errore: ' + e);
	});
	socket.on('timeout', function(){
		logger.info('NetServer - Timeout');
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
	  else {
		  logger.error(e);
	  }
});

app.listen(process.argv[2]);

// Canali.
// Canale per eventi.
var evento = io.of('/evento');
evento.on('connection', function (s) {
	logger.info('Nuova connessione WebSocket namespace evento');
});
//Canale per registrazioni.
var registrazione = io.of('/registrazione');
registrazione.on('connection', function (s) {
	logger.info('Nuova connessione WebSocket namespace registrazione');
});
//Canale per anomalie.
var anomalia = io.of('/anomalia');
anomalia.on('connection', function (s) {
	logger.info('Nuova connessione WebSocket namespace anomalia');
});