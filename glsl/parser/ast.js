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


/**
 * Base class of all abstract syntax tree nodes
 */
function AstNode() {

	//public:
	this.location = {
		first_line : 0,
		first_column : 0,
		last_line : 0,
		last_column : 0
	};
}

AstNode.prototype = {};
var proto = AstNode.prototype;

//public:
proto.getLocation = function() {
	return this.location;
};

proto.setLocation = function(loc) {
	this.location.first_line = loc.first_line;
	this.location.first_column = loc.first_column;
	this.location.last_line = loc.last_line;
	this.location.last_column = loc.last_column;
};

proto.toString = function() {
	return this.constructor.name;
};

proto.ir = function() {debugger;};


//inverse of operators
var ast_operators = [
	"=",
	"POS",
	"NEG",
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
	"++x",
	"--x",
	"x++",
	"x--",
	".",
	"[]",
	"()",
	"ident",
	"float",
	"int",
	"bool"
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
function AstTypeSpecifier(specifier) {
	AstNode.apply(this);
	this.type_specifier = null;
	this.type_name = null;
	this.structure = null;
	this.is_array = 0;
	this.array_size = null;	
	this.precision = 2;
	this.is_precision_statement = null;

	if (AstTypeSpecifier[typeof specifier]) {
		AstTypeSpecifier[typeof specifier].call(this, specifier);
	}
}

proto = AstTypeSpecifier.prototype;
util.inherits(AstTypeSpecifier, AstNode);

//overloaded constructors
AstTypeSpecifier.number = function(specifier) {
	this.type_specifier = specifier;
	this.precision = ast_precision.none;
	this.is_precision_statement = false;
	this.type_name = types[specifier].name;
};

AstTypeSpecifier.string = function(name) {
	this.type_specifier = types[name];
	this.type_name = name;
	this.is_array = false;
	this.precision = ast_precision.none;
	this.is_precision_statement = false;
};

AstTypeSpecifier.object = function(s) {
	this.type_specifier = types.struct;
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
					this.type_specifier === types.struct ? this.structure : this.type_name,
					this.is_array ? util.format("[ %s] ", this.array_size || "") : ""
					);
};


/**
 * AST Function Class
 */
function AstFunction() {
	AstNode.apply(this);

	this.return_type = null;
	this.identifier = null;
	this.parameters = [];
	this.is_definition = false;
	this.signature = null;	
}

proto = AstFunction.prototype;
util.inherits(AstFunction, AstNode);

/**
 * toString
 *
 * @return  string
 */
AstFunction.toString = function() {
	return util.format("%s %s(%s)", this.return_type, this.identifier, this.parameters);			
};

/**
 * Representation of any sort of expression.
 */
function AstExpression(oper, ex0, ex1, ex2) {
	AstNode.apply(this);

	this.oper = oper;
	this.subexpressions = [null, null, null];
	this.primary_expression = {};
	this.expressions = [];

	if (ast_operators.indexOf(this.oper) === -1) {
		this.oper = 'ident';
		this.primary_expression.identifier = oper;
	} else {
		this.subexpressions[0] = ex0;
		this.subexpressions[1] = ex1;
		this.subexpressions[2] = ex2;
	}
}

proto = AstExpression.prototype;
util.inherits(AstExpression, AstNode);

//public:

/**
 * Makes number a float representation
 *
 * @param   string      The string representation of a number
 *
 * @return  string
 */
proto.makeFloat = function(n) {
	n += (n.toString().indexOf('.') === -1) ? ".0" : "";
	return n;
};


proto.toString = function() {
	switch (this.oper) {
		case '=':
		case '*=':
		case '/=':
		case '%=':
		case '+=':
		case '-=':
		case '<<=':
		case '>>=':
		case '&=':
		case '^=':
		case '|=':
			return util.format("(%s %s %s)", this.subexpressions[0], this.oper, this.subexpressions[1]);

		case '.':
			return util.format("(%s. %s)", this.subexpressions[0], this.primary_expression.identifier);

		case '+':
		case '-':
		case '~':
		case '++_':
		case '--_':
			return util.format("(%s %s)", this.oper, this.subexpressions[0]);
		
		case '_++':
		case '_--':
			return util.format("(%s %s)", this.subexpressions[0], this.oper);

		case '?:':
			return util.format("(%s ? %s : %s)", this.subexpressions[0], this.subexpressions[1], this.subexpressions[2]);				

		case '[]':
			return util.format("(%s [ %s ])", this.subexpressions[0], this.subexpressions[1]);				

		case '()':
			return util.format("(%s ( %s ))", this.subexpressions[0], this.expressions.join(", "));

		case 'ident':
			return util.format("%s", this.primary_expression.identifier);
		
		case 'int':
			return util.format("%s", this.primary_expression.int_constant);
		
		case 'float':
			return util.format("%s", this.primary_expression.float_constant);
		
		case 'bool':
			return util.format("%s", this.primary_expression.bool_constant ? 'true' : 'false');

		case ',':
			return util.format("(%s)", this.expressions.join(", "));
	}
};


var AstTypeQualifier = function() {
	//large union
	this.flags = {};
	this.location = null;
};

AstTypeQualifier.flags = {
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
function AstFullySpecifiedType() {
	AstNode.apply(this);
	
	this.qualifier = null;
	this.specifier = null;
}

proto = AstFullySpecifiedType.prototype;
util.inherits(AstFullySpecifiedType, AstNode);

/**
 * 
 */
proto.has_qualifiers = function() {
	return this.qualifier.flags.i !== 0;
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
function AstDeclaration(identifier, is_array, array_size, initializer) {
	AstNode.apply(this);

	this.identifier = identifier;
	this.is_array = is_array;
	this.array_size = array_size;
	this.initializer = initializer;
}

proto = AstDeclaration.prototype;
util.inherits(AstDeclaration, AstNode);

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
function AstDeclaratorList(type) {
	AstNode.apply(this);

	this.type = type;
	this.declarations = [];
	this.invariant = 0;
}

proto = AstDeclaratorList.prototype;
util.inherits(AstDeclaratorList, AstNode);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s %s;\n", this.type || "invariant ", this.declarations.join(""));
};


/**
 * AST Parameter Declarator Class
 */
function AstParameterDeclarator() {
	AstNode.apply(this);
	this.type = null;
	this.identifier = null;
	this.is_array = false;
	this.array_size = 0;
	this.formal_parameter = null;
	this.is_void = null;
}

proto = AstParameterDeclarator.prototype;
util.inherits(AstParameterDeclarator, AstNode);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s%s %s", this.type, this.identifier || "", this.is_array ? util.format("[%s]", this.array_size) : "");
};


/**
 * AST Expression Statement Class
 */
function AstExpressionStatement(ex) {
	AstNode.apply(this);

	this.expression = ex;
}

proto = AstExpression.prototype;
util.inherits(AstExpressionStatement, AstNode);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("%s;\n ", this.expression || "");
};


/**
 * AST Compound Statement Class
 */
function AstCompoundStatement(new_scope, statements) {
	AstNode.apply(this);
	this.new_scope = new_scope;
	if (statements) {
		this.statements = statements;
	} else {
		this.statements = [];
	}
}
 
proto = AstCompoundStatement.prototype;
util.inherits(AstCompoundStatement, AstNode);

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
function AstFunctionDefinition() {
	AstNode.apply(this);

	this.proto_type = null;
	this.body = null;
}

proto = AstFunctionDefinition.prototype;
util.inherits(AstFunctionDefinition, AstNode);

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
function AstExpressionBin(oper, ex0, ex1) {
	AstExpression.apply(this, [oper, ex0, ex1]);
}

proto = AstExpressionBin.prototype;
util.inherits(AstExpressionBin, AstExpression);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("(%s %s %s)", this.subexpressions[0], this.oper, this.subexpressions[1]);
};


/**
 * AST Function Expression Class
 */
function AstFunctionExpression(arg) {
	AstExpression.apply(this);
	this.cons = false;

	if (arg.constructor.name === 'AstExpression') {
		this.cons = false;
		AstExpression.call(this, '()', arg);
	} else if (arg.constructor.name === 'AstTypeSpecifier') {
		this.cons = true;
		AstExpression.call(this, '()', arg);
	}

}

proto = AstFunctionExpression.prototype;
util.inherits(AstFunctionExpression, AstExpression);

proto.is_constructor = function() {
	return this.cons;
};


/**
 * AST Selection Statement Class
 */
function AstSelectionStatement(condition, then_statement, else_statement) {
	AstNode.apply(this);
	this.condition = condition;
	this.then_statement = then_statement;
	this.else_statement = else_statement;
}

proto = AstSelectionStatement.prototype;
util.inherits(AstSelectionStatement, AstNode);

/**
 * toString
 *
 * @return  string
 */
proto.toString = function() {
	return util.format("if ( %s) %s %s", this.condition, this.then_statement, this.else_statement ? util.format("else %s", this.else_statement) : "");
};


/**
 * AST Struct Specifier Class
 */
function AstStructSpecifier(identifier, declarator_list) {
	AstNode.apply(this);
	this.name = null;
	this.declarations = [];

	if (identifier === null) {
		identifier = glsl.util.format("#anon_struct%d", AstStructSpecifier.anon_count);
		AstStructSpecifier.anon_count++;
	}
	this.name = identifier;
	this.declarations = declarator_list.declarations;
}

AstStructSpecifier.anon_count = 1;

proto = AstStructSpecifier.prototype;
util.inherits(AstStructSpecifier, AstNode);


