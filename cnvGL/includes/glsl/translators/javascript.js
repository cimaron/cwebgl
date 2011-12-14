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

(function(glsl) {
	var sprintf, output;
	
	sprintf = glsl.sprintf;

	/**
	 * Parses register string and returns info
	 *
	 * @param   string    string that represents a single register
	 *
	 * @return  object    Object containing name and vector fields
	 */
	function parseRegister(reg) {
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
	}

	function translateParam(line) {
		var m, p, i, d, di, dim;
		m = line.match(/^PARAM ([a-z]+)\[([0-9]+)\] = \{(.*)\}/);
		p = m[3];

		p = p.split(",");
		d = [];
		
		for (i = 0; i < p.length; i++) {

			//clean whitespace
			di = p[i].replace(' ', '');

			//constant initializer
			if (dim = di.match(/\{(.*)\}/)) {
				di = "[" + dim[1] + "]";
				d.push(di);
				continue;
			}

			//range initializer
			if (dim = di.match(/(.+)\[([0-9]+)\.\.([0-9]+)\]/)) {
				for (di = parseInt(dim[2]); di <= parseInt(dim[3]); di++) {
					d.push(sprintf("%s[%s]", dim[1], di));
				}
				continue;
			}
		}
		
		output += sprintf("var %s = [%s];\n", m[1], d.join(", "));
	}

	/**
	 * Translates ASM opcode into output format
	 *
	 * @param   string    string that represents a single opcode
	 */
	function translateOpcode(op) {
		var out, dest, src1, src2, src3, i, c, d, s1, s2, s3;

		out = "";

		//add original opcode in comment for debugging
		out += glsl.sprintf("//%s\n", op);

		//split operands
		op = op.replace(';', '');
		op = op.split(/[ ,]+/);

		//process registers
		for (var i = 1; i < op.length; i++) {
			op[i] = parseRegister(op[i]);
		}

		//shortcuts
		dest = op[1];
		src3 = op[4] ? op[4] : parseRegister("");
		src2 = op[3] ? op[3] : src3;
		src1 = op[2] ? op[2] : src3;

		//if vector operation, we need to loop over each element and grab the appropriate float element
		for (i = 0; i < dest.comp.length; i++) {
			c = dest.comp[i];
			d = dest.name + c;
			s1 = src1.name + (src1.swz ? src1.comp[i] : c);
			s2 = src2.name + (src2.swz ? src2.comp[i] : c);
			s3 = src3.name + (src3.swz ? src3.comp[i] : c);

			switch (op[0]) {

				case 'ADD':
					out += glsl.sprintf("%s = %s + %s;\n", d, s1, s2);
					break;

				case 'MAD':
					out += glsl.sprintf("%s = %s * %s + %s;\n", d, s1, s2, s3);
					break;

				case 'MOV':
					out += glsl.sprintf("%s = %s;\n", d, s1);
					break;

				case 'MUL':
					out += glsl.sprintf("%s = %s * %s;\n", d, s1, s2);
					break;

				case 'TEMP':
					out += sprintf("var %s = new Float32Array(4);\n", dest.name);
					return out;

				default:
					throw new Error('Unknown op ' + op[0]);
			}
		}

		return out;
	}

	/**
	 * Translates a source line
	 *
	 * @param   string    a single line
	 * @param   int       the line number
	 */
	var buffer = '';
	function translateLine(line, i) {

		//if any statements extended into multiple lines, it will be buffered
		line = buffer + line;
		buffer = "";

		//set vertex mode
		if (line == '!!ARBvp1.0') {
			this.mode = 1;
			output += sprintf("//%s\n%s\n", line, "function main() {");
			return;
		}

		//set fragment mode
		if (line == '!!ARBfp1.0') {
			this.mode = 2;
			output += sprintf("%s\n//%s\n", "function main() {\n", line);
			return;
		}

		if (line.match(/^#/)) {
			output += sprintf("//%s\n", line);
			return;
		}

		if (line.match(/^\s*$/)) {
			output += "\n";
			return;
		}

		if (line.match(/^END/)) {
			output += "return;\n}\n";
			return;
		}
		
		if (line.indexOf(';') == -1) {
			buffer = line;
			return;
		}
		
		if (line.match(/^PARAM/)) {
			translateParam(line);
			return;
		}

		output += translateOpcode(line);
	}

	/**
	 * External interface.
	 */
	glsl.translators.javascript = {
		
		//current processing mode (1 = vertex, 2 = fragment)
		mode : 1,
		
		//final output string
		output : "",

		//opcode list for later optimization
		opcodes : [],

		/**
		 * Translates an ARB assembly string into a javascript representation
		 *
		 * @param   string    src string
		 * @param   int       1 if vertex, 2 if fragment. Can omit if string contains ARB start line
		 */
		process : function(src, mode) {
			var i;

			output = "";

			if (mode) {
				this.mode = mode;	
			}

			src = src.split("\n");

			for (i = 0; i < src.length; i++) {
				translateLine(src[i], i);
			}

			this.output = output;
			//optimize();
		}

	};

}(glsl));

