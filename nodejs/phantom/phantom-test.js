// Phantomjs non è altro che un package node che usa le api javascript esposte dall'applicazione
// phantom che phantomjs ha piazzato sotto node_modules/phnatomjs/lib/phantom/phantom.exe
// Infatti l'oggetto child_process non fa altro che eseguire phantom passandogli lo script js come argomento.
// E' lo script passato come argomento che usa veramente le api di phantom.
// Quindi ricapitolando: node esegue questo script che a sua volta esegue phantom passandolgi lo script specificato come argomento.

// node phantom-test.js

var path = require('path') // package nativo di node
var childProcess = require('child_process') // package nativo di node
var phantomjs = require('phantomjs')
var binPath = phantomjs.path

console.log(binPath);

var childArgs = [
      path.join(__dirname, 'responsive-screenshot.js'),
      'http://www.janus.it' //  argomnento
]
    
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
   // handle results 
	console.log(err);
	console.log(stdout);
	console.log(stderr);
})
//var page = require('webpage').create();
//page.open('http://www.janus.it', function(status) {
//  console.log("Status: " + status);
//  if(status === "success") {
//    page.render('example.png');
//  }
//  phantom.exit();
//});