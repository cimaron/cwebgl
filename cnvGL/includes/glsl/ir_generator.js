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
	var IRS = glsl.IRS;
	var IR = glsl.IR;
	var sprintf = StdIO.sprintf;


	var irs, ir;

	//constants
	var swizzles = ["xyzw", "rgba", "stpq"];

	/**
	 * Constructs a compound statement code block
	 *
	 * @param   ast_node    ast_node that represents a compound statement type
	 */
	function compound_statement(cs) {
		var i, stmt;

		state.symbols.push_scope();

		for (i = 0; i < cs.statements.length; i++) {

			stmt = cs.statements[i];

			switch (stmt.typeOf()) {

				case 'ast_expression_statement':
					expression(stmt.expression);
					break;

				case 'ast_declarator_list':
					declarator_list(stmt);
					break;

				case 'ast_selection_statement':
					selection_statement(stmt);
					break;

				default:
					throw_error(sprintf("Could not unknown translate statement type %s", stmt.typeOf()), stmt);
			}
		}

		state.symbols.pop_scope();
	}


	/**
	 * Constructs a type constructor
	 *
	 * @param   ast_node    ast_node that represents a constructor operation
	 * @param   ast_node    ast_node that represents the constructor components
	 */
	function constructor(e, op, se) {
		var ds, di, si, sei, ses, d, s, swz;

		ds = glsl.type.size[op.type_specifier];
		si = 0;
		sei = 0;
		swz = ['x', 'y', 'z', 'w'];

		e.Type = op.type_specifier;
		e.Dest = [];

		e.Dest = irs.getTemp(ds == 1 ? '$tempf' : '$tempv');
		
		for (di = 0; di < ds; di++) {

			//build next subexpression
			if (si == 0) {

				if (!se[sei]) {
					throw_error("Not enough parameters to constructor", e);				
				}

				expression(se[sei]);
				ses = glsl.type.size[se[sei].Type];
			}

			//compute destination
			d = e.Dest;
			if (ds > 1) {
				//need to add support for > vec4
				d = sprintf("%s.%s", d, swz[di]);
			}

			//compute source
			s = se[sei].Dest;
			if (ses > 1) {
				//need to add support for > vec4
				s = sprintf("%s.%s", s, swz[si])
			}

			ir = new IR('MOV', d, s);
			irs.push(ir);
			
			//used up all components in current expression, move on to the next one
			si++;
			if (si >= ses) {
				si = 0;
				sei++;
			}

		}
	}

	/**
	 * Constructs a declaration list
	 *
	 * @param   ast_node    ast_node that represents a declaration list
	 */
	function declarator_list(dl) {
		var type, size, qualifier, i, decl, name, entry;

		type = dl.type;
		size = glsl.type.size[type.specifier.type_specifier];
		if (type.qualifier) {
			qualifier = glsl.type.qualifiers[type.qualifier.flags.q];
		}

		for (i = 0; i < dl.declarations.length; i++) {

			decl = dl.declarations[i];
			name = decl.identifier;

			//add symbol table entry
			entry = state.symbols.add_variable(name);
			entry.type = type.specifier.type_specifier;
			entry.qualifier_name = qualifier;

			if (decl.initializer) {
				expression(decl.initializer);
				if (decl.initializer.Type != entry.type) {
					throw_error(sprintf("Could not assign value of type %s to %s", glsl.type.names[decl.initializer.Type], glsl.type.names[entry.type]), dl);
				}
			}
		}
	}
	
	/**
	 * Constructs an expression code block
	 *
	 * @param   ast_node    ast_node that represents an expression
	 */
	function expression(e) {

		if (!e) {
			return;	
		}

		//operator
		if (typeof e.oper == 'number') {
			expression_op(e);
			return;
		}

		//simple (variable, or value)
		if (e.primary_expression) {
			expression_simple(e);
			return;
		}

		//cast
		if (e.typeOf('ast_type_specifier')) {
			e.Type = e.type_specifier;
			return;
		}

		throw_error("Could not translate unknown expression type", e);
	}

	/**
	 * Constructs a binary expression
	 *
	 * @param   int		    operation code
	 * @param   ast_node    subexpression 1
	 * @param   ast_node    subexpression 2
	 */
	function expression_bin(e, se1, se2) {
		var table, error, dest;

		error = sprintf("Could not apply operation %s to %s and %s", glsl.ast.op_names[e.oper], glsl.type.names[se1.Type], glsl.type.names[se2.Type]);

		if (!(table = glsl.ir_operation_table[e.oper])) {
			throw_error(error, e);
			return;
		}

		if (!(table = table[se1.Type])) {
			throw_error(error, e);
			return;
		}

		if (!(table = table[se2.Type])) {
			throw_error(error, e);
			return;
		}

		e.Type = table.type;
		e.Dest = IRS.getTemp('$tempv');
		
		dest = [e.Dest, se1.Dest, se2.Dest];

		parseCode(table.code, dest);
	}

	/**
	 * Constructs a field selection code block
	 *
	 * @param   ast_node    ast_node that represents a field selection
	 */
	function expression_field(e, se) {
		var field, i, s, swz, new_swz, base;

		//pick swizzle set
		field = e.primary_expression.identifier;
		for (i = 0; i < swizzles.length; i++) {
			if (swizzles[i].indexOf(field[0]) != -1) {
				swz = swizzles[i];
				break;
			}
		}

		//check that all fields are in same swizzle set
		if (swz) {
			new_swz = "";
			for (i = 0; i < field.length; i++) {
				s = swz.indexOf(field[i])
				if (s == -1) {
					swz = false;
					break;
				}
				//use corresponding "standard" fields (xyzw)
				new_swz += swizzles[0][s];
			}
		}

		if (swz) {
			e.Dest = sprintf("%s.%s", se[0].Dest, new_swz);
			e.Type = baseType(se[0].Type);
			if (new_swz.length > 4 || !e.Type) {
				throw_error(sprintf("Invalid field selection %s.%s", se[0], e.primary_expression.identifier), e);
			}
			e.Type = makeType(e.Type, new_swz.length);
		}
	}

	/**
	 * Constructs a function call expression code block
	 *
	 * @param   ast_node    ast_node that represents a function call
	 */
	function expression_function(e) {
		var i, func, se, def, dest, entry;
		
		func = e.subexpressions[0].primary_expression.identifier
		def = [];
		dest = [];

		for (i = 0; i < e.expressions.length; i++) {
			se = e.expressions[i];
			expression(se);
			def.push(se.Type);
			dest.push(se.Dest);
		}

		entry = glsl.state.symbols.get_function(func, null, def);
		if (!entry) {
			throw_error(sprintf("Function %s(%s) is not defined", func, se_type_names.join(",")), e);
		}

		e.Type = entry.type;
		e.Dest = IRS.getTemp('$tempv');
		dest.unshift(e.Dest);

		parseCode(entry.code, dest);
	}

	/**
	 * Constructs an operator expression code block
	 *
	 * @param   ast_node    ast_node that represents an operator expression
	 */
	function expression_op(e) {
		var se, temp, ops;

		if (se = e.subexpressions) {
			expression(se[0]);
			expression(se[1]);
			expression(se[2]);
		}
		
		ops = glsl.ast.operators;

		switch (e.oper) {

			//assignment operator
			case ops.assign:
				if (se[0].Type != se[1].Type) {
					throw_error(sprintf("Could not assign value of type %s to %s", se[1].type_name, se[0].type_name), e);
				}
				e.Type = se[1].Type;

				//@todo:
				//check that se1 is a valid type for assignment
				//if se1 has a quantifier, generate that
				ir = new IR('MOV', se[0].Dest, se[1].Dest);
				irs.push(ir);
				break;

			//binary expression
			case ops.add:
			case ops.sub:
			case ops.mul:
			case ops.div:
				expression_bin(e, se[0], se[1]);
				break;

			//simple expression
			case ops.int_constant:
			case ops.float_constant:
			case ops.identifier:
				expression_simple(e, se);
				break;

			//function call
			case ops.function_call:
				if (e.cons) {
					constructor(e, se[0], e.expressions);
				} else {
					expression_function(e);	
				}
				break;

			case ops.field_selection:
				expression_field(e, se);
				break;
				
			default:
				throw_error(sprintf("Could not translate unknown expression %s (%s)", e.typeOf(), e.oper), e);
		}
	}

	/**
	 * Constructs a simple expression code block
	 *
	 * @param   ast_node    ast_node that represents a simple expression
	 *                      (either an identifier or a single value)
	 */
	function expression_simple(e) {
		var name, entry, t;

		//identifier
		if (e.primary_expression.identifier) {

			//lookup identifier in symbol table
			name = e.primary_expression.identifier;
			entry = state.symbols.get_variable(name) || state.symbols.get_function(name);

			if (!entry || !entry.type) {
				throw_error(sprintf("Variable %s is undefined", name), e);
			}

			e.Type = entry.type;
			e.Dest = entry.name;

			return;
		}

		//float constant
		if (typeof e.primary_expression.float_constant != 'undefined') {
			e.Type = glsl.type.float;
			e.Dest = makeFloat(e.primary_expression.float_constant);
			return;
		}

		//int constant
		if (typeof e.primary_expression.int_constant != 'undefined') {
			e.Type = glsl.type.int;
			e.Dest = makeFloat(e.primary_expression.int_constant);
			return;
		}

		throw_error("Cannot translate unkown simple expression type", e);
	}

	/**
	 * Constructs a function header code block
	 *
	 * @param   ast_node    ast_node that represents an operator expression
	 */
	function _function(f) {
		var i, name, param;

		//generate
		name = f.identifier;
		entry = state.symbols.get_function(name);

		//generate param list
		for (i = 0; i < f.parameters.length; i++) {
			param = f.parameters[i];
			if (param.is_void || !param.identifier) {
				break;
			}
		}
	}

	/**
	 * Constructs a function definition block
	 *
	 * @param   ast_node    ast_node that represents a function definition
	 */
	function function_definition(fd) {

		if (fd.is_definition) {
			//enter definition into symbol table?
			return;
		}

		//handle function proto
		_function(fd.proto_type);

		//handle function body
		compound_statement(fd.body);

		ir = new IR("RET");
		irs.push(ir);
	}

	/**
	 * Constructs a translation unit
	 *
	 * @param   ast_node    ast_node that represents a translation unit
	 */
	function translation_unit(tu) {
		switch (tu.typeOf()) {
			case 'ast_declarator_list':
				declarator_list(tu);
				break;
			case 'ast_function_definition':
				function_definition(tu);
				break;
			case 'ast_type_specifier':
				type_specifier(tu);
				break;
			default:
				throw_error(sprintf('Unknown translation unit %s', tu.typeOf()), tu);
		}
	}

	/**
	 * Constructs a type specifier code block
	 *
	 * @param   ast_node    ast_node that represents a type specifier
	 */
	function type_specifier(ts) {
		if (ts.is_precision_statement) {
			return;
		}
		throw_error("Cannot generate type specifier", ts);
	}

	/**
	 * Constructs an error message
	 *
	 * @param   string      The error message
	 * @param   ast_node    The error ast_node
	 *
	 * @return  string
	 */
	function throw_error(msg, n) {
		if (n && n.location) {
			msg += " at line " + n.location.line + ", column " + n.location.column;	
		}
		throw new Error(msg);
	}

	/**
	 * Makes number a float representation
	 *
	 * @param   string      The string representation of a number
	 *
	 * @return  string
	 */
	function makeFloat(n) {
		n += (n.toString().indexOf('.') == -1) ? ".0" : "";
		return n;
	}
	
	/**
	 * Returns the base type of the type
	 *
	 * @param   integer     The base type (float, int...)
	 * @param   size        The size to construct
	 *
	 * @return  string
	 */
	function makeType(base, size) {
		var name;

		if (size == 1) {
			return base;
		}

		if (size <= 4) {
			if (base == glsl.type.float) {
				return glsl.type.vec2 + (size - 2);
			}
		}

		return null;
	}

	/**
	 * Returns a new type using base type and size
	 *
	 * @param   integer     The base type (float, int...)
	 * @param   size        The size to construct
	 *
	 * @return  string
	 */
	function baseType(type) {
		return glsl.type.base[type];
	}

	function parseCode(code, oprds) {
		var repl, parts, i, j;

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
					d : IRS.getTemp('$tempv')
				});
				continue;
			}

			for (j = 0; j < repl.length; j++) {
				parts = parts.replace(repl[j].s, repl[j].d);
			}

			parts = parts.split(" ");
			irs.push(new IR(parts[0], parts[1], parts[2], parts[3], parts[4]));
		}
	}

	/**
	 * Construct from symbol table
	 *
	 * @param   object    Symbol table
	 */
	function symbols(symbols) {
		var i, entry;
		for (i in symbols.table) {
			entry = symbols.table[i];
			if (entry.typedef == glsl.symbol_table_entry.typedef.variable) {
				//console.log(entry);	
			}
		}
	}

	/**
	 * Constructs a program's object code from an ast and symbol table
	 *
	 * @param   string      The error message
	 * @param   ast_node    The error ast_node
	 *
	 * @return  string
	 */
	function generate_ir(new_state) {
		var i;

		state = new_state;
		irs = new IRS();

		symbols(state.symbols);

		try {
			for (i = 0; i < state.translation_unit.length; i++) {
				translation_unit(state.translation_unit[i]);
			}
		} catch (e) {
			glsl.errors.push(e);
		}

		if (glsl.errors.length > 0) {
			return false;	
		}

		return irs;
	}

	/**
	 * External interface
	 */
	glsl.generate_ir = generate_ir;

}(glsl, StdIO));

