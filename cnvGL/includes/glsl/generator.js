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

(function(glsl, StdIO) {

	/**
	 * Import into local scope
	 */
	var sprintf = StdIO.sprintf;

	/**
	 * Local Scope
	 */
	var output, irs, state, symbols, registers;


	/**
	 * Generate output header lines
	 */
	function gen_header() {
		output += sprintf("!!ARB%sp1.0\n", (state.target == glsl.mode.vertex ? 'v' : 'f'));
		output += "#program main\n";
	}

	/**
	 * Scan instructions and input all operands into local symbol table
	 */
	function scan_symbols() {
		var i, ir;

		//scan all appropriate symbols
		for (i = 0; i < irs.code.length; i++) {
			ir = irs.code[i];
			enter_symbol(ir.getDest(true));
			enter_symbol(ir.getSrc1(true));
			enter_symbol(ir.getSrc2(true));
		}
	}

	/**
	 * Generate params statement
	 */
	function gen_params() {
		var params, len;

		params = [];
		enter_constants(params, "c");

		len = params.length;

		if (len > 0) {
			output += sprintf("PARAM %s[%s] = {%s};\n", "c", len, params.join(","));
		}		
	}

	/**
	 * Generate params constants
	 */
	function enter_constants(params, n) {
		var i, param, symbol;

		param = [];
		for (i in symbols) {
			symbol = symbols[i];

			//found constant
			if (symbol.constant) {
				symbol.out = sprintf("%s[%s].%s", n, params.length, "xyzw".substr(param.length, 1));
				param.push(i);

				//push param to params
				if (param.length == 4 ) {
					params.push(sprintf("{%s}", param.join(",")));
					param = [];
				}

				replace_operand(0, i, symbol.out);
			}
		}

		if (param.length > 0) {
			params.push(sprintf("{%s}", param.join(",")));
		}
	}

	/**
	 * Generate temporary temps statement
	 */
	function gen_temps() {
		output += "@temps@\n";
	}

	/**
	 * Generate main code
	 */
	function gen_body() {
		var i, ir, d, s1, s2, reg;

		for (i = 0; i < irs.code.length; i++) {
			ir = irs.code[i];

			d = ir.getDest(true);
			s1 = ir.getSrc1(true);
			s2 = ir.getSrc2(true);

			//dest is a temp variable, replace it and all occurrences with a new register
			if (d && symbols[d.name].temp) {
				reg = get_register(i);

				ir.d = reg.name;
				if (d.swizzle) {
					ir.d += "." + d.swizzle;	
				}
	
				replace_operand(i + 1, d.name, reg.name);
				delete symbols[d.name];
				update_register_life(reg, i + 1);
			
			}

			output += sprintf("%s;\n", ir.toString());
		}
	}

	function update_temps() {
		var temps, i;
		temps = "";

		for (i = 0; i < registers.length; i++) {
			temps += sprintf("TEMP %s;\n", registers[i].name);	
		}

		output = output.replace("@temps@\n", temps);
	}

	/**
	 * Enter an operand into the local symbol table
	 *
	 * @param   string    Operand
	 */
	function enter_symbol(operand) {
		var obj, entry;

		//empty operand
		if (!operand) {
			return;
		}

		//operand is a constant
		if (operand.name.match(/[0-9]+\.[0-9]+/)) {
			symbols[operand.name] = {constant:1};
			return;
		}

		//get the operand name and parser symbol table entry
		entry = state.symbols.get_variable(operand.name);

		//temporary variable
		if (!entry) {
			symbols[operand.name] = {temp:1};
			return;
		}

		symbols[entry.name] = {
			out : entry.out,
			symbol : entry
		};
	}

	function replace_operand(start, old, nw) {
		var i, ir, dest, s1, s2;
		for (i = start; i < irs.code.length; i++) {
			ir = irs.code[i];

			//replace dest
			dest = ir.getDest(true);
			if (dest && dest.name == old) {
				ir.d = nw;
				if (dest.swizzle) {
					ir.d += '.' + dest.swizzle;
				}
			}

			//replace src1
			s1 = ir.getSrc1(true);
			if (s1 && s1.name == old) {
				ir.s1 = nw;
				if (s1.swizzle) {
					ir.s1 += '.' + s1.swizzle;
				}
			}

			//replace src2
			s2 = ir.getSrc2(true);
			if (s2 && s2.name == old) {
				ir.s2 = nw;
				if (s2.swizzle) {
					ir.s2 += '.' + s2.swizzle;
				}
			}
		}
	}

	function get_register(start) {
		var i, end, reg;

		//look for any registers that are free at this point
		for (i = 0; i < registers.length; i++) {
			reg = registers[i];
			if (reg.life < start) {
				update_register_life(reg, start);
				return reg;
			}
		}
		
		reg = {
			name : 'R' + registers.length
		};
		registers.push(reg);
		symbols[reg.name] = {out:reg.name,register:reg};
		reg.life = -1;

		return reg;
	}

	function update_register_life(reg, start) {
		var i, ir, s1, s2;
		reg.life = -1;
		//loop backwards and look for last (read) reference
		for (i = irs.code.length - 1; i > start; i--) {
			ir = irs.code[i];
			s1 = ir.getSrc1(true);
			s2 = ir.getSrc2(true);

			if ((s1 && s1.name == reg.name) || (s2 && s2.name == reg.name)) {
				reg.life = i;
				return;
			}
		}
	}


	/**
	 * Generate an ARB program string from IR
	 *
	 * @param   IRS     IR representation
	 * @param   Object  Compiler state
	 */
	function generate_arb(new_irs, new_state) {
		var i;

		//reset
		irs = new_irs;
		state = new_state;
		symbols = {};
		registers = [];
		output = "";
console.log(irs);
		//generate
		try {
			scan_symbols();
			gen_header();
			gen_params();
			gen_temps();
			gen_body();
			update_temps(); //gen_temps won't know how many registers until after the body is processed
		} catch (e) {
			glsl.errors.push(e);
		}

		console.log(output);

		if (glsl.errors.length > 0) {
			return false;
		}

		return output;
	}

	/**
	 * External interface
	 */
	glsl.generate_arb = generate_arb;

}(glsl, StdIO));
