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

var util = require('util');
var ARB = require('./arb/instruction.js');

/**
 * IR Class
 *
 * Stores intermediate representation (3-address code)
 */	
function IR(op, d, s1, s2, s3, gen) {
	if (gen) {
		d = IRS.getTemp(gen);
	}
	ARB.Instruction.call(this, op, d, s1, s2, s3);
}

util.inherits(IR, ARB.Instruction);

IR.operands = ['d', 's1', 's2', 's3'];


/**
 * IRS Class
 *
 * Stores IR code tree
 */	
function IRS() {
	this.code = [];
	this.last = null;
}

var count = 0;
IRS.getTemp = function(n) {
	return n + count++;
}

IRS.prototype.get = function(i) {
	return this.code[i];	
};
	
IRS.prototype.push = function(ir) {
	this.code.push(ir);
	this.last = ir;
};

IRS.prototype.getTemp = IRS.getTemp;

/**
 * Replaces all instances of an operand name and base index in all instructions after start
 *
 * @param   integer     Starting instruction number
 * @param   string      Old name to search for
 * @param   string      New name to replace with
 * @param   integer     Add offset
 * @param   boolean     True if replacing with a completely new operand
 */
IRS.prototype.replaceName = function(start, old, nw, index, repl) {
	var i, j, ir, f, name, neg_const;
	neg_const = old.match(/^\-([0-9]+\.[0-9]+)/);
	if (neg_const) {
		old = neg_const[1];
		neg_const = true;
	}

	for (i = start; i < this.code.length; i++) {
		ir = this.code[i];

		//foreach each operand field
		for (j = 0; j < IR.operands.length; j++) {
			f = IR.operands[j];
			if (ir[f] && ir[f].name == old) {
				if (repl) {
					ir[f] = new ARB.Operand(ir[f].neg + nw);
				} else {
					ir[f].name = nw;
					ir[f].addOffset(index);
				}
				if (neg_const && ir[f].neg) {
					ir[f].neg = "";
				}
			}	
		}
		
	}
};
	
IRS.prototype.toString = function() {
	return this.code.join("");
};

/**
 * External interface
 */
module.exports = {
	ir : IR,
	irs : IRS
};

