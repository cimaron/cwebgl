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
	var irs, symbols, header, body, object_code;


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
		'ABS' : '%1* = Math.abs(%2*)',
		'ADD' : '%1* = (%2*) + (%3*)',
		//'ARL' : false,
		'CMP' : '%1* = ((%2* < 0.0) ? (%3*) : (%4*))',
		//'COS' : 'Math.cos(%2)',
		'DP3' : '%1[0] = ((%2[0]) * (%3[0]) + (%2[1]) * (%3[1]) + (%2[2]) * (%3[2]))',
		'DP4' : '%1[0] = ((%2[0]) * (%3[0]) + (%2[1]) * (%3[1]) + (%2[2]) * (%3[2]) + (%2[3]) * (%3[3]))',
		//'DPH' : '%1.* = (%2.x * %3.x + %2.y * %3.y + %2.z + %3.z + %3.w)',
		//'DST' : '%1.* = [1, %2.y * %3.y, %2.z, %3.w]',
		'MAD' : '%1* = ((%2*) * (%3*)) + (%4*)',
		'MAX' : '%1* = Math.max((%2*), (%3*))',
		'MOV' : '%1* = (%2*)',
		'MUL' : '%1* = (%2*) * (%3*)',
		'POW' : '%1[0] = Math.pow(%2[0], %3[0])',
		'RET' : 'return',
		'RSQ' : '%1* = (1.0 / Math.sqrt(%2*))',
		'SGE' : '%1* = (%2* >= %3*) ? (1.0) : (0.0)',
		'SLT' : '%1* = (%2* <  %3*) ? (1.0) : (0.0)',
		'SUB' : '%1* = (%2*) - (%3*)',
		'TEX' : ['tex(jstemp, (%3[0]), (%2[0]), (%2[1]), 0)',
				 '%1* = jstemp[%i]']
	}; 

	var translation_vars = {
		'vertex.attrib' : 'attrib',
		'vertex.varying' : 'varying',
		'fragment.attrib' : 'attrib',
		'result.position' : 'result[0]',
		'result.color' : 'result[2]'
	};

	/**
	 * Set up individual vector components
	 *
	 * @param   object    Operand
	 */
	function buildComponents(oprd) {
		var i, swz, out, repl;
		
		if (!oprd) {
			return "";	
		}

		out = new ARB.Operand(oprd.toString());

		if (i = out.name.match(/R([0-9]+)/)) {
			out.name = sprintf("R[%s]", i[1]);
		}
		
		if (translation_vars[out.name]) {
			out.name = translation_vars[out.name];	
		}

		//generate array representation of swizzle components, expanding if necessary
		swz = out.swizzle || "xyzw";
		swz = swz.split("");
		out.count = swz.length;

		out.comp = [];
		for (i = 0; i < 4; i++) {
			//exact swizzle specified and less than 4 components, grab last one
			if (swz.length <= i) {
				//repeat last one
				out.comp.push(out.comp[i - 1]);	
			} else {
				//push the location of the current component
				if (out.name == 'attrib' && object_code.target == glsl.mode.vertex) {
					out.comp.push("[ai" + "xyzw".indexOf(swz[i]) + "]");
				} else {					
					out.comp.push("[" + "xyzw".indexOf(swz[i]) + "]");
				}
			}
		}

		if (typeof out.offset2 == "number") {
			out.out = sprintf("%s[%s]", out.name, out.offset2);
		} else if (typeof out.offset == "number") {
			out.out = sprintf("%s[%s]", out.name, out.offset);
		} else {
			out.out = out.name;
		}

		return out;
	}

	/**
	 * Fixes cases where atomic operations translated to non-atomic may cause
	 * incorrect results
	 *
	 * @param   object    Operand
	 * @param   object    Operand
	 * @param   array     List of components that need temps
	 */
	function checkNeedTemp(dest, src, temps) {
		var written, i, wi, s;

		if (!src) {
			return;	
		}

		written = [];
		written.push(dest.out + dest.comp[0]);

		//we can skip the first one
		for (i = 1; i < dest.count; i++) {
			s = src.neg + src.out + src.comp[i];
			wi = written.indexOf(s);

			//already written
			if (wi != -1) {
				src.comp[i] = sprintf('jstemp[%s]', wi);		
				if (temps.indexOf(s) == -1) {
					temps.push(s);
					body.push(sprintf("%s = %s;", src.comp[i], s));
				}
			}

			written.push(dest.out + dest.comp[i]);
		}
	}

	function buildVariable(oper, i, c) {
		var out;
		if (oper.name == 'attrib' && object_code.target == glsl.mode.vertex) {
			out = oper.neg + oper.out + (oper.swizzle ? oper.comp[i] : c.replace('[', '[ai'));
		} else {
			out = oper.neg + oper.out + (oper.swizzle ? oper.comp[i] : c);
		}
		return out;
	}

	/**
	 * Translates ASM instruction into output format
	 *
	 * @param   string    string that represents a single instruction
	 */
	function translateInstruction(ins) {
		var dest, src1, src2, src3, i, j, c, d, s1, s2, s3, code, trans, temps;

		if (typeof ins == "string") {
			return;	
		}

		if (!(code = translation_table[ins.op])) {
			throw new Error("Could not translate opcode");
		}

		if (!(code instanceof Array)) {
			code = [code];
		}

		//variables
		dest = buildComponents(ins.d);
		src1 = buildComponents(ins.s1);
		src2 = buildComponents(ins.s2);
		src3 = buildComponents(ins.s3);

		//fix atomic => non-atomic operations causing incorrect result
		temps = [];
		checkNeedTemp(dest, src1, temps);
		checkNeedTemp(dest, src2, temps);
		checkNeedTemp(dest, src3, temps);
		
		for (j = 0; j < code.length; j++) {	

			//if vector operation, we need to loop over each vector and grab the appropriate element
			for (i = 0; i < dest.count; i++) {
				
				trans = code[j];
				c = dest.comp[i];

				d = dest.out + c;
				s1 = buildVariable(src1, i, c);
				s2 = buildVariable(src2, i, c);
				s3 = buildVariable(src3, i, c);

				if (src1 && src1.comp[i].indexOf('jstemp') != -1) {
					s1 = src1.comp[i];
				}
				if (src2 && src2.comp[i].indexOf('jstemp') != -1) {
					s2 = src2.comp[i];
				}
				if (src3 && src3.comp[i].indexOf('jstemp') != -1) {
					s3 = src3.comp[i];
				}

				//vector with component
				trans = trans.replace(/%1\*/g, d);
				trans = trans.replace(/%2\*/g, s1);
				trans = trans.replace(/%3\*/g, s2);
				trans = trans.replace(/%4\*/g, s3);
	
				//vector without component
				trans = trans.replace(/%1/g, dest.out);
				trans = trans.replace(/%2/g, src1.out);
				trans = trans.replace(/%3/g, src2.out);
				trans = trans.replace(/%4/g, src3.out);

				//index of current component
				trans = trans.replace('%i', i);
				
				body.push(sprintf("%s;", trans));

				if (!code[j].match(/%[0-9]+\*/)) {
					//break 1
					i = dest.count;
				}
			}
		}
	}

	/**
	 * Build variable initializations
	 *
	 * @param   object    Object code
	 */
	function processSymbols(object_code) {
		var n, i, c, ci, symbol, size;

		n = "c"

		//@todo: replace c with computed value
		header.push(sprintf("var %s = program.local;", n));

		//enter constants in symbol table for swapping out later
		for (i = 0; i < object_code.constants.length; i++) {
			symbol = object_code.constants[i];
			header.push(sprintf("%s[%s][%s] = %s;", n, symbol.location, symbol.component, symbol.value));
		}

		//special temp register for js compatibility
		header.push("var jstemp = [0,0,0,0];");
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
	function translate(code) {
		var i, errors;

		symbols = {};
		object_code = code;
		irs = object_code.body;

		errors = 0;

		header = [];

		if (object_code.target == 1) {
			body = ["function main(R, c, attrib, ai0, ai1, ai2, ai3, varying, result) {"];
		} else {
			body = ["function main(R, c, attrib, result) {"];
		}

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

