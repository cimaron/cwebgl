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

(function(ARB) {

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

			this.opcode = null;
			this.dest = null;
			this.src1 = null;
			this.src2 = null;
			this.src3 = null;

			this.left = null;
			this.right = null;
		}

		var Instruction = jClass('Instruction', Initializer);

		//public:

		/**
		 * Constructor
		 */
		Instruction.Instruction = function(str, line) {
			this.str = str;
			this.line = line;
			this.parse();
		};

		/**
		 * Parses an Instruction string
		 *
		 * @param   string    string that represents a single instruction
		 */
		Instruction.parse = function() {
			var parts;
			parts = this.str.split(/ *[ ,] */);
			this.opcode = parts[0];
			this.dest = parts[1] || "";
			this.src1 = parts[2] || "";
			this.src2 = parts[3] || "";
			this.src3 = parts[4] || "";
		};

		/**
		 * Parses variable string and returns info
		 *
		 * @param   string    string that represents a single variable
		 *
		 * @return  object    Object containing name and used fields
		 */
		Instruction.Constructor.parseVar = function(reg) {
			var info, comp, hs, swz, i;
	
			//match and set default swizzle if not present
			comp = reg.match(/(.*)\.([xyzw]+|[rgba]+)$/);
			swz = comp ? comp[2] : 'xyzw';
	
			swz = swz.replace(/r/g, 'x');
			swz = swz.replace(/g/g, 'y');
			swz = swz.replace(/b/g, 'z');
			swz = swz.replace(/a/g, 'w');
	
			swz = swz.split("");
	
			info = {
				name : comp ? comp[1] : reg,
				size : swz.length,
				swz : !!comp,
				comp : []
			};

			for (i = 0; i < 4; i++) {
	
				//exact swizzle specified and less than 4 components, grab last one
				if (info.size <= i) {
					//repeat last one
					info.comp.push(info.comp[i - 1]);	
				} else {
					//push the location of the current component
					info.comp.push("[" + "xyzw".indexOf(swz[i]) + "]");			
				}
			}
	
			return info;
		};
		
		/**
		 * toString method
		 *
		 * @return  string
		 */
		Instruction.toString = function() {
			var out, src1, src2, src3, dest;

			out = '';

			dest = this.dest || "";

			src1 = this.src1;
			if (src1 && typeof src1 == 'object') {
				out += src1.toString();
				src1 = src1.dest;
			}
			
			src2 = this.src2;
			if (src2 && typeof src2 == 'object') {
				out += src2.toString();
				src2 = src2.dest;
			}

			src3 = this.src3;
			if (src3 && typeof src3 == 'object') {
				out += src3.toString();
				src3 = src3.dest;
			}

			if (!dest) {
				out += glsl.sprintf("%s;\n", this.opcode);
			}
			if (!src1) {
				out += glsl.sprintf("%s %s;\n", this.opcode, dest);
			}
			if (!src2) {
				out += glsl.sprintf("%s %s, %s;\n", this.opcode, dest, src1);
			}
			if (!src3) {
				out += glsl.sprintf("%s %s, %s, %s;\n", this.opcode, dest, src1, src2);
			} else {
				out += glsl.sprintf("%s %s, %s, %s, %s;\n", this.opcode, dest, src1, src2, src3);				
			}

			return out;
		};

		return Instruction.Constructor;

	}());

 }(ARB));

