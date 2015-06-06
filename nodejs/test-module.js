var fs = require('fs');
var path = require('path');
module.exports = function(dirpath, ext, callback) {
	var filteredList = [];
	fs.readdir(dirpath, function(err,data){
		if (err)
			return callback(err);
		
		filteredList = data.filter(function(filename, i){
			if (path.extname(filename).substr(1) == ext)//process.argv[2])
				return true;
			else
				return false;
		});
		
		callback(null, filteredList);
	});
}