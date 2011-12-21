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

	/**
	 * Constructs a compound statement code block
	 *
	 * @param   ast_node    ast_node that represents a compound statement type
	 */
	function compound_statement(cs) {
		var i, stmt;

		glsl.state.symbols.push_scope();
		glsl.generator.depth++;

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

		glsl.state.symbols.pop_scope();
		glsl.generator.depth--;
	}


	/**
	 * Constructs a type constructor
	 *
	 * @param   ast_node    ast_node that represents a constructor operation
	 * @param   ast_node    ast_node that represents the constructor components
	 */
	function constructor(e, op, se) {
		var size, di, si, sei, ses, d, s;

		size = glsl.type.size[op.type_specifier];
		si = -1;
		ses = -1;
		sei = 0;

		//get our temporary register
		ir = new IR('CLR', null, size, null, (size == 1 ? 'tf_' : 'tv_'));
		irs.push(ir);

		e.Type = op.type_specifier;
		e.Dest = ir.d;

		for (di = 0; di < size; di++) {

			if (ses <= sei) {

				//build next subexpression
				si++;
				if (!se[si]) {
					throw_error("Not enough parameters to constructor", e);				
				}

				expression(se[si]);
				sec = 0;
				ses = glsl.type.size[se[si].Type];
			}
			sei++;

			//compute destination
			d = e.Dest;
			if (size > 1) {
				d = sprintf("%s[%s]", d, di);
			}

			//compute source
			s = se[si].Dest;
			if (ses > 1) {
				s = sprintf("%s[%s]", s, sei)
			}

			ir = new IR('MOV', d, s);
			irs.push(ir);
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
			entry = glsl.state.symbols.add_variable(name);
			entry.type = type.specifier.type_specifier;
			entry.qualifier_name = qualifier;

			if (decl.initializer) {
				expression(decl.initializer);
				if (decl.initializer.Type != entry.type) {
					throw_error(sprintf("Could not assign value of type %s to %s", glsl.type.names[decl.initializer.Type], glsl.type.names[entry.type]), dl);
				}
			} else {
				ir = new IR('CLR', name, size);
				irs.push(ir);
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
		var t, error, ir;
		
		error = glsl.sprintf("Could not apply operation %s to %s and %s", e.oper, glsl.type.names[se1.Type], glsl.type.names[se2.Type]);
		
		if (!(t = glsl.generator.tables.opcodes[e.oper])) {
			throw_error(error, e);
			return;
		}

		if (!(t = table[se1.Type])) {
			throw_error(error, e);
			return;
		}

		if (!(t = table[se2.Type])) {
			throw_error(error, e);
			return;
		}

		ir = new IR(t.opcode, null, se1.Dest, se2.Dest, null, glsl.type.size[t.type] == 1 ? 'tf_' : 'tv_');
		irs.push(ir);

		e.Type = t.type;
		e.Dest = ir.d;		
	}

	/**
	 * Constructs an operator expression code block
	 *
	 * @param   ast_node    ast_node that represents an operator expression
	 *
	 * @return  IRS
	 */
	function expression_op(e) {
		var se, se1, se2, se3, i, entry, se_types, se_type_names, op_name;

		if (se = e.subexpressions) {

			if (se[0]) {
				expression(se[0]);
				se1 = last_ir(true);
			}
			
			if (se[1]) {
				expression(se[1]);
				se2 = last_ir(true);
			}
			
			if (se[2]) {
				expression(se[2]);
				se3 = last_ir(true);
			}
				
		}

		op_name = glsl.ast.op_names[e.oper];

		switch (e.oper) {

			//assignment operator
			case glsl.ast.operators.assign:

				if (se[0].Type != se[1].Type) {
					throw_error(sprintf("Could not assign value of type %s to %s", se[1].type_name, se[0].type_name), e);
				}
				e.Type = se[1].Type;

				//@todo:
				//check that se1 is a valid type for assignment
				//if se1 has a quantifier, generate that
				ir = new IR('MOV', se[0].primary_expression.identifier, se2);
				irs.push(ir);
				break;

			//binary expression
			case glsl.ast.operators.add:
			case glsl.ast.operators.sub:
			case glsl.ast.operators.mul:
			case glsl.ast.operators.div:
				expression_bin(e, se[0], se[1]);
				break;

			//simple expression
			case glsl.ast.operators.int_constant:
			case glsl.ast.operators.float_constant:
			case glsl.ast.operators.identifier:
				expression_simple(e);
				break;

			//function call
			case glsl.ast.operators.function_call:

				if (e.cons) {
					constructor(e, se[0], e.expressions);
					break;
				}

			default:
				debugger;
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
			entry = glsl.state.symbols.get_variable(name);

			if (!entry || !entry.type) {
				throw_error(sprintf("Variable %s is undefined", name), e);
			}

			e.Type = entry.type;
			e.Dest = entry.object_name;

			if (entry.depth == 0) {
				irs.varUsed(name, entry);
			}

			return;
		}

		//float constant
		if (typeof e.primary_expression.float_constant != 'undefined') {
			e.Type = glsl.type.float;
			e.Dest = e.primary_expression.float_constant;
			return;
		}

		//int constant
		if (typeof e.primary_expression.int_constant != 'undefined') {
			e.Type = glsl.type.int;
			e.Dest = e.primary_expression.int_constant;
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
		entry = glsl.state.symbols.get_function(name);

		ir = new IR("FUNC", sprintf("%s:", entry.object_name));
		irs.push(ir);

		//generate param list
		for (i = 0; i < f.parameters.length; i++) {
			param = f.parameters[i];
			if (param.is_void || !param.identifier) {
				break;
			}
			ir = new IR('PRM', param.identifier);
			irs.push(ir);
		}
	}

	/**
	 * Constructs a function definition block
	 *
	 * @param   ast_node    ast_node that represents a function definition
	 */
	function function_definition(fd) {

		if (fd.is_definition) {
			ir = new IR("REM", sprintf("function %s", fd.proto_type.identifier));
			irs.push(ir);
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
			ir = new IR('REM', sprintf("precision %s %s", ts.type_specifier, ts.type_name));
			irs.push(ir);
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
	 * Get last IR or IR destination register
	 *
	 * @param   bool      Return register
	 *
	 * @return  IR
	 */
	function last_ir(r) {
		return r ? irs.last.d : irs.last;		
	}

	//-----------------------------------------------------------
	//External interface

	glsl.generator = {
		
		depth : 0,

		output : '',
		status : false,
		errors : [],
		tables : {},

		/**
		 * Constructs a program's object code from an ast and symbol table
		 *
		 * @param   string      The error message
		 * @param   ast_node    The error ast_node
		 *
		 * @return  string
		 */
		createObjectCode : function(state) {

			//initialize
			this.output = '';
			this.status = false;
			this.errors = [];

			irs = new IRS();

			try {
				for (i = 0; i < state.translation_unit.length; i++) {
					translation_unit(state.translation_unit[i]);
				}
			} catch (e) {
				this.errors.push(e);
				throw e;
				//return false;
			}

			debugger;

			this.output = irs;
			this.status = true;

			return true;
		}		
	};

}(glsl, StdIO));

