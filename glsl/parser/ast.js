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

var util = require('util');
var types = require('./type.js').types;

/**
 * Base class of all abstract syntax tree nodes
 */
function ast_node() {

	//public:
	this.location = {
		line : 0,
		column : 0
	};
}

var proto = ast_node.prototype = {};

//public:
proto.getLocation = function() {
	return {
		line : this.line,
		column : this.column
	};
};

proto.setLocation = function(line, column) {
	this.location.line = line;
	this.location.column = column;
	return this;
};

proto.toString = function() {
	return this.constructor.name;
};


/**
 * Operators for AST expression nodes.
 */
var operators = {
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

//inverse of operators
var i, op_names = [];
for (i in operators) {
	op_names[operators[i]] = i;
}

var op_strings = [
	"=",
	"+",
	"-",
	"+",
	"-",
	"*",
	"/",
	"%",
	"<<",
	">>",
	"<",
	">",
	"<=",
	">=",
	"==",
	"!=",
	"&",
	"^",
	"|",
	"~",
	"&&",
	"^^",
	"||",
	"!",		
	"*=",
	"/=",
	"%=",
	"+=",
	"-=",
	"<<=",
	">>=",
	"&=",
	"^=",
	"|=",
	"?:",
	"++",
	"--",
	"++",
	"--",
	"."
];

var ast_precision = {
	none : 0,
	high : 1,
	medium : 2,
	low : 3
};



/**
 * AST Type Specifier Class
 */
function ast_type_specifier(specifier) {
	ast_node.apply(this);
	this.type_specifier = null;
	this.type_name = null;
	this.structure = null;
	this.is_array = 0;
	this.array_size = null;	
	this.precision = 2;
	this.is_precision_statement = null;

	if (ast_type_specifier[typeof specifier]) {
		ast_type_specifier[typeof specifier].call(this, specifier);
	}
}

proto = ast_type_specifier.prototype;
util.inherits(ast_type_specifier, ast_node);

//overloaded constructors
ast_type_specifier.number = function(specifier) {
	this.type_specifier = specifier;
	this.precision = ast_precision.none;
	this.is_precision_statement = false;
	this.type_name = type[specifier].name;
};

ast_type_specifier.string = function(name) {
	this.type_specifier = types[name];
	this.type_name = name;
	this.is_array = false;
	this.precision = ast_precision.none;
	this.is_precision_statement = false;
};

ast_type_specifier.object = function(s) {
	this.type_specifier = type.struct;
	this.type_name = s.name;
	this.structure = s;
	this.is_array = false;
	this.precision = ast_precision.none;
	this.is_precision_statement = false;			
};

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s %s",
					this.type_specifier == type.struct ? this.structure : this.type_name,
					this.is_array ? util.format("[ %s] ", this.array_size ? this.array_size : "") : ""
					);
};


/**
 * AST Function Class
 */
function ast_function() {
	ast_node.apply(this);

	this.return_type = null;
	this.identifier = null;
	this.parameters = [];
	this.is_definition = false;
	this.signature = null;	
}

proto = ast_function.prototype;
util.inherits(ast_function, ast_node);

/**
 * toString
 *
 * @return  string
 */
ast_function.toString = function() {
	return util.format("%s %s(%s)", this.return_type, this.identifier, this.parameters);			
};

/**
 * Representation of any sort of expression.
 */
function ast_expression() {
	ast_node.apply(this);
	
	this.oper = null;
	this.subexpressions = new Array(3);
	this.primary_expression = {};
	this.expressions = [];
	
	if (arguments.length == 1) {
		var identifier = arguments[0];

		this.oper = operators.identifier;
		this.primary_expression.identifier = identifier;
	
	} else {
		var oper = arguments[0], ex0 = arguments[1], ex1 = arguments[2], ex2 = arguments[3];
		
		this.oper = oper;
		this.subexpressions[0] = ex0;
		this.subexpressions[1] = ex1;
		this.subexpressions[2] = ex2;
	}
	
}

proto = ast_expression.prototype;
util.inherits(ast_expression, ast_node);

//public:

proto.toString = function() {
	switch (this.oper) {
		case operators.assign:
		case operators.mul_assign:
		case operators.div_assign:
		case operators.mod_assign:
		case operators.add_assign:
		case operators.sub_assign:
		case operators.ls_assign:
		case operators.rs_assign:
		case operators.and_assign:
		case operators.xor_assign:
		case operators.or_assign:
			return util.format("(%s %s %s)", this.subexpressions[0], op_strings[this.oper], this.subexpressions[1]);
			break;

		case operators.field_selection:
			return util.format("(%s. %s)", this.subexpressions[0], this.primary_expression.identifier);
			break;

		case operators.plus:
		case operators.neg:
		case operators.bit_not:
		case operators.logic_not:
		case operators.pre_inc:
		case operators.pre_dec:
			return util.format("(%s %s)", op_strings[this.oper], this.subexpressions[0]);
			break;
		
		case operators.post_inc:
		case operators.post_dec:
			return util.format("(%s %s)", this.subexpressions[0], op_strings[this.oper]);
			break;

		case operators.conditional:
			return util.format("(%s ? %s : %s)", this.subexpressions[0], this.subexpressions[1], this.subexpressions[2]);				
			break;

		case operators.array_index:
			return util.format("(%s [ %s ])", this.subexpressions[0], this.subexpressions[1]);				
			break;

		case operators.function_call:
			return util.format("(%s ( %s ))", this.subexpressions[0], this.expressions.join(", "));
			break;

		case operators.identifier:
			return util.format("%s", this.primary_expression.identifier);
			break;
		
		case operators.int_constant:
			return util.format("%s", this.primary_expression.int_constant);
			break;
		
		case operators.uint_constant:
			return util.format("%s", this.primary_expression.uint_constant);
			break;
		
		case operators.float_constant:
			return util.format("%s", this.primary_expression.float_constant);
			break;
		
		case operators.bool_constant:
			return util.format("%s", this.primary_expression.bool_constant ? 'true' : 'false');
			break;

		case operators.sequence:
			return util.format("(%s))", this.expressions.join(", "));
			break;
	}
};


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


/**
 * AST Fully Specified Type Class
 */
function ast_fully_specified_type() {
	ast_node.apply(this);
	
	this.qualifier = null;
	this.specifier = null;
}

proto = ast_fully_specified_type.prototype;
util.inherits(ast_fully_specified_type, ast_node);

/**
 * 
 */
proto.has_qualifiers = function() {
	return this.qualifier.flags.i != 0;
};

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("... %s", this.specifier);
};


/**
 * AST Declaration Class
 */
function ast_declaration(identifier, is_array, array_size, initializer) {
	ast_node.apply(this);

	this.identifier = identifier;
	this.is_array = is_array;
	this.array_size = array_size;
	this.initializer = initializer;
}

proto = ast_declaration.prototype;
util.inherits(ast_declaration, ast_node);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s %s %s", this.identifier, "...", this.initializer ? util.format("= %s", this.initializer) : "");
};


/**
 * AST Declarator List Class
 */
function ast_declarator_list(type) {
	ast_node.apply(this);

	this.type = type;
	this.declarations = [];
	this.invariant = 0;
}

proto = ast_declarator_list.prototype;
util.inherits(ast_declarator_list, ast_node);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s %s;\n", this.type ? this.type : "invariant ", this.declarations.join(""));
};


/**
 * AST Parameter Declarator Class
 */
function ast_parameter_declarator() {
	ast_node.apply(this);
	this.type = null;
	this.identifier = null;
	this.is_array = false;
	this.array_size = 0;
	this.formal_parameter = null;
	this.is_void = null;
}

proto = ast_parameter_declarator.prototype;
util.inherits(ast_parameter_declarator, ast_node);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s%s %s", this.type, this.identifier ? this.identifier : "", this.is_array ? util.format("[%s]", this.array_size) : "");
};


/**
 * AST Expression Statement Class
 */
function ast_expression_statement(ex) {
	ast_node.apply(this);

	this.expression = ex;
}

proto = ast_expression.prototype;
util.inherits(ast_expression_statement, ast_node);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s;\n ", this.expression ? this.expression : "");
};


/**
 * AST Compound Statement Class
 */
function ast_compound_statement(new_scope, statements) {
	ast_node.apply(this);
	this.new_scope = new_scope;
	if (statements) {
		this.statements = statements;
	} else {
		this.statements = [];
	}
}
 
proto = ast_compound_statement.prototype;
util.inherits(ast_compound_statement, ast_node);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("{\n%s}\n", this.statements.join(""));
};


/**
 * AST Function Definition Class
 */
function ast_function_definition() {
	ast_node.apply(this);

	this.proto_type = null;
	this.body = null;
}

proto = ast_function_definition.prototype;
util.inherits(ast_function_definition, ast_node);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s%s", this.proto_type, this.body);
};

/**
 * AST Function Definition Class
 */
function ast_expression_bin(oper, ex0, ex1) {
	ast_expression.apply(this, [oper, ex0, ex1]);
}

proto = ast_expression_bin.prototype;
util.inherits(ast_expression_bin, ast_expression);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("(%s %s %s)", this.subexpressions[0], op_strings[this.oper], this.subexpressions[1]);
};


/**
 * AST Function Expression Class
 */
function ast_function_expression(arg) {
	ast_expression.apply(this);
	this.cons = false;

	if (arg.constructor.name == 'ast_expression') {
		this.cons = false;
		ast_expression.call(this, operators.function_call, arg);
	} else if (arg.constructor.name == 'ast_type_specifier') {
		this.cons = true;			
		ast_expression.call(this, operators.function_call, arg);
	}

}

proto = ast_function_expression.prototype;
util.inherits(ast_function_expression, ast_expression);

proto.is_constructor = function() {
	return this.cons;
};

/*
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
		
		ast_selection_statement.toString = function() {
			return util.format("if ( %s) %s %s", this.condition, this.then_statement, this.else_statement ? util.format("else %s", this.else_statement) : "");
		};

		return ast_selection_statement.Constructor;

	}());


	var ast_struct_specifier = (function() {

		//Internal Constructor
		function Initializer() {
			ast_node.Initializer.apply(this);
			this.name = null;
			this.declarations = [];
		}

		var ast_struct_specifier = jClass('ast_struct_specifier', Initializer, ast_node);

		var anon_count = 1;

		//public:
		ast_struct_specifier.ast_struct_specifier = function(identifier, declarator_list) {
			if (identifier == null) {
				identifier = glsl.util.format("#anon_struct%d", anon_count);
				anon_count++;
			}
			this.name = identifier;
			this.declarations = declarator_list.declarations;
		};

		return ast_struct_specifier.Constructor;

	}());
*/


/**
 * Exports
 */
module.exports = {
	precision : ast_precision,
	type_qualifier : ast_type_qualifier,
	type_specifier : ast_type_specifier,
	fully_specified_type : ast_fully_specified_type,
	declaration : ast_declaration,
	declarator_list : ast_declarator_list,
	func : ast_function,
	parameter_declarator : ast_parameter_declarator,
	expression : ast_expression,
	operators : operators,
	op_names : op_names,
	expression_statement : ast_expression_statement,
	compound_statement : ast_compound_statement,
	function_definition : ast_function_definition,
	expression_bin : ast_expression_bin,
	function_expression : ast_function_expression
	/*
	selection_statement : ast_selection_statement,
	struct_specifier : ast_struct_specifier
	*/
};

