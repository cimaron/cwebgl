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
	var irs, symbols, header, body;


	function buildComponents(oper) {
		var i, swz;
		
		if (!oper) {
			return "";	
		}

		//generate array representation of swizzle components, expanding if necessary
		swz = oper.swizzle || "xyzw";
		swz = swz.split("");
		oper.count = swz.length;

		oper.comp = [];
		for (i = 0; i < 4; i++) {
			//exact swizzle specified and less than 4 components, grab last one
			if (swz.length <= i) {
				//repeat last one
				oper.comp.push(oper.comp[i - 1]);	
			} else {
				//push the location of the current component
				oper.comp.push("[" + "xyzw".indexOf(swz[i]) + "]");			
			}
		}
		
		if (typeof oper.offset == "number") {
			oper.out = sprintf("%s[%s]", oper.name, oper.offset);
		} else {
			oper.out = oper.name;	
		}

		return oper;
	}

	/**
	 * Translates ASM instruction into output format
	 *
	 * @param   string    string that represents a single instruction
	 */
	function translateInstruction(ins) {
		var dest, src1, src2, src3, i, c, d, s1, s2, s3, trans;

		if (typeof ins == "string") {
			return;	
		}

		//variables
		dest = buildComponents(ins.d);
		src1 = buildComponents(ins.s1);
		src2 = buildComponents(ins.s2);
		src3 = buildComponents(ins.s3);

		//if vector operation, we need to loop over each vector and grab the appropriate element
		for (i = 0; i < dest.count; i++) {
			c = dest.comp[i];

			d = dest.out + c;
			s1 = src1.out + (src1.swizzle ? src1.comp[i] : c);
			s2 = src2.out + (src2.swizzle ? src2.comp[i] : c);
			s3 = src3.out + (src3.swizzle ? src3.comp[i] : c);

			if (!(trans = translation_table[ins.op])) {
				throw new error("Could not translate opcode");
			}

			//s1 = symbols[s1] || s1;
			//s2 = symbols[s2] || s2;
			//s3 = symbols[s3] || s3;

			trans = trans.replace('%1', d);
			trans = trans.replace('%2', s1);
			trans = trans.replace('%3', s2);
			trans = trans.replace('%4', s3);

			//if (d.indexOf('result') != -1) {
				//d = (symbols[dest.name].value || dest.name) + c;
				body.push(sprintf("%s = %s;", d, trans));
			//} else {
			//	symbols[d] = trans;				
			//}
		}
	}

	var constants = {
		MAX_VERTEX_ATTRIBUTES : 16,
		MAX_VERTEX_CONSTANTS : 128,
		MAX_FRAGMENT_CONSTANTS : 128,
		MAX_TEMP_VECTORS : 128,
		MAX_VERTEX_VARYING : 12,
		MAX_FRAGMENT_VARYING : 12,
		MAX_FRAGMENT_SAMPLER : 8,
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
		'MAD' : '((%2) * (%3)) + (%4)'
	};

	function processSymbols(object_code) {
		var n, i, c, ci, symbol, size;

		n = "c"
		c = 0;
		ci = 0;

		//@todo: replace c with computed value
		header.push(sprintf("var %s = new Array();", n));

		//enter constants in symbol table for swapping out later
		for (i in object_code.constants) {
			symbol = object_code.constants[i];
			if (ci == 0) {
				header.push(sprintf("%s[%s] = %s[%s];", n, c, "program.local", c));
			}
			header.push(sprintf("%s[%s][%s] = %s;", n, c, ci, symbol.value)); 
			ci++;
			if (ci == 4) {
				ci = 0;
				c++;
			}
		}
		if (ci > 0) {
			c++;
		}

		//uniforms
		for (i in object_code.program.local) {
			symbol = object_code.program.local[i];
			for (ci = 0; ci < symbol.size; ci++) {
				header.push(sprintf("%s[%s] = %s[%s];", n, c, "program.local", c));
				c++;
			}
		}
		
		//temps
		for (i = 0; i < object_code.temps.length; i++) {
			symbol = object_code.temps[i];
			header.push(sprintf("var %s = temp[%s];", symbol.out, i));
		}
	}

	/**
	 * Translates an ARB assembly syntax tree into a javascript representation
	 *
	 * @param   string    Syntax tree
	 * @param   symbols   Symbol table
	 * @param   int       1 if vertex, 2 if fragment. Can omit if string contains ARB start line
	 *
	 * @return  bool      true if there were no errors
	 */
	function translate(object_code) {
		var i, errors;

		symbols = {};
		irs = object_code.body;
		
		errors = 0;

		header = [];
		body = ["function main() {"];

		processSymbols(object_code);
		//optimize(irs, symbols);

		for (i = 0; i < irs.length; i++) {
			try {
				translateInstruction(irs[i]);
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

