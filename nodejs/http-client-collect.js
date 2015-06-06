var http = require('http');
var bl = require('bl');
// bl is a storage object for collections of Node Buffers
http.get(process.argv[2], function(response) {
	response.pipe(bl(function (err, data) {
		// Note that when you use the callback method like this, 
		// the resulting data parameter is a concatenation of all Buffer objects in the list
	    if (err)
	      return console.error(err)
	    data = data.toString()
	    console.log(data.length)
	    console.log(data)
	  }));
});