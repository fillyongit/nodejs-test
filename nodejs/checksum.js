var buffer = new ArrayBuffer(16);

var int32View = new Int32Array(buffer);
for (var i = 0; i < int32View.length; i++) {
	  int32View[i] = i * 2;
}
for (var i = 0; i < int32View.length; i++) {
	console.log("Entry " + i + ": " + int32View[i]);
}

console.log(" ------------------------- ");

var float64Array = new Float64Array(buffer);
for (var i = 0; i < float64Array.length; i++) {
	console.log("Entry " + i + ": " + float64Array[i]);
}

console.log(" ------------------------- ");

var int16View = new Int16Array(buffer);
for (var i = 0; i < int16View.length; i++) {
	  console.log("Entry " + i + ": " + int16View[i]);
}

console.log(" ------------------------- ");

var int8View = new Int8Array(buffer);
for (var i = 0; i < int8View.length; i++) {
	  console.log("Entry " + i + ": " + int8View[i]);
}

console.log(" ------------------------- ");

// Un oggetto buffer in Node è sempre una specializzazione di UInt8Array,
// i sui elementi sono sempre chunk di 8 bit.
// In questo caso uso uno dei suoi tanti costruttori: 
// "Allocates a new Buffer using an array of octets".
var hdr1 = new Buffer([0x62,0x75,0x66,0x66,0x65]);
var hdr2 = new Buffer([0x04,0x12,0x01,0x34,0x68]);

for(var b of hdr1) {
	console.log("Entry " + b);
}

console.log(" ------------  CHECKSUM ------------- ");

var buffer = new ArrayBuffer(8);
var int16View = new Int16Array(buffer);
// Essendo il buffer di 8 byte e la DataView è Int16Array
// devo riempire 4 elementi da 16 bit ciascuno (8/2=4).
int16View[0] = 0b0000000000000001;
int16View[1] = 0b0111111111111111; // 32767 L'ultimo numero intero positivo rappresentabile con 16bit in complemento a 2. +2^(N-1)-1
int16View[2] = 0b0000000000000011;
int16View[3] = 0b1111111111111011; // -5 in complemento a 2, perchè Int16Array (come le altre view) memorizza gli interi in complemento a 2.
var sum = 0;
for (var i = 0; i < int16View.length; i++) {
	  console.log("Entry " + int16View[i]);
	  sum += int16View[i];
	  console.log("Sum " + sum);
	  // Per intercettare l'overflow si verifica se la sum è un numero rappresentabile con 
	  // più di 15 bit (> 32767). Per fare questo basta un banale bit masking dei meno significativi
	  // 15 bit. Se l''operazione restituisce il numero contenuto in sum allora vuol dire
	  // che c'è stato l'overflow altrimento deve restituire 0 (i 15 bit meno significativi sono 0)
	  // FFF8000 in binario è 1111 1111 1111 1111 1000 0000 0000 0000
	  //					  F	   F	F    F	  8	   0	0	 0
	  //console.log(sum & 0xFFFF8000);
	  if (sum & 0xFFFF8000) {
		  console.log("Overflow!");
		  sum &= 0x7FFF;
		  break;
	  }
}

//sum &= 0x7FFF;
console.log(sum);