var http = require('http'),
    dispatcher = require('httpdispatcher'),
    WebSocketServer = require('ws').Server;

// https://github.com/websockets/ws
 
dispatcher.setStatic('static');
 
var adminWS = [];
 
var notify = function(req, res) {
  for(c in adminWS)
    c.send(JSON.stringify({
      ip: req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      time: (new Date()).getTime()
    }));
}
 
dispatcher.onGet("/homepage", function(req, res) {
    res.end("<h1>Homepage</h1");
    notify(req, res);
});
 
var server = http.createServer(function (req, res) {
	console.log(req.origin);
    dispatcher.dispatch(req, res);
});
 
server.listen(8080, '127.0.0.1', function(err, data){
	console.log(data);
});
var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
	console.log('nuova connessione');
	console.log(ws);
	setInterval(function() { 
/*
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '< MySQL username >',
  password : '< MySQL password >',
  database : '<your database name>'
});

connection.connect();

connection.query('SELECT * from < table name >', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();
*/
		ws.send(JSON.stringify({msg: 'connessione avvenuta'})) 
	}, 2000);
    adminWS.push(ws);
});