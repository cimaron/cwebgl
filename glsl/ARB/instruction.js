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

(function(ARB, StdIO) {

	ARB.Operand = (function() {
	
		//Internal Constructor
		function Initializer() {
			this.name = "";
			this.neg = "";
			this.offset = "";
			this.swizzle = "";
		}

		var Operand = jClass('Operand', Initializer);

		//public:

		/**
		 * Constructor
		 */
		Operand.Operand = function(str) {
			this.parse(str);
		}

		/**
		 * Parses operand string
		 *
		 * @param   string    string that represents a single variable
		 */
		Operand.parse = function(str) {
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
				throw new Error(StdIO.sprintf("Could not parse operand %s", str));
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
		Operand.addOffset = function(offset) {
			if (offset === 0 && this.offset === "") {
				this.offset = 0;
			}
			if (!offset) {
				return;
			}
			this.offset = this.offset ? this.offset + offset : offset;	
		}

		/**
		 * toString method
		 *
		 * @return  string
		 */
		Operand.toString = function() {
			var off, swz;
			off = (this.offset || this.offset === 0) ? StdIO.sprintf("[%s]", this.offset) : ""
			swz = this.swizzle ? "." + this.swizzle : "";
			return StdIO.sprintf("%s%s%s%s", this.neg, this.name, off, swz);
		};

		return Operand.Constructor;

	}());

	/**
	 * ARB::Instruction Class
	 *
	 * Represents a single assembly-like instruction
	 */
	ARB.Instruction = (function() {

		//Internal Constructor
		function Initializer() {
			//public:
			this.str = null;
			this.line = null;

			this.op = null;
			this.d = null;
			this.s1 = null;
			this.s2 = null;
			this.s3 = null;
		}

		var Instruction = jClass('Instruction', Initializer);

		//public:

		/**
		 * Constructor
		 */
		Instruction.Instruction = function() {
			if (arguments.length == 1) {
				arguments = str.split(/ *[ ,] */);
			}
			this.op = arguments[0];
			this.d = this.operand(arguments[1]);
			this.s1 = this.operand(arguments[2]);
			this.s2 = this.operand(arguments[3]);
			this.s3 = this.operand(arguments[4]);
		};

		/**
		 * Constructor
		 */
		Instruction.operand = function(opr) {
			return opr ? new ARB.Operand(opr) : null;
		};

		/**
		 * Adds the offset to all operands
		 *
		 * @param   integer    The offset to set
		 */
		Instruction.addOffset = function(offset) {
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
		Instruction.setSwizzle = function(swz) {
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
		Instruction.toString = function() {
			var out;
			out = StdIO.sprintf("%s%s%s%s%s;\n",
				this.op,
				this.d  ? ' '  + this.d  : '',
				this.s1 ? ', ' + this.s1 : '',
				this.s2 ? ', ' + this.s2 : '',
				this.s3 ? ', ' + this.s3 : ''
				);
			return out;
		};

		return Instruction.Constructor;

	}());

 }(ARB, StdIO));

