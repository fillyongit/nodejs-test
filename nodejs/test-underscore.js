var _ = require('underscore');
_.each(process.argv, function(el, i){
	console.log(el + i);
});