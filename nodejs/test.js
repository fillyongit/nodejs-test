var mysql = require('mysql');

setImmediate(function(){
	console.log('ciao');
});
var i = setInterval(function(){
	console.log('cips');
}, 2000);
i.unref();