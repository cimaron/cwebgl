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
	var objCode, IR, sprintf;
	objCode = glsl.objCode;
	IR = glsl.IR;
	sprintf = glsl.sprintf;

	//-------------------------------------------------
	//	Code Generation
	//-------------------------------------------------


	/**
	 * Constructs a compound statement code block
	 *
	 * @param   ast_node    ast_node that represents a compound statement type
	 *
	 * @return  array(IR)
	 */
	function compound_statement(cs) {
		var irs, irs1, start, node, stmt;

		glsl.state.symbols.push_scope();
		glsl.generator.depth++;

		node = cs.statements.head;
		start = null;
		irs = [];

		while (node != start) {

			stmt = node.data;

			switch (stmt.typeOf()) {

				case 'ast_expression_statement':
					irs1 = expression(stmt.expression);
					break;

				case 'ast_declarator_list':
					irs1 = declarator_list(stmt);
					break;

				case 'ast_selection_statement':
					irs1 = selection_statement(stmt);
					break;

				default:
					throw_error(sprintf("Could not unknown translate statement type %s", stmt.typeOf()), stmt);
			}

			irs = irs.concat(irs1);

			if (!start) {
				start = node;
			}
			node = node.next;
		}

		glsl.state.symbols.pop_scope();
		glsl.generator.depth--;

		return irs;
	}


	/**
	 * Constructs a type constructor
	 *
	 * @param   ast_node    ast_node that represents a constructor operation
	 * @param   ast_node    ast_node that represents the constructor components
	 *
	 * @return  array(IR)
	 */
	function constructor(ts, comp) {
		var irs, ir, size, di, ci, sei, se, ses, dest, sedest;

		size = glsl.type.size[ts.type_specifier];
		ci = -1;
		ses = -1;
		sei = 0;

		irs = [];
		//get our temporary register
		ir = new IR('CLR', null, size, null, 'tv_');
		irs.push(ir);
		dest = ir.d;

		for (di = 0; di < size; di++) {

			if (ses <= sei) {

				//build next subexpression
				ci++;
				if (!comp[ci]) {
					throw_error("Not enough parameters to constructor", ts);				
				}

				se = expression(comp[ci]);
				irs = irs.concat(se);
				sei = 0;
				ses = glsl.type.size[comp[ci].Type];
				sedest = se[se.length - 1].d;
			}
			sei++;

			if (size == 1) {
				throw_error("Non vector constructor not implemented yet", ts);
			}

			if (ses > 1) {
				throw_error("Vector constructor component not implemented yet", ts);				
			}

			ir = new IR('MOV', sprintf("%s[%s]", dest, di), sedest);
			irs.push(ir);
			ir = new IR('MOV', null, dest, null, 'tv_');
			irs.push(ir);
		}

		return irs;
	}
	
	/**
	 * Constructs an expression code block
	 *
	 * @param   ast_node    ast_node that represents an expression
	 *
	 * @return  array(IR)
	 */
	function expression(e) {
		var irs;

		if (!e) {
			return;	
		}

		//operator
		if (typeof e.oper == 'number') {
			irs = expression_op(e);
			return irs;
		}

		//simple (variable, or value)
		if (e.primary_expression) {
			irs = expression_simple(e);
			return irs;
		}

		//cast
		if (e.typeOf('ast_type_specifier')) {
			e.Type = e.type_specifier;
			return [];
		}

		throw_error("Could not translate unknown expression type", e);
	}

	/**
	 * Constructs an operator expression code block
	 *
	 * @param   ast_node    ast_node that represents an operator expression
	 *
	 * @return  objCode
	 */
	function expression_op(e) {
		var irs, se, irs1, irs2, irs3, i, entry, se_types, se_type_names, op_name;

		irs = [];
		if (se = e.subexpressions) {
			irs1 = expression(se[0]);
			irs2 = expression(se[1]);
			irs3 = expression(se[2]);
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
				irs = irs.concat(irs2);
				ir = new IR('MOV', se[0].primary_expression.identifier, irs[irs.length - 1].d);
				irs.push(ir);

				break;

			//simple expression
			case glsl.ast.operators.int_constant:
			case glsl.ast.operators.float_constant:
			case glsl.ast.operators.identifier:
				irs = expression_simple(e);
				break;

			//function call
			case glsl.ast.operators.function_call:

				if (e.cons) {
					e.Type = se[0].type_specifier;
					irs = constructor(se[0], e.expressions);
					break;
				}
				//fall through

			default:
				throw_error(sprintf("Could not translate unknown expression %s (%s)", e.typeOf(), e.oper), e);
		}

		return irs;
	}

	/**
	 * Constructs a simple expression code block
	 *
	 * @param   ast_node    ast_node that represents a simple expression
	 *                      (either an identifier or a single value)
	 *
	 * @return  array(IR)
	 */
	function expression_simple(e) {
		var ir, name, entry, t;

		//identifier
		if (e.primary_expression.identifier) {

			//lookup identifier in symbol table
			name = e.primary_expression.identifier;
			entry = glsl.state.symbols.get_variable(name);

			if (!entry || !entry.type) {
				throw_error(sprintf("Variable %s is undefined", name), e);
			}

			e.Type = entry.type;

			t = (glsl.type.size[entry.type] == 1) ? 'tf_' : 'tv_';

			ir = new IR('MOV', null, entry.object_name, null, t);

			return [ir];
		}

		//float constant
		if (typeof e.primary_expression.float_constant != 'undefined') {
			e.Type = glsl.type.float;
			ir = new IR('MOV', null, e.primary_expression.float_constant, null, 'tf_');
			return [ir];
		}

		//int constant
		if (typeof e.primary_expression.int_constant != 'undefined') {
			e.Type = glsl.type.ing;
			ir = new IR('MOV', null, e.primary_expression.int_constant, null, 'tf_');
			return [ir];
		}

		throw_error("Cannot translate unkown simple expression type", e);
	}

	/**
	 * Constructs a function header code block
	 *
	 * @param   ast_node    ast_node that represents an operator expression
	 *
	 * @return  array(IR)
	 */
	function _function(f) {
		var ir, irs, i, name, param;

		//generate
		name = f.identifier;
		//entry = glsl.state.symbols.get_function(name);

		ir = new IR("LBL", sprintf("function_%s:", name));
		irs = [ir];

		//generate param list
		for (i = 0; i < f.parameters.length; i++) {
			param = f.parameters[i];
			if (param.is_void || !param.identifier) {
				break;
			}
			ir = new IR('PRM', param.identifier);
			irs.push(ir);
		}

		return irs;
	}

	/**
	 * Constructs a function definition block
	 *
	 * @param   ast_node    ast_node that represents a function definition
	 *
	 * @return  array(IR)
	 */
	function function_definition(fd) {
		var ir, irs;

		if (fd.is_definition) {
			ir = new IR("REM", sprintf("function %s", fd.proto_type.identifier));
			return [ir];
		}

		//handle function proto
		irs = _function(fd.proto_type);

		//handle function body
		irs = irs.concat(compound_statement(fd.body));

		ir = new IR("RET");
		irs.push(ir);

		console.log(irs.join(""));
		return irs;
	}

	/**
	 * Constructs a translation unit
	 *
	 * @param   ast_node    ast_node that represents a translation unit
	 *
	 * @return  array(IR)
	 */
	function translation_unit(tu) {
		switch (tu.typeOf()) {
			case 'ast_function_definition':
				return function_definition(tu);
			case 'ast_type_specifier':
				return type_specifier(tu);
			default:
				throw_error(sprintf('Unknown translation unit %s', tu.typeOf()), tu);
		}
	}

	/**
	 * Constructs a type specifier code block
	 *
	 * @param   ast_node    ast_node that represents a type specifier
	 *
	 * @return  array(IR)
	 */
	function type_specifier(ts) {
		var ir;
		if (ts.is_precision_statement) {
			ir = new IR('REM', sprintf("precision %s %s", ts.type_specifier, ts.type_name));
			return [ir];
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

	//-----------------------------------------------------------
	//External interface

	glsl.generator = {
		
		depth : 0,

		output : '',
		status : false,
		errors : [],

		/**
		 * Constructs a program's object code from an ast and symbol table
		 *
		 * @param   string      The error message
		 * @param   ast_node    The error ast_node
		 *
		 * @return  string
		 */
		createObjectCode : function(state) {
			var code, irs;

			//initialize
			this.output = '';
			this.status = false;
			this.errors = [];

			try {
				code = new objCode();
				for (i = 0; i < state.translation_unit.length; i++) {
					irs = translation_unit(state.translation_unit[i]);
					code.addLine(irs.join(""));
				}
			} catch (e) {
				this.errors.push(e);
				throw e;
				//return false;
			}

			this.output += code;

			this.status = true;
			return true;
		}		
	};

}(glsl));

