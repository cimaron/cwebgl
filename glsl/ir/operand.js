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
CONNECTION WITH THE SOFTWARE OR THE USE		 OR OTHER DEALINGS IN THE SOFTWARE.
*/


/**
 * Ir Operand Class
 */
function IrOperand(str) {
	this.name = "";
	this.neg = "";
	this.offset = "";
	this.offset2 = "";
	this.swizzle = "";
	this.parse(str);
}

/**
 * Parses operand string
 *
 * @param   string    string that represents a single variable
 */
IrOperand.prototype.parse = function(str) {
	var parts, swz;

	if (!str) {
		return;
	}
	
	//extract and check for swizzle at end
	parts = str.split('.');
	swz = parts.pop();
	if (!swz.match(/^([xyzw]+|[rgba]+|[stpq]+)$/)) {
		parts.push(swz);
		swz = "";
	}
	swz = swz.replace(/[xrs]/g, 'x');
	swz = swz.replace(/[ygt]/g, 'y');
	swz = swz.replace(/[zbp]/g, 'z');
	swz = swz.replace(/[waq]/g, 'w');
	this.swizzle = swz;

	//now split the rest
	parts = parts.join(".");
	parts = parts.match(/(\-?)([a-zA-Z0-9\$_\.]+)(?:(?:\[([0-9]+)\])*)$/);

	if (!parts) {
		throw new Error(util.format("Could not parse operand %s", str));
	}

	this.neg = parts[1];
	this.name = parts[2];
	this.offset = parts[3] ? parseInt(parts[3]) : "";
};

/**
 * Adds an offset
 *
 * @param   integer    Offset to add
 */
IrOperand.prototype.addOffset = function(offset) {
	if (offset === 0 && this.offset === "") {
		this.offset = 0;
	}
	if (!offset) {
		return;
	}
	this.offset = this.offset ? this.offset + offset : offset;	
};

/**
 * toString method
 *
 * @return  string
 */
IrOperand.prototype.toString = function() {
	var off, off2, swz;
	off = (this.offset || this.offset === 0) ? util.format("[%s]", this.offset) : "";
	off2 = (this.offset2 || this.offset2 === 0) ? util.format("[%s]", this.offset2) : null;
	swz = this.swizzle ? "." + this.swizzle : "";
	return util.format("%s%s%s%s", this.neg, this.name, off2 || off, swz);
};

