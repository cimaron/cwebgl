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


	var exec_node = (function() {
		
		function Initializer() {
			this.prev = null;
			this.next = null;
			this.data = null;
		}
		
		var exec_node = jClass('exec_node', Initializer);
		
		exec_node.exec_node = function(data) {
			this.data = data;
		};
		
		exec_node.self_link = function(el) {
			this.prev = this;
			this.next = this;
		};
		
		exec_node.insert_before = function(before) {
			before.next = this;
			before.prev = this.prev;
			this.prev.next = before;
			this.prev = before;
		};

		return exec_node.Constructor;

	}());

	var exec_list = (function() {
		
		function Initializer() {
			this.head = null;
			this.tail = null;
			this.tail_pred = null;
		}
		
		var exec_list = jClass('exec_list', Initializer);
		
		exec_list.exec_list = function() {
		};

		exec_list.push_degenerate_list_at_head = function(n) {
			//assert(n.prev.next == n);
			//n.prev.next = this.head;
			//this.head.prev = n.prev;
			//n.prev = this.head;
			//this.head = n;
			//n.prev = (exec_node *) &this.head;
			//this.head = n;
			this.head = n;
		};

		return exec_list.Constructor;

	}());

	/**
	 * Base class of all abstract syntax tree nodes
	 */
	var ast_node = (function() {

		//Internal Constructor
		function Initializer() {
			//public:
			this.location = {
				source : 0,
				line : 0,
				column : 0
			};
			this.link = new exec_node(this);
		}

		var ast_node = jClass('ast_node', Initializer);

		//public:

		ast_node.ast_node = function() {
			this.location.source = 0;
			this.location.line = 0;
			this.location.column = 0;	
		};

		ast_node.get_location = function() {
			locp = {};
			locp.source = this.locaiton.source;
			locp.first_line = this.location.line;
			locp.first_column = this.location.column;
			locp.last_line = locp.first_line;
			locp.last_column = locp.first_column;
			return locp;			
		};

		ast_node.set_location = function(locp) {
			this.location.source = locp.source;
			this.location.line = locp.first_line;
			this.location.column = locp.first_column;
		};

		ast_node.print = function() {
			printf("unhandled node");
		};

		return ast_node.Constructor;

	}());

	/**
	 * Operators for AST expression nodes.
	 */
	var ast_operators = {
		assign : 0,
		plus : 1,        /**< Unary + operator. */
		neg : 2,
		add : 3,
		sub : 4,
		mul : 5,
		div : 6,
		mod : 7,
		lshift : 8,
		rshift : 9,
		less : 10,
		greater : 11,
		lequal : 12,
		gequal : 13,
		equal : 14,
		nequal : 15,
		bit_and : 16,
		bit_xor : 17,
		bit_or : 18,
		bit_not : 19,
		logic_and : 20,
		logic_xor : 21,
		logic_or : 22,
		logic_not : 23,
		
		mul_assign : 24,
		div_assign : 25,
		mod_assign : 26,
		add_assign : 27,
		sub_assign : 28,
		ls_assign : 29,
		rs_assign : 30,
		and_assign : 31,
		xor_assign : 32,
		or_assign : 33,
		
		conditional : 34,
		
		pre_inc : 35,
		pre_dec : 36,
		post_inc : 37,
		post_dec : 38,
		field_selection : 39,
		array_index : 40,
		
		function_call : 41,
		
		identifier : 42,
		int_constant : 43,
		uint_constant : 44,
		float_constant : 45,
		bool_constant : 46,
		
		sequence : 47
	};

	var ast_precision = {
		none : 0,
		high : 1,
		medium : 2,
		low : 3
	};

	var ast_types = {
		'void' : 0,
		float : 1,
		int : 2,
		uint : 3,
		bool : 4,
		vec2 : 5,
		vec3 : 6,
		vec4 : 7,
		bvec2 : 8,
		bvec3 : 9,
		bvec4 : 10,
		ivec2 : 11,
		ivec3 : 12,
		ivec4 : 13,
		uvec2 : 14,
		uvec3 : 15,
		uvec4 : 16,
		mat2 : 17,
		mat2x3 : 18,
		mat2x4 : 19,
		mat3x2 : 20,
		mat3 : 21,
		mat3x4 : 22,
		mat4x2 : 23,
		mat4x3 : 24,
		mat4 : 25,
		sampler1D : 26,
		sampler2D : 27,
		sampler2Drect : 28,
		sampler3D : 29,
		samplercube : 30,
		sampler1Dshadow : 31,
		sampler2Dshadow : 32,
		sampler2Drectshadow : 33,
		samplercubeshadow : 34,
		sampler1Darray : 35,
		sampler2Darray : 36,
		sampler1Darrayshadow : 37,
		sampler2Darrayshadow : 38,
		isampler1D : 39,
		isampler2D : 40,
		isampler3D : 41,
		isamplercube : 42,
		isampler1Darray : 43,
		isampler2Darray : 44,
		usampler1D : 45,
		usampler2D : 46,
		usampler3D : 47,
		usamplercube : 48,
		usampler1Darray : 49,
		usampler2Darray : 50,
		
		struct : 51,
		type_name : 52
	};

	var ast_type_specifier = (function() {
	
		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.type_specifier = null;
			this.type_name = null;
			this.structure = null;
			this.is_array = 0;
			this.array_size = null;	
			this.precision = 2;
			this.is_precision_statement = null;
		}

		var ast_type_specifier = jClass('ast_type_specifier', Initializer, ast_node);	

		//public:
		ast_type_specifier.ast_type_specifier = function(specifier) {
			if (this.ast_type_specifier[typeof specifier]) {
				this.ast_type_specifier[typeof specifier].call(this, specifier);
			}
		};

		//overloaded constructors
		ast_type_specifier.ast_type_specifier.number = function(specifier) {
			this.type_specifier = specifier;
			this.precision = ast_precision.none;
			this.is_precision_statement = false;
			var names = [
				"void",
				"float",
				"int",
				"uint",
				"bool",
				"vec2",
				"vec3",
				"vec4",
				"bvec2",
				"bvec3",
				"bvec4",
				"ivec2",
				"ivec3",
				"ivec4",
				"uvec2",
				"uvec3",
				"uvec4",
				"mat2",
				"mat2x3",
				"mat2x4",
				"mat3x2",
				"mat3",
				"mat3x4",
				"mat4x2",
				"mat4x3",
				"mat4",
				"sampler1D",
				"sampler2D",
				"sampler2DRect",
				"sampler3D",
				"samplerCube",
				"sampler1DShadow",
				"sampler2DShadow",
				"sampler2DRectShadow",
				"samplerCubeShadow",
				"sampler1DArray",
				"sampler2DArray",
				"sampler1DArrayShadow",
				"sampler2DArrayShadow",
				"isampler1D",
				"isampler2D",
				"isampler3D",
				"isamplerCube",
				"isampler1DArray",
				"isampler2DArray",
				"usampler1D",
				"usampler2D",
				"usampler3D",
				"usamplerCube",
				"usampler1DArray",
				"usampler2DArray",
				
				null, /* ast_struct */
				null  /* ast_type_name */
			];

			this.type_name = names[specifier];
		};

		ast_type_specifier.ast_type_specifier.string = function(name) {
			this.type_specifier = ast_types.type_name;
			this.type_name = name;
			this.is_array = false;
			this.precision = ast_precision.none;
			this.is_precision_statement = false;
		};
		
		ast_type_specifier.ast_type_specifier.object = function(specifier) {
			this.type_specifier = ast_types.struct;
			this.type_name = s.name;
			this.structure = s;
			this.is_array = false;
			this.precision = ast_precision.none;
			this.is_precision_statement = false;			
		};

		ast_type_specifier.print = function() {
			if (this.type_specifier == ast_types.struct) {
				this.structure.print();
			} else {
				printf("%s ", this.type_name);	
			}
			if (this.is_array) {
				printf("[ ");
				if (this.array_size) {
					array_size.print();	
				}
				printf(" ]");
			}
		};

		return ast_type_specifier.Constructor;

	}());


	var ast_function = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.return_type = null;
			this.identifier = null;
			this.parameters = [];
			this.is_definition = null;
			this.signature = null;
		}

		var ast_function = jClass('ast_function', Initializer, ast_node);
		
		//public:
		ast_function.ast_function = function() {
			this.is_definition = false;
		};
		
		ast_function.print = function() {
			var i;
			this.return_type.print();
			printf(" %s (", this.identifier);
			/*
			for (i = 0; i < this.parameters.length; i++) {
				var ast = exec_node_data(ast_node, n, link);
				ast.print();
			}
			*/
			printf(")");
		};

		return ast_function.Constructor;

	}());


	/**
	 * Representation of any sort of expression.
	 */
	var ast_expression = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.oper = null;
			this.subexpressions = new Array(3);
			this.primary_expression = {};
			this.expressions = [];
		}

		var ast_expression = jClass('ast_expression', Initializer, ast_node);

		//public:
		ast_expression.ast_expression = function() {
			if (arguments.length == 1) {
				this.ast_expression.one.apply(this, arguments);	
			} else {
				this.ast_expression.four.apply(this, arguments);
			}
		};

		ast_expression.ast_expression.one = function(identifier) {
			//this.oper = ast_identifier
			this.primary_expression.identifier = identifier;
		};

		ast_expression.ast_expression.four = function(oper, ex0, ex1, ex2) {
			this.oper = oper;
			this.subexpressions[0] = ex0;
			this.subexpressions[1] = ex1;
			this.subexpressions[2] = ex2;
		};
		
		ast_expression.print = function() {			
		};

		return ast_expression.Constructor;

	}());



	var ast_type_qualifier = function() {
		//large union
		this.flags = {};
		this.location = null;
	};
	ast_type_qualifier.flags = {
		invariant : 1,
		constant : 2,
		attribute : 4,
		varying : 8,
		'in' : 16,
		out : 32,
		centroid : 64,
		uniform : 128,
		smooth : 256,
		flat : 512,
		noperspective : 1024,
		origin_upper_left : 2048,
		pixel_center_integer : 4096,
		explicit_location : 8192
	};

	var ast_fully_specified_type = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.qualifier = null;
			this.specifier = null;
		}

		var ast_fully_specified_type = jClass('ast_fully_specified_type', Initializer, ast_node);

		//public:

		ast_fully_specified_type.has_qualifiers = function() {
			return this.qualifier.flags.i != 0;
		};

		ast_fully_specified_type.print = function() {
			//ast_Type_qualifier_print(qualifier);
			this.specifier.print();	
		};

		return ast_fully_specified_type.Constructor;

	}());


	var ast_declaration = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.identifier = null;
			this.is_array = 0;
			this.array_size = null;
			this.initializer = null;
		}

		var ast_declaration = jClass('ast_declaration', Initializer, ast_node);

		//public:

		ast_declaration.ast_declaration = function(identifier, is_array, array_size, initializer) {
			this.identifier = identifier;
			this.is_array = is_array;
			this.array_size = array_size;
			this.initializer = initializer;
		};
		
		ast_declaration.print = function() {
			printf("%s ", identifier);
			ast_opt_array_size_print(is_array, array_size);
			if (initializer) {
				printf("= ");
				initializer.print();
			}
		};

		return ast_declaration.Constructor;		
	
	}());


	var ast_declarator_list = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.type = null;
			this.declarations = [];
			this.invariant = 0;
		}

		var ast_declarator_list = jClass('ast_declarator_list', Initializer, ast_node);

		//public:

		ast_declarator_list.ast_declarator_list = function(type) {
			this.type = type;
			this.invariant = 0;
		};

		ast_declarator_list.print = function() {
			var i;

			if (type) {
				type.print();
			} else {
				printf("invariant ");	
			}
			
			for (i = 0; i < this.declarations.length; i++) {
				if (i != 0) {
					printf(", ");
				}
				var ast = exec_node_data(this.ast_node, i, this.link);
				ast.print();
			}
			printf("; ");
		};

		return ast_declarator_list.Constructor;		

	}());


	var ast_parameter_declarator = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.type = null;
			this.identifier = null;
			this.is_array = 0;
			this.array_size = null;
			this.formal_parameter = null;
			this.is_void = null;
		}

		var ast_parameter_declarator = jClass('ast_parameter_declarator', Initializer, ast_node);

		//public:

		ast_parameter_declarator.ast_parameter_declarator = function() {
			this.identifier = null;
			this.is_array = false;
			this.array_size = 0;
		};

		ast_parameter_declarator.print = function() {
		};

		return ast_parameter_declarator.Constructor;

	}());


	var ast_expression_statement = (function() {

		//Internal Constructor
		function Initializer() {
			ast_expression.Initializer.apply(this);
			this.expression = null;
		}

		var ast_expression_statement = jClass('ast_expression_statement', Initializer, ast_expression);

		//public:

		ast_expression_statement.ast_expression_statement = function(ex) {
			this.expression = ex;
		};

		ast_expression_statement.print = function() {			
		};

		return ast_expression_statement.Constructor;
	
	}());


	var ast_compound_statement = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.new_scope = null;
			this.statements = new exec_list();
		}

		var ast_compound_statement = jClass('ast_compound_statement', Initializer, ast_node);

		//public:

		ast_compound_statement.ast_compound_statement = function(new_scope, statements) {
			this.new_scope = new_scope;
			if (statements) {
				this.statements.push_degenerate_list_at_head(statements.link);
			}
		};

		ast_compound_statement.print = function() {			
		};

		return ast_compound_statement.Constructor;

	}());


	var ast_function_definition = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.proto_type = null;
			this.body = null;
		}

		var ast_function_definition = jClass('ast_function_definition', Initializer, ast_node);

		//public:

		ast_function_definition.ast_function_definition = function() {
		};

		ast_function_definition.print = function() {			
		};

		return ast_function_definition.Constructor;
	
	}());


	var ast_expression_bin = (function() {

		//Internal Constructor
		function Initializer() {
			ast_expression.Initializer.apply(this);
		}

		var ast_expression_bin = jClass('ast_expression_bin', Initializer, ast_expression);

		//public:
		ast_expression_bin.ast_expression_bin = function(oper, ex0, ex1) {
			this.ast_expression(oper, ex0, ex1, null);
			//assert(oper >= ast.operators.plus && oper <= ast.operators.logic_not);
		};

		ast_expression_bin.print = function() {	
		};

		return ast_expression_bin.Constructor;
	
	}());


	var ast_function_expression = (function() {

		//Internal Constructor
		function Initializer() {
			ast_expression.Initializer.apply(this);
			this.cons = false;
		}

		var ast_function_expression = jClass('ast_function_expression', Initializer, ast_expression);

		//public:
		ast_function_expression.ast_function_expression = function(a) {
			if (a.typeOf('ast_expression')) {
				ast_function_expression.ast_function_expression.ast_expression.apply(this, arguments);
			} else {
				ast_function_expression.ast_function_expression.ast_type_specifier.apply(this, arguments);				
			}
		};

		ast_function_expression.ast_function_expression.ast_expression = function(callee) {
			this.ast_expression(ast_operators.function_call, callee, null, null);
			this.cons = false;
		};

		ast_function_expression.ast_function_expression.ast_type_specifier = function(type) {
			this.ast_expression(ast_operators.function_call, type, null, null);
			this.cons = true;			
		};


		ast_function_expression.print = function() {
		};

		ast_function_expression.is_constructor = function() {
			return this.cons;
		};

		return ast_function_expression.Constructor;
	
	}());


	var ast_selection_statement = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.condition = null;
			this.then_statement = null;
			this.else_statement = null;
		}

		var ast_selection_statement = jClass('ast_selection_statement', Initializer, ast_node);

		//public:
		ast_selection_statement.ast_selection_statement = function(condition, then_statement, else_statement) {
			this.condition = condition;
			this.then_statement = then_statement;
			this.else_statement = else_statement;
		};

		ast_selection_statement.print = function() {	
		};

		return ast_selection_statement.Constructor;

	}());


	//-----------------------------------------------------------
	//	External interface

	glsl.ast = {
		types : ast_types,
		precision : ast_precision,
		type_qualifier : ast_type_qualifier,
		type_specifier : ast_type_specifier,
		fully_specified_type : ast_fully_specified_type,
		declaration : ast_declaration,
		declarator_list : ast_declarator_list,
		'function' : ast_function,
		parameter_declarator : ast_parameter_declarator,
		expression : ast_expression,
		operators : ast_operators,
		expression_statement : ast_expression_statement,
		compound_statement : ast_compound_statement,
		function_definition : ast_function_definition,
		expression_bin : ast_expression_bin,
		function_expression : ast_function_expression,
		selection_statement : ast_selection_statement
	};

}(glsl));

