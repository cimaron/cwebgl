

if (typeof Float32Array == 'undefined') {
	
Float32Array = function(buffer, byteOffset, length) {

	if (typeof byteOffset == 'undefined') {
		byteOffset = 0;	
	}
	
	if (typeof length == 'undefined') {
		if (typeof buffer == 'object') {
			length = buffer.length;	
		} else {
			length = buffer;
			buffer = null;
		}
	}

	if (buffer) {
		for (var i = byteOffset; i < length; i++) {
			this[i] = buffer[i];	
		}
	}
	this.length = length;
}

Float32Array.native = false;

//Float32Array.prototype = Array;

	
} else {
	Float32Array.native = true;	
}
