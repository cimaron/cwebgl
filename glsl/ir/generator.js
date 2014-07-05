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


/**
 * Constructs a program's object code from an ast and symbol table
 *
 * @param   string     The error message
 * @param   AstNode    The error AstNode
 *
 * @return  string
 */
glsl.generate = function(state) {

	var irs = new Ir();

	try {
		for (var i = 0; i < state.translation_unit.length; i++) {
			state.translation_unit[i].ir(state, irs);
		}

	} catch (e) {
		state.addError(e);
	}

	if (state.error) {
		return false;	
	}

	return irs;
};

/**
 * Constructs an error message
 *
 * @param   string     The error message
 * @param   AstNode    The error AstNode
 *
 * @return  string
 */
function ir_error(msg, n) {

	if (n && n.location) {
		msg = util.format("%s at line %s, column %s", msg, n.location.first_line, n.location.first_column);
	}

	throw new Error(msg);
}

/**
 * Default IR
 */
AstNode.prototype.irx = function(state, irs) {
	ir_error(util.format("Can't generate ir for %s", this.typeOf()), this);
};

/**
 * Constructs a type specifier code block
 *
 * @param   object   state    parser state
 */
AstTypeSpecifier.prototype.ir = function(state, irs) {

	if (this.is_precision_statement) {
		return;
	}

//	ir_error("Cannot generate type specifier", this);
};


/**
 * Constructs a declaration list
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
ast_declarator_list.prototype.ir = function(state, irs) {
	var type, qualifier, i, decl, name, entry, constant;

	type = this.type;
	if (type.qualifier) {
		qualifier = type.qualifier.flags;
	}

	for (i = 0; i < this.declarations.length; i++) {

		decl = this.declarations[i];
		name = decl.identifier;

		//add symbol table entry
		entry = state.symbols.add_variable(name);
		entry.type = type.specifier.type_specifier;
		entry.qualifier = qualifier;

		constant = (qualifier & ast_type_qualifier.flags.constant);

		if (decl.initializer) {
			debugger;
			//destination node is not created in parser, so need to create it here to keep things clean
			name = {
				Dest : name,
				Type : entry.type
			};

			//ir_expression(decl.initializer);

			//@todo: generate constants at compile time (this may be able to be taken care of in the generator)
			if (constant) {
				//entry.constant = decl.initializer.Dest;
			} else {
				//ir_expression_assign(decl, [name, decl.initializer], true);
			}

		} else {
			if (constant) {
				ir_error("Declaring const without initialier", decl);
			}
		}
	}
};


/**
 * Constructs a function definition block
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
ast_function_definition.prototype.ir = function(state, irs) {

	if (this.is_definition) {
		//enter definition into symbol table?
		return;
	}

	//handle function proto
	this.proto_type.ir(state, irs);

	//handle function body
	this.body.ir(state, irs);

	irs.push(new IrInstruction('RET'));
};


/**
 * Constructs a function header code block
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
ast_function.prototype.ir = function(state, irs) {
	var i, name, param, entry;

	//generate
	name = this.identifier;
	entry = state.symbols.get_function(name);

	//generate param list
	for (i = 0; i < this.parameters.length; i++) {
		param = this.parameters[i];
		if (param.is_void || !param.identifier) {
			break;
		}
	}
};


/**
 * Constructs a compound statement code block
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
ast_compound_statement.prototype.ir = function(state, irs) {
	var i;

	state.symbols.push_scope();

	for (i = 0; i < this.statements.length; i++) {
		this.statements[i].ir(state, irs);
	}

	state.symbols.pop_scope();
};


/**
 * Constructs an expression statement code block
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
AstExpressionStatement.prototype.ir = function(state, irs) {
	this.expression.ir(state, irs);
};




/**
 * Constructs an expression code block
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
AstExpression.prototype.ir = function(state, irs) {
	var i;

	//simple (variable, or value)
	for (i in this.primary_expression) {
		return this.ir_simple(state, irs);
	}

	//operator
	if (this.oper) {
		return this.ir_op(state, irs);
	}

	//cast
	if (this.constructor.name ==  'AstTypeSpecifier') {
		this.Type = this.type_specifier;
		return;
	}

	ir_error("Could not translate unknown expression type", e);
};



/**
 * Constructs an operator expression code block
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
AstExpression.prototype.ir_op = function(state, irs) {
	var se, temp, ops;
	
	debugger;
	if (se = this.subexpressions) {
		se[0] ? se[0].ir(state, irs) : null;
		se[1] ? se[1].ir(state, irs) : null;
		se[2] ? se[2].ir(state, irs) : null;
	}
	
	switch (this.oper) {

		//case '+=':
		case '=':
			this.ir_assign(state, irs);
			break;

		//case 'POS':
		case 'NEG':
			if (se[0].Dest[0] != '-') {
				e.Dest = "-" + se[0].Dest;	
			} else {
				e.Dest = se[0].Dest.substring(1);	
			}
			e.Type = se[0].Type;
			break;

		//binary expression
		case '+':
		case '-':
		case '*':
		case '/':
		case '%':
		case '<<':
		case '>>':
		case '<':
		case '>':
		case '<=':
		case '>=':
		case '==':
		case '!-':
		case '&':
		case '^':
		case '|':
		case '~':
		case '&&':
		case '^^':
		case '||':
			this.ir_generate(state, irs, 2);
			break;

		case '!':
			irs.push(new IrComment(util.format("(%s %s)", this.oper, se[0].Dest), this.location));
			this.ir_generate(state, irs, 1);
			break;

		/*
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
			break;
		case '?:':
			break;
		case '++_':
		case '--_':
			break;
		case '_++':
		case '_--':
			break;
		case '.':
			ir_expression_field(e, se);
			break;
		case '[]':
			break;
		*/
		case '()':
			if (this.cons) {
				this.ir_constructor(state, irs);
			} else {
				ir_expression_function(e);	
			}
			break;
		/*
		case 'VAR':
		case 'int':
		case 'float':
		case 'bool':
			ir_expression_simple(e, se);
			break;
		*/
		default:
			ir_error(util.format("Could not translate unknown expression %s (%s)", e.typeOf(), e.oper), e);
	}
};


/**
 * Constructs an assignment expression
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
AstExpression.prototype.ir_assign = function(state, irs, local) {
	var cond, ir, temp, size, slots, swz, i, entry, se;
	debugger;

	se = this.subexpressions;

	if (this.oper == '+=') {
		se[1].oper = '+';
		ir_expression_generate(se[1], [se[0], se[1]], 2);
	}

	/*
	if (conditional.length > 0) {
		cond = conditional[conditional.length - 1];	
	}
	*/

	if (se[0].Type != se[1].Type) {
		ir_error(util.format("Could not assign value of type %s to %s", glsl.type.names[se[1].Type], glsl.type.names[se[0].Type]), e);
	}
	this.Type = se[0].Type;

	entry = state.symbols.get_variable(se[0].Dest);
	if (entry.constant) {
		ir_error(util.format("Cannot assign value to constant %s", se[0].Dest), e);	
	}

	size = glsl.type.size[e.Type];
	slots = glsl.type.slots[e.Type];

	//get the swizzle for each slot
	swz = swizzles[0].substring(0, 4 - (((slots * 4) - size) / slots));

	//all components are used up in all slots
	if (swz == swizzles[0]) {
		swz = "";
	}

	for (i = 0; i < slots; i++) {

		if (cond && !local) {
			ir = new IR('CMP', se[0].Dest, "-"+cond, se[1].Dest, se[0].Dest);
			ir.addOffset(i);
			ir.setSwizzle(swz);
			irs.push(ir);

		} else {
			ir = new IR('MOV', se[0].Dest, se[1].Dest);
			ir.addOffset(i);
			ir.setSwizzle(swz);
			irs.push(ir);
		}
	}
};


/**
 * Constructs a simple expression code block
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
AstExpression.prototype.ir_simple = function(state, irs) {
	var name, entry, t;

	//identifier
	if (name = this.primary_expression.identifier) {

		//lookup identifier in symbol table
		entry = state.symbols.get_variable(name) || state.symbols.get_function(name);

		if (!entry || !entry.type) {
			ir_error(util.format("%s is undefined", name), this);
		}

		this.Type = entry.type.name;

		if (entry.constant) {
			this.Dest = entry.constant;
		} else {
			this.Dest = entry.name;
		}

		return;
	}

	//float constant
	if ('float_contsnt' in this.primary_expression) {
		this.Type = types.float;
		this.Dest = this.makeFloat(e.primary_expression.float_constant);
		return;
	}

	//int constant
	if ('int_constant' in this.primary_expression) {
		this.Type = types.int;
		this.Dest = this.makeFloat(e.primary_expression.int_constant);
		return;
	}

	ir_error("Cannot translate unknown simple expression type", e);
};

/**
 * Constructs the code for an expression
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
AstExpression.prototype.ir_generate = function(state, irs, len) {
	var table, se, types, dest, i, j, def, match, comment;

	if (!(table = builtin.oper[this.oper])) {
		ir_error(util.format("Could not generate operation %s", this.oper), this);
	}

	this.Dest = Ir.getTemp('$tempv');

	types = [];
	dest = [this.Dest];
	se = this.subexpressions;

	for (i = 0; i < len; i++) {
		types.push(se[i].Type);
		dest.push(se[i].Dest);
	}

	def = new RegExp(types.join(",") + "\:(.*)");
	for (j in table) {
		if (match = j.match(def)) {
			this.Type = match[1];
			break;
		}
	}

	if (!match) {
		ir_error(util.format("Could not apply operation %s to %s", e.oper, types.join(", ")), this);
	}

	if (len <= 4) {
		//this.Dest += util.format(".%s", swizzles[0].substring(0, glsl.type.size[this.Type]));
	}

	if (len == 1) {
		comment = util.format("(%s %s) => %s:%s", this.oper, se[1].Dest, this.Dest, this.Type);
	} else if (len == 2) {
		comment = util.format("(%s %s %s) => %s:%s", se[0].Dest, this.oper, se[1].Dest, this.Dest, this.Type);
	} else if (len == 3) {
		comment = util.format("(%s ? %s : %s) => %s:%s", se[0].Dest, se[1].Dest, se[2].Dest, this.Dest, this.Type);
	}

	irs.push(new IrComment(comment, this.location));

	irs.build(table[j], dest);
};



/**
 * Constructs a type constructor
 *
 * @param   object   state   GLSL state
 * @param   object   irs     IR representation
 */
AstFunctionExpression.prototype.ir_constructor = function(state, irs) {
	var type, dest_i, si, sei, ses, d, s, expr;

	type = this.subexpressions[0].type_specifier;

	si = 0;
	sei = 0;

	this.Type = type.name;
	this.Dest = irs.getTemp('$tempv');

	for (dest_i = 0; dest_i < type.size; dest_i++) {

		expr = this.expressions[sei];

		//build next subexpression
		if (si == 0) {

			if (!expr) {
				ir_error("Not enough parameters to constructor", e);				
			}
			
debugger;
			expr.ir(state, irs);
			ses = types[expr.Type].size;
		}

		//need to add support for > vec4

		//compute destination
		d = util.format("%s.%s", this.Dest, Ir.swizzles[0][dest_i]);

		//compute source
		s = Ir.splitOperand(expr.Dest);

		//expression was to just get the identifier, so add the appropriate swizzle,
		//else, either a number, or the correct swizzle already been set
		if (s[1]) {
			s = s.join(".");
		} else {
			//value
			if (s[0].match(/^\-?[0-9]+(\.[0-9]+)?/)) {
				s = s[0];	
			} else {
				s = util.format("%s.%s", s[0], Ir.swizzles[0][si]);
			}
		}

		irs.push(new IrInstruction('MOV', d, s));

		//used up all components in current expression, move on to the next one
		si++;
		if (si >= ses) {
			si = 0;
			sei++;
		}

	}
};

