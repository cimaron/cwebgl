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
		d = IRS.getTemp(gen);
	}

	this.str = null;
	this.line = null;

	if (arguments.length == 1) {
		args = op.split(/ *, */);
		op = args[0];
		d = args[1];
		s1 = args[2];
		s2 = args[3];
		s3 = args[4];
	}

	this.op = op;
	this.d = d;
	this.s1 = s1;
	this.s2 = s2;
	this.s3 = s3;
}

IrInstruction.operands = ['d', 's1', 's2', 's3'];


IrInstruction.prototype.operand = function(opr) {
	return opr ? new Ir.Operand(opr) : null;
};

/**
 * Adds the offset to all operands
 *
 * @param   integer    The offset to set
 */
IrInstruction.prototype.addOffset = function(offset) {
	
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
IrInstruction.prototype.setSwizzle = function(swz) {
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
	var c;
	c = '# ' + this.comment;
	if (this.loc) {
		c += util.format(" [%s:%s-%s:%s]", this.loc.first_line, this.loc.first_column, this.loc.last_line, this.loc.last_column);
	}
	return c;
};

