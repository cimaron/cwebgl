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
 * IR Class
 *
 * Stores IR code tree
 */	
function Ir() {
	this.code = [];
	this.last = null;
}

Ir.count = 0;
Ir.getTemp = function(n) {
	return n + Ir.count++;
}

Ir.prototype.getTemp = Ir.getTemp;

Ir.prototype.get = function(i) {
	return this.code[i];	
};

Ir.prototype.push = function(ir) {
	this.code.push(ir);
	this.last = ir;
};

Ir.swizzles = ["xyzw", "rgba", "stpq"];


/**
 * Replaces all instances of an operand name and base index in all instructions after start
 *
 * @param   integer     Starting instruction number
 * @param   string      Old name to search for
 * @param   string      New name to replace with
 * @param   integer     Add offset
 * @param   boolean     True if replacing with a completely new operand
 */
Ir.prototype.replaceName = function(start, old, nw, index, repl) {
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
					ir[f] = new Ir.Operand(ir[f].neg + nw);
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
	
Ir.prototype.toString = function() {
	return this.code.join("\n");
};


/**
 * Builds instructions from code table record
 *
 * @param   array       List of instruction strings
 * @param   array       List of operands
 */
Ir.prototype.build = function(code, oprds) {
	var repl, dest, parts, i, j, oprd, ir, new_swz;

	for (i = 0; i < oprds.length; i++) {
		oprd = Ir.splitOperand(oprds[i]);
		if (oprd[1]) {
			//need a new temp to move the swizzle so our code pattern works
			new_swz = swizzles[0].substring(0, oprd[1].length);
			if (oprd[1] != new_swz) {
				dest = this.getTemp('$tempv');
				ir = new IrInstruction('MOV', util.format("%s.%s", dest, new_swz), oprd.join("."));
				this.push(ir);
				oprd[0] = dest;
			}
		}
		oprds[i] = oprd[0];	
	}

	repl = [];
	for (i = oprds.length - 1; i >= 0; i--) {
		repl.push({
			s : new RegExp('%' + (i + 1), 'g'),
			d : oprds[i]
		});
	}

	for (i = 0; i < code.length; i++) {
		parts = code[i];

		if (parts.substring(0, 4) == 'TEMP') {
			repl.unshift({
				s : new RegExp(parts.substring(5), 'g'),
				d : this.getTemp('$tempv')
			});
			continue;
		}

		for (j = 0; j < repl.length; j++) {
			parts = parts.replace(repl[j].s, repl[j].d);
		}

		parts = parts.split(" ").join(",");

		this.push(new IrInstruction(parts));
	}
};

/**
 * Splits an operand into name and swizzle parts
 *
 * @param   string      The operand
 *
 * @return  array       [name, swizzle]
 */
Ir.splitOperand = function(oprd) {
	oprd = oprd.split(".");
	if (!oprd[1] || oprd[1].match(/[xyzw]+/)) {
		
	} else {
		oprd = [oprd.join(".")];
	}
	return oprd;
};






