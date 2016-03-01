var littleEndian = (function() {
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true /* littleEndian */);
  return new Int16Array(buffer)[0] === 256; // Int16Array uses the platform's endianness.
})();
console.log(littleEndian);