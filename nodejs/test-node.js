// Esegui con node:
// node test-node.js
console.log(process.argv);

// Per includere moduli (globali e locali)
// require("nome modulo")


var fs = require('fs');
var path = require('path');

// path.resolve: è come se facessi
// cd __dirname
// cd media
// ..
// alla fine resituisce il percorso assoluto a file.txt
var filetxt = path.resolve(__dirname, 'media', 'file.txt');
var mediadir = path.resolve(__dirname, 'media');

//Legge un file in modo sincrono
var buffer = fs.readFileSync(filetxt);
console.log('Sync-> ' + buffer.toString().split('\n').length);

//Legge un file in modo asincrono
fs.readFile(filetxt, function(err,buffer){
	console.log(err);
	if (!err)
		console.log('Async-> ' + buffer.toString().split('\n').length);
});

// Legge una directory in modo asincrono e mostra i file con estensione html
fs.readdir(mediadir, function(err,list){
	var ext = '';
	var filteredList = list.filter(function(filename, i){
		if (path.extname(filename).substr(1) == 'html')//process.argv[2])
			return true;
		else
			return false;
	});
	console.log(filteredList);
});

// Legge una directory in modo asincrono e mostra i file con una certa estensione usando un modulo.
// La lettura della directory viene fatta nel modulo e la stampa a video viene fatta qua nel chiamante.
var myModule = require('./test-module');
myModule(mediadir, 'html', function(err,data){
  if (err)
	    return console.error('There was an error:', err)

  data.forEach(function (file) {
	  console.log(file)
  })
});