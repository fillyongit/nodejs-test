var fs = require('fs');
var path = require('path');

fs.readdir(process.argv[2], function(err,list){
	if (err) throw err;
	var ext = '';
	var filteredList = list.filter(function(filename, i){
		if (path.extname(filename).substr(1) == 'html')
			return true;
		else
			return false;
	});
	console.log(filteredList);
});