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
	 * Import into local scope
	 */
	var sprintf = StdIO.sprintf;
	var Instruction = ARB.Instruction;

	/**
	 * Global
	 */
	var ast, symbols, header, body;

	/**
	 * Translates ASM instruction into output format
	 *
	 * @param   string    string that represents a single instruction
	 */
	function translateInstruction(ins) {
		var dest, src1, src2, src3, i, c, d, s1, s2, s3, trans;

		//add original instruction in comment for debugging
		/*
		var comment = new node('//', op.replace(";", ""));
		if (ins.opcode == 'TEMP') {
			header.push(comment);
		} else {
			body.push(comment);
		}
		*/

		//variables
		src3 = Instruction.parseVar(ins.src3 || "");
		src2 = Instruction.parseVar(ins.src2 || "");
		src1 = Instruction.parseVar(ins.src1 || "");
		dest = Instruction.parseVar(ins.dest || "");

		//if vector operation, we need to loop over each vector and grab the appropriate element
		for (i = 0; i < dest.comp.length; i++) {
			c = dest.comp[i];
			d = dest.name + c;
			s1 = src1.name + (src1.swz ? src1.comp[i] : c);
			s2 = src2.name + (src2.swz ? src2.comp[i] : c);
			s3 = src3.name + (src3.swz ? src3.comp[i] : c);

			if (!(trans = translation_table[ins.opcode])) {
				throw new error("Could not translate opcode");
			}

			s1 = symbols[s1] || s1;
			s2 = symbols[s2] || s2;
			s3 = symbols[s3] || s3;

			//console.log(ins);
			trans = trans.replace('%1', d);
			trans = trans.replace('%2', s1);
			trans = trans.replace('%3', s2);
			trans = trans.replace('%4', s3);
			
			symbols[d] = trans;

			if (d.indexOf('result') != -1) {
				body.push(sprintf("%s = %s;", d, trans));
			}
		}
	}

	var constants = {
		MAX_VERTEX_ATTRIBUTES : 9999,
		MAX_VERTEX_CONSTANTS : 9999,
		MAX_FRAGMENT_CONSTANTS : 9999,
		MAX_TEMP_VECTORS : 9999,
		MAX_TEMP_FLOATS : 9999,
		MAX_VERTEX_VARYING : 9999,
		MAX_FRAGMENT_VARYING : 9999,
		MAX_FRAGMENT_SAMPLER : 9999,
		FRAGMENT_OUTPUT : '',
		VERTEX_OUTPUT : 'vertex.result'		
	};

	var translation_table = {
		//'ABS' : 'Math.abs(%2)',
		'ADD' : '(%2) + (%3)',
		//'ARL' : false,
		'MOV' : '(%2)',
		//'CMP' : false,
		//'COS' : 'Math.cos(%2)',
		//'DP3' : '%1.* = (%2.x * %3.x + %2.y * %3.y + %2.z + %3.z)',
		//'DP4' : '%1.* = (%2.x * %3.x + %2.y * %3.y + %2.z + %3.z + %2.w * %3.w)',
		//'DPH' : '%1.* = (%2.x * %3.x + %2.y * %3.y + %2.z + %3.z + %3.w)',
		//'DST' : '%1.* = [1, %2.y * %3.y, %2.z, %3.w]',
		'MUL' : '(%2) * (%3)',
		'MAD' : '((%2) * (%3) + (%4))'
	};

	/**
	 * Translates an ARB assembly syntax tree into a javascript representation
	 *
	 * @param   string    Syntax tree
	 * @param   symbols   Symbol table
	 * @param   int       1 if vertex, 2 if fragment. Can omit if string contains ARB start line
	 *
	 * @return  bool      true if there were no errors
	 */
	function translate(a, sym) {
		var i, errors;

		ast = a;
		symbols = sym;
		errors = 0;

		header = [];
		body = ["function main(){"];

		for (i in symbols) {
			if (typeof symbols[i] == 'object') {
				if (symbols[i].size) {
					header.push(sprintf("var %s = new Array(%s);", i, symbols[i].size));
				} else {
					header.push(sprintf("var %s = [0,0,0,0];", i));
				}
			} else {
				header.push(sprintf("%s = %s;", i, symbols[i]));
			}
		}

		//optimize(ast, symbols);

		for (i = 0; i < ast.length; i++) {
			try {
				translateInstruction(ast[i]);
			} catch (e) {
				errors++;
				ARB.errors.push(e);
			}
		}

		body.push("}");

		ARB.output = header.join("\n") + "\n" + body.join("\n");

		return (errors == 0);
	}

	/**
	 * External interface.
	 */
	ARB.language.javascript = {
		translate : translate
	};

	for (var i in constants) {
		ARB.language.javascript[i] = constants[i];
	}

}(ARB));

