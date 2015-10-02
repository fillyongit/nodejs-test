var sum = 0;
console.log(process.argv);
process.argv.slice(2).forEach(function(v, i, a){
	console.log(v);
	sum += Number(v);
});

console.log(sum);