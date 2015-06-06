var http = require('http');
http.get(process.argv[2], function(res) {
  // res è un oggetto Response che è un ReadableStream.
  console.log("Got response: " + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  //res.setEncoding('utf8'); // La codifica a utf8 converte il buffer in stringa automaticamente senza dover fare toString().
  res.on('data', function(chunk){
	  // L'argomento chunk è un chunk di dati. 
	  // E' sempre un Buffer
	  console.log('%s - %d bytes', chunk.toString(), chunk.length);
  })
  res.on('end', function(){
	  console.log('end');
  })
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});