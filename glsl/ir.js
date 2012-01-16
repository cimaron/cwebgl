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
 * IR class
 */
(function(glsl, StdIO, ARB) {

	/**
	 * IR Class
	 *
	 * Stores intermediate representation (3-address code)
	 */	
	var IR = (function() {

		//Internal Constructor
		function Initializer() {
			ARB.Instruction.Initializer.apply(this);
		}
	
		var IR = jClass('IR', Initializer, ARB.Instruction);
	
		//static:
		IR.Constructor.operands = ['d', 's1', 's2', 's3'];

		//public:
	
		IR.IR = function(op, d, s1, s2, s3, gen) {
			if (gen) {
				d = IRS.getTemp(gen);
			}
			this.Instruction(op, d, s1, s2, s3);
		};

		return IR.Constructor;
	}());


	/**
	 * IRS Class
	 *
	 * Stores IR code tree
	 */	
	var IRS = (function() {

		//Internal Constructor
		function Initializer() {
			//public:
			this.code = [];
			this.last = null;
		}

		var IRS = jClass('IRS', Initializer);

		//static:
		var count = 0;
		IRS.Constructor.getTemp = function(n) {
			return n + count++;
		}

		//public:

		IRS.IRS = function() {
		};

		IRS.get = function(i) {
			return this.code[i];	
		};
	
		IRS.push = function(ir) {
			this.code.push(ir);
			this.last = ir;
		};

		IRS.getTemp = IRS.Constructor.getTemp;

		/**
		 * Replaces all instances of an operand name and base index in all instructions after start
		 *
		 * @param   integer     Starting instruction number
		 * @param   string      Old name to search for
		 * @param   string      New name to replace with
		 * @param   integer     Add offset
		 * @param   boolean     True if replacing with a completely new operand
		 */
		IRS.replaceName = function(start, old, nw, index, repl) {
			var i, j, ir, f;
	
			for (i = start; i < this.code.length; i++) {
				ir = this.code[i];

				//foreach each operand field
				for (j = 0; j < IR.operands.length; j++) {
					f = IR.operands[j];
					if (ir[f] && ir[f].name == old) {
						if (repl) {
							ir[f] = new ARB.Operand(nw);
						} else {
							ir[f].name = nw;
							ir[f].addOffset(index);
						}
					}	
				}
				
			}
		};
	
		IRS.toString = function() {
			return this.code.join("");
		};

		return IRS.Constructor;
	}());

	/**
	 * External interface
	 */
	glsl.IR = IR;
	glsl.IRS = IRS;

}(glsl, StdIO, ARB));

