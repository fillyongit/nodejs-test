var fs = require('fs');

fs.readFile('media/image.gif', 'hex', function (err, data) {
	  if (err) throw err;
	  var str = '';
	  var cnt = 1;
	  var sep = '';
	  for(var b of data) {
		str += sep + b;
		if (cnt > 0 && cnt % 2 == 0) {
			sep = ' ';
		}
		else {
			sep = '';
		}
		cnt++;
	  }
	  console.log('Size ' + cnt/2 + ' bytes');
	  console.log(str);
});