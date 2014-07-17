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


/**
 * IR Instruction Class
 *
 * Represents a single assembly-like instruction
 */
function IrInstruction(op, d, s1, s2, s3, gen) {
	var args;

	if (gen) {
		d = IRS.getTemp();
	}

	this.str = null;
	this.line = null;

	if (arguments.length == 1) {
		args = op.split(/[\s,]/);
		op = args[0];
		d = args[1];
		s1 = args[2];
		s2 = args[3];
		s3 = args[4];
	}

	this.op = op;
	this.d = this.operand(d);
	this.s1 = this.operand(s1);
	this.s2 = this.operand(s2);
	this.s3 = this.operand(s3);
}

IrInstruction.operands = ['d', 's1', 's2', 's3'];


IrInstruction.prototype.operand = function(opr) {
	return opr ? new IrOperand(opr) : "";
};

/**
 * Adds the offset to all operands
 *
 * @param   integer    The offset to set
 */
IrInstruction.prototype.addOffset = function(offset) {
	var i, o;

	for (i = 0; i < IrInstruction.operands.length; i++) {
		o = IrInstruction.operands[i];
		if (this[o]) {
			this[o].addOffset(offset);	
		}
	}
};

/**
 * Set the swizzle components on all operands
 *
 * @param   string    The swizzle to set
 */
IrInstruction.prototype.setSwizzle = function(swz) {
	var i, o;

	for (i = 0; i < IrInstruction.operands.length; i++) {
		o = IrInstruction.operands[i];
		if (this[o] && !this[o].swizzle) {
			this[o].swizzle = swz;
		}
	}
};

/**
 * toString method
 *
 * @return  string
 */
IrInstruction.prototype.toString = function() {
	var out;
	out = util.format("%s%s%s%s%s;",
		this.op,
		this.d  ? ' '  + this.d  : '',
		this.s1 ? ', ' + this.s1 : '',
		this.s2 ? ', ' + this.s2 : '',
		this.s3 ? ', ' + this.s3 : ''
		);
	return out;
};

/**
 * IR Comment Class
 *
 * Represents a single comment
 */
function IrComment(comment, loc) {
	this.comment = comment;
	this.loc = loc;
}

IrComment.prototype.toString = function() {
	var c = this.comment;

	if (this.loc) {
		c = util.format("[%s:%s-%s:%s] %s", this.loc.first_line, this.loc.first_column, this.loc.last_line, this.loc.last_column, c);
	}
	c = '# ' + c;

	return c;
};


/**
 * IR Operand Class
 *
 * Represents a single operand
 */
function IrOperand(str, raw) {

	this.full = "";
	this.neg = "";
	this.name = "";
	this.address = "";
	this.swizzle = "";
	this.number = "";
	this.raw = "";

	if (raw) {
		this.full = str;
		this.raw = str;
	} else {
		this.parse(str);
	}
}

/**
 * Parses operand string
 *
 * @param   string    string that represents a single variable
 */
IrOperand.prototype.parse = function(str) {
	var parts, regex;

	if (!str) {
		return;
	}

	//neg
	regex = "(\-)?";

	//name (include '%' for our code substitution rules)
	regex += "([\\w%]+)";

	//address
	regex += "(?:@(\\d+))?";

	//swizzle
	regex += "(?:\\.([xyzw]+))?";

	regex = new RegExp("^" + regex + "$");

	if (parts = str.match(regex)) {

		this.neg = parts[1] || "";
		this.name = parts[2];
		this.address = parseInt(parts[3]) || 0;
		this.swizzle = parts[4] || "";
	} else {
		if (parts = str.match(/^"(.*)"$/)) {
			this.raw = parts[1];
		} else {
			this.raw = str;
		}
	}

	this.full = this.toString();
};

/**
 * Adds an offset
 *
 * @param   integer    Offset to add
 */
IrOperand.prototype.addOffset = function(offset) {

	this.address = this.address || 0;

	this.address += offset;
};

/**
 * toString method
 *
 * @return  string
 */
IrOperand.prototype.toString = function() {
	var str;

	if (this.raw) {
		str = this.raw;	
	} else {
		str = this.neg + this.name + ("@" + this.address) + (this.swizzle ? "." + this.swizzle : "");
	}
	
	return str;
};





