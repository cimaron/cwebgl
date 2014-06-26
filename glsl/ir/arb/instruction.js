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

var util = require('util');

/**
 * Constructor
 */
function Operand(str) {
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
Operand.prototype.parse = function(str) {
	var parts, swz;

	if (!str) {
		return;
	}
	
	//extract and check for swizzle at end
	parts = str.split('.');
	swz = parts.pop();
	if (!swz.match(/^([xyzw]+|[rgba]+)$/)) {
		parts.push(swz);
		swz = "";
	}
	swz = swz.replace(/r/g, 'x');
	swz = swz.replace(/g/g, 'y');
	swz = swz.replace(/b/g, 'z');
	swz = swz.replace(/a/g, 'w');
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
Operand.prototype.addOffset = function(offset) {
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
Operand.prototype.toString = function() {
	var off, off2, swz;
	off = (this.offset || this.offset === 0) ? util.format("[%s]", this.offset) : "";
	off2 = (this.offset2 || this.offset2 === 0) ? util.format("[%s]", this.offset2) : null;
	swz = this.swizzle ? "." + this.swizzle : "";
	return util.format("%s%s%s%s", this.neg, this.name, off2 || off, swz);
};

/**
 * ARB::Instruction Class
 *
 * Represents a single assembly-like instruction
 */
function Instruction() {
	this.str = null;
	this.line = null;

	if (arguments.length == 1) {
		arguments = str.split(/ *[ ,] */);
	}
	this.op = arguments[0];
	this.d = this.operand(arguments[1]);
	this.s1 = this.operand(arguments[2]);
	this.s2 = this.operand(arguments[3]);
	this.s3 = this.operand(arguments[4]);
}

Instruction.prototype.operand = function(opr) {
	return opr ? new ARB.Operand(opr) : null;
};

/**
 * Adds the offset to all operands
 *
 * @param   integer    The offset to set
 */
Instruction.prototype.addOffset = function(offset) {
	if (!offset) {
		return;
	}
	this.d ? this.d.addOffset(offset) : null;
	this.s1 ? this.s1.addOffset(offset) : null;
	this.s2 ? this.s2.addOffset(offset) : null;
	this.s3 ? this.s3.addOffset(offset) : null;
};

/**
 * Set the swizzle components on all operands
 *
 * @param   string    The swizzle to set
 */
Instruction.prototype.setSwizzle = function(swz) {
	this.d  && !this.d.swizzle  ? this.d.swizzle  = swz : null;
	this.s1 && !this.s1.swizzle ? this.s1.swizzle = swz : null;
	this.s2 && !this.s2.swizzle ? this.s2.swizzle = swz : null;
	this.s3 && !this.s3.swizzle ? this.s3.swizzle = swz : null;
};

/**
 * toString method
 *
 * @return  string
 */
Instruction.prototype.toString = function() {
	var out;
	out = util.format("%s%s%s%s%s;\n",
		this.op,
		this.d  ? ' '  + this.d  : '',
		this.s1 ? ', ' + this.s1 : '',
		this.s2 ? ', ' + this.s2 : '',
		this.s3 ? ', ' + this.s3 : ''
		);
	return out;
};

module.exports = {
	Operand : Operand,
	Instruction : Instruction
};

