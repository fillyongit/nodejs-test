var buffer = new ArrayBuffer(16);

var int32View = new Int32Array(buffer);
for (var i = 0; i < int32View.length; i++) {
	  int32View[i] = i * 2;
}

var int16View = new Int16Array(buffer);
for (var i = 0; i < int16View.length; i++) {
	  console.log("Entry " + i + ": " + int16View[i]);
}
console.log(" ------------------------- ");
var int8View = new Int8Array(buffer);
for (var i = 0; i < int8View.length; i++) {
	  console.log("Entry " + i + ": " + int8View[i]);
}