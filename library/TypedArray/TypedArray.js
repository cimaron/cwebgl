/*
Copyright (c) 2011 Cimaron Shanahan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


if (typeof ArrayBuffer == 'undefined') {
	ArrayBuffer = function(length) {
		var i;
		if (this == window) {
			return new ArrayBuffer(length);
		}
		for (i = 0; i < length; i++) {
			this[i] = 0;
		}
		this.byteLength = length;
		this.BYTES_PER_ELEMENT;
	};
	Array.BYTES_PER_ELEMENT = 1;
	ArrayBuffer.prototype = Array;
	ArrayBuffer.native = false;
} else {
	ArrayBuffer.native = true;
}

function TypedArray(buffer, byteOffset, length, bytes) {
	var i;
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
		for (i = byteOffset; i < length; i++) {
			this[i] = buffer[i];	
		}
	}
	this.length = length;
	this.byteLength = length * bytes;
};
TypedArray.prototype = Array;
TypedArray.getType = function(a) {
	var i, types;
	types = [Uint8Array, Uint16Array, Float32Array];
	for (i = 0; i < types.length; i++) {
		if (a instanceof types[i]) {
			return types[i];
		}
	}
};

if (typeof Uint8Array == 'undefined') {
	//we have a special shortcut for Uint8Arrays (Canvas ImageData!)
	(function() {
		var ctx = document.createElement('canvas').getContext('2d');
		Uint8Array = function(buffer, byteOffset, length) {
			if (this == window) {
				return new Uint8Array(buffer, byteOffset, length);
			}
			if (typeof length == 'undefined') {
				if (typeof buffer == 'object') {
					length = buffer.length;	
				} else {
					length = buffer;
					buffer = null;
				}
			}
			var data = ctx.createImageData(length, 1).data;
			TypedArray.apply(data, [buffer, byteOffset, length, Uint8Array.BYTES_PER_ELEMENT]);
			return data;
		};
	}());
	Uint8Array.BYTES_PER_ELEMENT = 1;
	Uint8Array.native = false;
} else {
	Uint8Array.native = true;
}

if (typeof Uint16Array == 'undefined') {
	Uint16Array = function(buffer, byteOffset, length) {
		if (this == window) {
			return new Uint16Array(buffer, byteOffset, length);
		}
		TypedArray.apply(this, [buffer, byteOffset, length, Uint16Array.BYTES_PER_ELEMENT]);
	};
	Uint16Array.BYTES_PER_ELEMENT = 1;
	Uint16Array.native = false;
} else {
	Uint16Array.native = true;
}

if (typeof Float32Array == 'undefined') {
	Float32Array = function(buffer, byteOffset, length) {
		if (this == window) {
			return new Float32Array(buffer, byteOffset, length);
		}
		TypedArray.apply(this, [buffer, byteOffset, length, Float32Array.BYTES_PER_ELEMENT]);
	};
	Float32Array.BYTES_PER_ELEMENT = 1;
	Float32Array.native = false;
} else {
	Float32Array.native = true;
}



