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

(function(glsl) {

	//-------------------------------------------------
	//	Code Generation Options/Data
	//-------------------------------------------------

	//Type qualifier global variables
	var g_type_qualifier_globals = [];
	g_type_qualifier_globals[glsl.ast.type_qualifier.flags.varying] = '__varying';

	function g_type_default_value(type) {
		switch (type.type_specifier) {
			case glsl.ast.types.vec3:
				return '[0,0,0]';
			case glsl.ast.types.vec4:
				return '[0,0,0,0]';
			case glsl.ast.types.mat4:
				return '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]';
			default:
				throw new Error(g_error('Cannot generate default value for type ' + type.type_name, type));
		}
	}

	function g_type_qualifier_global(qualifier) {
		var qual = '';
		for (var i in g_type_qualifier_globals) {
			if (qualifier.flags.q & i) {
				qual = g_type_qualifier_globals[i];
			}
		}
		return qual;
	}

	//table for valid type operations
	var g_valid_type_operations = {};
	var g_operations_types = {
		'cast' : {
			vec3 : {
				vec4 : { type : 'vec4', func : '__cast_vec3_vec4' }
			}
		},
		5 : { //glsl.ast.operators.mul
			mat4 : {
				mat4 : { type : 'mat4', func : 'mat4.multiply' },
				vec4 : { type : 'vec4', func : 'mat4.multiplyVec4' }
			}
		}
	}

	function g_get_operation(op, type1, type2) {
		var op = g_operations_types[op];
		if (op[type1] && op[type1][type2]) {
			return op[type1][type2];
		}
		return false;
	}

	function g_indent() {
		return new Array(glsl.generator.depth + 1).join("\t");
	}

	//-------------------------------------------------
	//	Code Generation
	//-------------------------------------------------
	
	function g_ast_type_specifier(ts) {
		if (ts.is_precision_statement) {
			return "\n";	
		}
		throw new Error(g_error('Cannot generate type specifier', ts));
	}

	function g_ast_declarator_list(dl) {

		var code = '', q_code = '', d_code;
		
		//generate qualifier global vars for external communication
		var type = dl.type;
		var q = type.has_qualifiers();
		if (q) {
			q_code = g_type_qualifier_global(type.qualifier);
		}

		//get default initialization values
		var specifier = type.specifier;
		
		d_code = g_type_default_value(specifier);
		if (!d_code) {
			return false;
		}
		
		var list = dl.declarations;
		for (var i = 0; i < list.length; i++) {
			var decl = list[i];
			var name = decl.identifier;
			
			//update symbol table entry type
			var entry = glsl.state.symbols.get_variable(name);
			entry.type = specifier.type_name;
			
			//qualifier?[name] = default_value
			code += (q ? (q_code + "['" + name + "']") : name) + " = " + d_code + ";\n";
		}
		return code;
	}

	function g_ast_function(f) {
		var code = '', p_code = '';

		var name = f.identifier;
		var parameters = f.parameters;

		var params = [];
		for (var i = 0; i < parameters.length; i++) {
			var param = parameters[i];
			if (param.is_void) {
				return '';
			}
			params.push(param.identifier);
		}
		p_code = params.join(", ");

		code = "function " + name + "(" + p_code + ")";

		return code;
	}
	
	function g_ast_expression_op(e) {

		var exp = {};
		var se = e.subexpressions;
		if (se) {
			var se1 = se[0], se2 = se[1], se3 = se[2];
		}

		var left, right, third;
		//ast_expression una/bin/tri

		if (se1) {
			left = g_ast_expression(se1);
		}

		if (se2) {
			right = g_ast_expression(se2);
		}

		if (se3) {
			third = g_ast_expression(se3);
		}

		switch (e.oper) {

			case glsl.ast.operators.assign:

				if (left.type != right.type) {
					throw new Error(g_error("Could not assign value of type " + right.type + " to " + left.type, e));
				}

				//@todo:
				//check that left is a valid type for assignment
				//if left has a quantifier, generate that

				exp.type = left.type;
				exp.code = left.code + " = " + right.code;
				return exp;

			//case glsl.ast.operators.*
			case glsl.ast.operators.mul:
				var op = g_get_operation(e.oper, left.type, right.type);
				if (!(exp.type = op.type)) {
					throw new Error(g_error("Cannot apply operation to " + left.type + " and " + right.type, e));
				}
				exp.code = op.func + '(' + left.code + ',' + right.code + ')';
				return exp;

			case glsl.ast.operators.function_call:
				var es = [];

				for (var i = 0; i < e.expressions.length; i++) {
					es.push(g_ast_expression(e.expressions[i]).code);
				}

				//cast
				if (left) {
					exp.type = left.type;
					exp.code = '__cast_' + left.type + '(' + es.join(',') + ')';
					return exp;
				}

			default:
				throw new Error(g_error("Could not translate unknown expression " + e.typeof() + '(' + e.oper + ')', e));
		}
	}
		
	function g_ast_expression_simple(e) {
		var exp = {};
		
		//identifier
		if (e.primary_expression.identifier) {

			exp.code = e.primary_expression.identifier;

			//lookup type in symbol table
			var symbol = glsl.state.symbols.get_variable(e.primary_expression.identifier);
			if (!symbol || !symbol.type) {
				throw new Error(g_error(e.primary_expression.identifier + " is undefined", e));
			}
			exp.type = symbol.type;
			return exp;
		}

		if (typeof e.primary_expression.float_constant != 'undefined') {
			exp.code = e.primary_expression.float_constant;
			exp.type = 'float';
			return exp;
		}
		
		throw new Error(g_error("Cannot translate unkown simple expression type", e));
	}

	function g_ast_expression(e) {

		var exp = {};

		//operator
		if (typeof e.oper == 'number') {
			exp = g_ast_expression_op(e);
			return exp;
		}

		//simple (variable, or value)
		if (e.primary_expression) {
			exp = g_ast_expression_simple(e);
			return exp;
		}

		//cast
		if (e.typeof('ast_type_specifier')) {
			exp.type = e.type_name;
			return exp;
		}

		throw new Error(g_error("Could not translate unkown expression type", e));
	}

	function g_ast_expression_statement(es) {
		var exp = g_ast_expression(es.expression);
		if (exp.code) {
			exp.code += ";\n";
		}
		return exp.code;
	}

	function g_ast_compound_statement(cs) {
		var code = '';
		var stmts = cs.statements;
		glsl.generator.depth++;
		for (var i = 0; i < stmts.length; i++) {
			var stmt = stmts[i];
			switch (stmt.typeof()) {
				case 'ast_expression_statement':
					var es = g_ast_expression_statement(stmt)
					if (!es) {
						return false;
					}
					code += g_indent() + es;
					break;
				default:
					throw new Error(g_error("Could not translate statement type (" + stmt.typeof() + ")", stmt));
			}
		}
		
		glsl.generator.depth--;
		code = g_indent() + "{\n" + code + g_indent() + "}\n";
		return code;
	}

	function g_ast_function_definition(fd) {
		var code = '', p_code = '', b_code = '';

		if (fd.is_definition) {
			//just need to add to symbol table
			return "\n";
		}

		p_code = g_ast_function(fd.proto_type);
		b_code = g_ast_compound_statement(fd.body);
		if (!b_code) {
			return false;	
		}

		code = p_code + "\n" + b_code;
		return code;
	}

	function g_translation_unit(tu) {
		var t = tu.typeof();
		switch (t) {
			case 'ast_declarator_list':
				return g_ast_declarator_list(tu);
			case 'ast_type_specifier':
				return g_ast_type_specifier(tu);
			case 'ast_function_definition':
				return g_ast_function_definition(tu);
			default:
				throw new Error(g_error('Cannot translate syntax tree node (' + d.typeof() + ')'  , tu));
		}
	}

	function g_error(msg, n) {
		if (n && n.location) {
			msg += " at line " + n.location.line + ", column " + n.location.column;	
		}
		return msg;
	}
	
	//-----------------------------------------------------------
	//External interface

	glsl.generator = {
		
		depth : 0,

		output : '',
		status : false,
		errors : [],

		createObjectCode : function(state) {

			//initialize
			this.output = '';
			this.status = false;
			this.errors = [];

			try {
				for (var i = 0; i < state.translation_unit.length; i++) {
					var tu = state.translation_unit[i];
					this.output += g_translation_unit(tu);					
				}
			} catch (e) {
				this.errors.push(e);
				return false;
			}

			this.status = true;
			return true;
		}		
	};

})(glsl);

