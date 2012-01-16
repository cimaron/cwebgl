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
	var output, irs, state, symbols;
	var constants, program, vertex, registers, fragment;


	/**
	 * Generate output header lines
	 */
	function gen_header() {
		output.push(sprintf("!!ARB%sp1.0\n", (state.target == glsl.mode.vertex ? 'v' : 'f')));
		output.push("#program main\n");
	}

	/**
	 * Scan instructions and input all operands into local symbol table
	 */
	function scan_symbols() {
		var i, ir;

		//scan all appropriate symbols
		for (i = 0; i < irs.code.length; i++) {
			ir = irs.code[i];
			enter_symbol(ir.d, i);
			enter_symbol(ir.s1, i);
			enter_symbol(ir.s2, i);
			enter_symbol(ir.s3, i);
		}
	}

	/**
	 * Generate params statement
	 */
	function gen_params() {
		var params, len, symbol;

		params = [];

		symbol = {
			out : "c",
			entries : []
		};
		symbols[symbol.out] = symbol;

		len = 0;
		len += param_constants(params, symbol);
		len += param_program(params, symbol);

		if (len > 0) {
			output.push(sprintf("PARAM %s[%s] = {%s};\n", "c", len, params.join(",")));
		}
	}

	/**
	 * Generate params constants
	 */
	function param_constants(params, symbol) {
		var i, param, constant;

		param = [];
		for (i = 0; i < constants.length; i++) {
			constant = constants[i];

			//reorganize in symbol table
			delete symbols[constant.value];
			symbols[symbol.out].entries.push(constant);

			constant.name = symbol.out;
			constant.out = sprintf("%s[%s].%s", symbol.out, params.length, "xyzw".substr(param.length, 1));
			constant.location = params.length;
			constant.component = param.length;

			irs.replaceName(0, constant.value, constant.out, false, true);

			param.push(constant.value);

			//push param to params
			if (param.length == 4 ) {
				params.push(sprintf("{%s}", param.join(",")));
				param = [];
			}
		}

		if (param.length > 0) {
			params.push(sprintf("{%s}", param.join(",")));
		}

		return params.length;
	}

	/**
	 * Generate params constants
	 */
	function param_program(params, symbol) {
		var i, j, local, start;

		start = params.length;

		for (i = 0; i < program.local.length; i++) {
			local = program.local[i];

			//reorganize in symbol table
			delete symbols[local.out];
			delete local.entry;
			for (j = 0; j < local.size; j++) {
				//repeat each vector for quick lookup
				symbol.entries.push(local);
			}

			local.location = start;
			irs.replaceName(0, local.out, symbol.out, start);
			local.out = symbol.out;

			start += local.size;
		}

		if (program.local.length > 0) {
			params.push(sprintf("program.local[%s..%s]", params.length, start));
			return start - params.length + 1;
		}

		return 0;
	}

	/**
	 * Generate temporary temps statement
	 */
	function gen_temps() {
		var i;
		for (i = 0; i < registers.length; i++) {
			output.push(sprintf("TEMP %s;\n", registers[i].out));
		}
	}

	/**
	 * Generate main code
	 */
	function gen_body() {
		var i, ir;

		for (i = 0; i < irs.code.length; i++) {
			ir = irs.code[i];
			output.push(ir);
		}
	}

	/**
	 * Enter an operand into the local symbol table
	 *
	 * @param   string    Operand
	 */
	function enter_symbol(oper, i) {
		var entry, size, symbol, reg, j;

		//empty operand
		if (!oper) {
			return;
		}

		//already exists (hope we got it right the first time)
		if (symbols[oper.name]) {
			return;	
		}

		//operand is a constant
		if (oper.name.match(/[0-9]+\.[0-9]+/)) {
			symbols[oper.name] = {
				value : oper.name,
				constant : 1
			};
			constants.push(symbols[oper.name]);
			return;
		}

		//get the operand name and parser symbol table entry
		entry = state.symbols.get_variable(oper.name);

		//temporary variable
		if (!entry) {
			reg = get_register(i);
			replace_temp(i, oper.name, oper.offset, reg.out);
			update_register_life(reg, i + 1);
			return;
		}

		size = glsl.type.size[entry.type];
		symbol = {
			name : oper.name,
			out : entry.out,
			entry : entry,
			size : Math.ceil(size / 4),
			type_size : glsl.type.size[entry.type]
		};

		symbols[oper.name] = symbol;

		if (entry.qualifier_name == 'uniform') {
			//for (i = 0; i < symbol.size; i++) {
				program.local.push(symbol);
			//}
			return;
		}

		if (entry.qualifier_name == 'attribute') {
			symbol.out = 'vertex.attrib';
			symbol.location = vertex.attrib.length;
			irs.replaceName(i, oper.name, symbol.out, symbol.location);
			for (j = 0; j < symbol.size; j++) {
				vertex.attrib.push(symbol);
			}
			delete symbol.entry;
			delete symbols[oper.name];
			symbols[symbol.out] = symbol;
			return;
		}

		if (entry.qualifier_name == 'varying') {
			if (state.target == glsl.mode.vertex) {
				symbol.out = 'vertex.varying';	
			} else {
				symbol.out = 'fragment.attrib';
			}
			symbol.location = fragment.attrib.length;
			irs.replaceName(i, oper.name, symbol.out, symbol.location);
			for (j = 0; j < symbol.size; j++) {
				fragment.attrib.push(symbol);
			}
			delete symbol.entry;
			delete symbols[oper.name];
			symbols[symbol.out] = symbol;
			return;
		}

		if (symbol.out != oper.name) {
			irs.replaceName(i, oper.name, symbol.out);	
		}
	}

	/**
	 * Replaces all instances of a temporary, taking index into account
	 *
	 * @param   integer     Starting instruction number
	 * @param   string      Old name to search for
	 * @param   string      Old index to search for
	 * @param   string      New name to replace with
	 */
	function replace_temp(start, old, index, nw) {
		var i, j, ir, f;

		for (i = start; i < irs.code.length; i++) {
			ir = irs.code[i];

			for (j = 0; j < glsl.IR.operands.length; j++) {
				f = glsl.IR.operands[j];
	
				if (ir[f] && ir[f].name == old && ir[f].offset == index) {
					ir[f].name = nw;
					ir[f].offset = "";
				}
			}
		}
	}

	/**
	 * Return a free register symbol
	 *
	 * @param   integer   Instruction number to start at
	 */
	function get_register(start) {
		var i, end, reg;

		//look for any existing registers that are free at this point
		for (i = 0; i < registers.length; i++) {
			reg = registers[i];
			if (reg.life < start) {
				update_register_life(reg, start);
				return reg;
			}
		}

		//none found, create a new one
		reg = {
			out : 'R' + registers.length,
			temp : 1,
			life : -1
		};
		registers.push(reg);
		symbols[reg.out] = reg;

		return reg;
	}

	/**
	 * Updates the life field of a register symbol with the instruction number of it's last use
	 *
	 * @param   object    Register symbol
	 * @param   integer   Instruction number to start at
	 */
	function update_register_life(reg, start) {
		var i, ir, s1, s2;
		reg.life = -1;

		//loop backwards and look for last (read) reference
		for (i = irs.code.length - 1; i > start; i--) {
			ir = irs.code[i];

			//if one of the operands matches, set this line number
			if ((ir.s1 && ir.s1.name == reg.out) || (ir.s2 && ir.s2.name == reg.out) || (ir.s3 && ir.s3.name == reg.out)) {
				reg.life = i;
				return;
			}
		}
	}

	function gen_object() {

		output = {

			//used for linking
			program : program,
			vertex : vertex,
			fragment : fragment,

			//symbols
			target : state.target,
			constants : constants,
			temps : registers,

			body : output
		};
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
		output = [];

		symbols['2D'] = { name : '2D', out : '1' };

		//symbol caches
		constants = [];
		program = {local : []};
		vertex = {attrib : [], varying : []};
		fragment = {attrib : []};
		registers = [];

		//generate
		try {
			gen_header();
			scan_symbols();
			gen_params();
			gen_temps();
			gen_body();
			gen_object();
		} catch (e) {
			glsl.errors.push(e);
		}

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
