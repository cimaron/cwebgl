/*
 * Classic example grammar, which recognizes simple arithmetic expressions like
 * "2*(3+4)". The parser generated from this grammar then computes their value.
 */

/*
start
  = additive

additive
  = left:multiplicative "+" right:additive { return left + right; }
  / multiplicative

multiplicative
  = left:primary "*" right:multiplicative { return left * right; }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
  
*/

{
	ast = glsl.ast;
}


start
	= translation_unit

translation_unit
	= version:version_statement ext:extension_statement_list decl:external_declaration_list {
		initialize_types(state);
		//state.symbols = new this.yy.symbol_table();
		//initialize_types(state);
		//return ??
	  }

version_statement
	= /* blank - no #version specified: defaults are already set */
	/ VERSION INTCONSTANT EOL { }


pragma_statement
	= PRAGMA_DEBUG_ON EOL { return null; }
	/*
	/ PRAGMA_DEBUG_OFF EOL { return null; }
	/ PRAGMA_OPTIMIZE_ON EOL { return null; }
	/ PRAGMA_OPTIMIZE_OFF EOL { return null; }
	/ PRAGMA_INVARIANT_ALL EOL { return null; }
	*/

/* Line: 287 */
extension_statement_list
	/* Empty Rule */
	= extension_statement extension_statement_list

/* Line: 292 */
any_identifier
	= IDENTIFIER
	/ TYPE_IDENTIFIER
	/ NEW_IDENTIFIER

/* Line: 298 */
extension_statement
	= EXTENSION any_identifier COLON any_identifier EOL { }

/* Line: 307 */
external_declaration_list
	= decl:external_declaration decl:external_declaration_list_right {
		if (decl != null) {
			state.translation_unit.push(decl);
		}
	  }

external_declaration_list_right
	=
	/ decl:external_declaration external_declaration_list_right { }

/* Line: 326 */
variable_identifier
	= IDENTIFIER
	/ NEW_IDENTIFIER

/* Line: 518 */
unary_expression
   /*
	= postfix_expression
	/ left:'++' right:unary_expression {
		return (new ast.expression(ast.operators.pre_inc, right))
			.setLocation(line(), column());
	}
   / DEC_OP unary_expression
   {
      void *ctx = state;
      $$ = new(ctx) ast_expression(ast_pre_dec, $2, NULL, NULL);
      $$->set_location(yylloc);
   }
   */
	= left:unary_operator right:unary_expression {
		var expr = new ast.expression(left, right);
		expr.setLocation(line(), column());
		return expr;
	}

/* Line: 541 */
unary_operator
	= '+' { return ast.operators.plus; }
	/ '-' { return ast.operators.neg; }
	/ '!' { return ast.operators.logic_not; }
	/ '~' { return ast.operators.bit_not; }

/* Line: 541 */
constant_expression
	= conditional_expression

/* Line: 548 */
/* Note: Rewrote left recursion logic */
multiplicative_expression
	= left:unary_expression expr:multiplicative_expression_right {
		var s = expr;
		while (s.subexpressions[0]) {
			s = s.subexpressions[0];	
		}
		s.subexpressions[0] = left;
		return expr;
	}

multiplicative_expression_right
	= 
	/ '*' right:unary_expression other:multiplicative_expression_right {
		var expr = new glsl.ast.expression_bin(glsl.ast.operators.mul, null, right);
		expr.setLocation(line(), column());
		if (other) {
			other.subexpressions[0] = expr;
			return other;
		}
		return expr;
	}
	/ '/' right:unary_expression other:multiplicative_expression_right {
		var expr = new glsl.ast.expression_bin(glsl.ast.operators.div, null, right);
		expr.setLocation(line(), column());
		if (other) {
			other.subexpressions[0] = expr;
			return other;
		}
		return expr;
	}
	/ '%' right:unary_expression other:multiplicative_expression_right  {
		var expr = new glsl.ast.expression_bin(glsl.ast.operators.mod, null, right);
		expr.setLocation(line(), column());
		if (other) {
			other.subexpressions[0] = expr;
			return other;
		}
		return expr;
	}

/* Line: 570 */
/* Note: Rewrote left recursion logic */
additive_expression
	= left:multiplicative_expression expr:additive_expression_right {
		var s = expr;
		while (s.subexpressions[0]) {
			s = s.subexpressions[0];	
		}
		s.subexpressions[0] = left;
		return expr;
	}

additive_expression_right
	= 
	/ '+' right:multiplicative_expression other:additive_expression_right {
		var expr = new glsl.ast.expression_bin(glsl.ast.operators.add, null, right);
		expr.setLocation(line(), column());
		if (other) {
			other.subexpressions[0] = expr;
			return other;
		}
		return expr;
	}
	/ '-' right:multiplicative_expression other:additive_expression_right {
		var expr = new glsl.ast.expression_bin(glsl.ast.operators.sub, null, right);
		expr.setLocation(line(), column());
		if (other) {
			other.subexpressions[0] = expr;
			return other;
		}
		return expr;
	}

/* Line: 586 */
/* Note: Rewrote left recursion logic */
shift_expression
	= additive_expression shift_expression_right { }

shift_expression_right
	=
	/ LEFT_OP additive_expression shift_expression_right { }
	/ RIGHT_OP additive_expression shift_expression_right { }

/* Line: 602 */
/* Note: Rewrote left recursion logic */
relational_expression
	= left:shift_expression expr:relational_expression_right {
		var s = expr;
		while (s.subexpressions[0]) {
			s = s.subexpressions[0];	
		}
		s.subexpressions[0] = left;
		return expr;
	}

relational_expression_right
	=
	/ '<' right:shift_expression other:relational_expression_right {
		var expr = new glsl.ast.expression_bin(glsl.ast.operators.less, null, right);
		expr.setLocation(line(), column());
		if (other) {
			other.subexpressions[0] = expr;
			return other;
		}
		return expr;
	}
	/ LE_OP right:shift_expression relational_expression_right { }
	/ GE_OP right:shift_expression relational_expression_right { }

/* Line: 630 */
/* Note: Rewrote left recursion logic */
equality_expression
	= relational_expression equality_expression_right { }

equality_expression_right
	=
	/ EQ_OP relational_expression equality_expression_right { }
	/ NE_OP relational_expression equality_expression_right { }

/* Line: 646 */
/* Note: Rewrote left recursion logic */
and_expression
	= equality_expression and_expression_right { }

and_expression_right
	=
	/ '&' equality_expression and_expression_right { }

/* Line: 656 */
/* Note: Rewrote left recursion logic */
exclusive_or_expression
	= and_expression exclusive_or_expression_right { }

exclusive_or_expression_right
	= 
	/ '^' and_expression exclusive_or_expression_right { }

/* Line: 666 */
/* Note: Rewrote left recursion logic */
inclusive_or_expression
	= exclusive_or_expression inclusive_or_expression_right { }

inclusive_or_expression_right
	=
	/ '|' exclusive_or_expression inclusive_or_expression_right { }

/* Line: 676 */
/* Note: Rewrote left recursion logic */
logical_and_expression
	= inclusive_or_expression logical_and_expression_right { }

logical_and_expression_right
	= 
	/ AND_OP inclusive_or_expression logical_and_expression_right { }

/* Line: 686 */
/* Note: Rewrote left recursion logic */
logical_xor_expression
	= logical_and_expression logical_xor_expression_right { }

logical_xor_expression_right
	= 
	/ XOR_OP logical_and_expression logical_xor_expression_right { }

/* Line: 696 */
/* Note: Rewrote left recursion logic */
logical_or_expression
	= logical_xor_expression logical_or_expression_right { }

logical_or_expression_right
	= 
	/ OR_OP logical_xor_expression logical_or_expression_right { }

/* Line: 706 */
conditional_expression
	= logical_or_expression
	/ logical_or_expression '?' expression ':' assignment_expression { }

/* Line: 716 */
assignment_expression
	= conditional_expression
	/ left:unary_expression op:assignment_operator right:assignment_expression {
		var expr = new glsl.ast.expression(op, left, right);
		expr.setLocation(line(), column());
		return expr;
	}

/* Line: 726 */
assignment_operator
	= '='           { return ast.operators.assign; }
	/ MUL_ASSIGN	{ return ast.operators.mul_assign; }
	/ DIV_ASSIGN	{ return ast.operators.div_assign; }
	/ MOD_ASSIGN	{ return ast.operators.mod_assign; }
	/ ADD_ASSIGN	{ return ast.operators.add_assign; }
	/ SUB_ASSIGN	{ return ast.operators.sub_assign; }
	/ LEFT_ASSIGN	{ return ast.operators.ls_assign; }
	/ RIGHT_ASSIGN	{ return ast.operators.rs_assign; }
	/ AND_ASSIGN	{ return ast.operators.and_assign; }
	/ XOR_ASSIGN	{ return ast.operators.xor_assign; }
	/ OR_ASSIGN	    { return ast.operators.or_assign; }

/* Line: 740 */
/* Note: Rewrote left recursion logic */
expression
	= assignment_expression expression_right { }

expression_right
	= 
	/ ',' assignment_expression expression_right { }

/* Line: 764 */
declaration
	= function_prototype ';' { }
	/ list:init_declarator_list ';' {
		return list;
	}
	/ PRECISION qual:precision_qualifier spec:type_specifier_no_prec ';' {
		spec.type_specifier.precision = qual;
		spec.type_specifier.is_precision_statement = true;
		return spec;
	}

/* Line: 782 */
function_prototype
	= function_declarator ')'

/* Line: 786 */
function_declarator
	= function_header
	/ function_header_with_parameters

/* Line: 791 */
function_header_with_parameters
	= func:function_header decl:parameter_declaration {
		func.parameters.push(decl);
		return func;
	}
	/ function_header_with_parameters_right

function_header_with_parameters_right
	= 
	/ ',' decl:parameter_declaration function_header_with_parameters_right { }

/* Line: 804 */
function_header
	= type:fully_specified_type ident:variable_identifier '(' {
		var func = new glsl.ast['function']();
		func.setLocation(line(), column());
		func.return_type = type;
		func.identifier = ident;
		state.symbols.add_function(ident);
		state.symbols.push_scope();
		return func;
	}

/* Line: 818 */
parameter_declarator
	= spec:type_specifier ident:any_identifier { }
	/ spec:type_specifier ident:any_identifier '[' expr:constant_expression ']' { }

/* Line: 843 */
parameter_declaration
	= type:parameter_type_qualifier qual:parameter_qualifier decl:parameter_declarator { }
	/ qual:parameter_qualifier decl:parameter_declarator { }
	/ type:parameter_type_qualifier qual:parameter_qualifier spec:parameter_type_specifier { }
	/ qual:parameter_qualifier spec:parameter_type_specifier {
		var pd = new glsl.ast.parameter_declarator();
		pd.setLocation(line(), column());
		pd.type = new glsl.ast.fully_specified_type();
		pd.type.qualifier = qual;
		pd.type.specifier = spec;
		return pd;
	}

/* Line: 878 */
parameter_qualifier
	= {
		console.log('Figure this out');
		//yyval.type_qualifier = new glsl.ast.type_qualifier();
	}
	/ IN_TOK { }
	/ OUT_TOK { }
	/ INOUT_TOK { }

/* Line: 901 */
parameter_type_specifier
	= type_specifier

/* Line: 905 */
/* Note: Rewrote left recursion logic */
init_declarator_list
	= single_declaration init_declarator_list_right { }

init_declarator_list_right
	= 
	/ ',' any_identifier init_declarator_list_right { }
	/ ',' any_identifier '[' ']' init_declarator_list_right { }
	/ ',' any_identifier '[' constant_expression ']' init_declarator_list_right { }
	/ ',' any_identifier '[' ']' '=' initializer init_declarator_list_right { }
	/ ',' any_identifier '[' constant_expression ']' '=' initializer init_declarator_list_right { }
	/ ',' any_identifier '=' initializer init_declarator_list_right { }

/* Line: 969 */
single_declaration
	= type:fully_specified_type {
		if (type.specifier.type_specifier != glsl.type.struct) {
			expected("empty declaration list");
		} else {
			var dl = new glsl.ast.declarator_list(type);
			dl.setLocation(line(), column());
			return dl;
		}
	}
	/ type:fully_specified_type ident:any_identifier {
		var decl = new glsl.ast.declaration(ident, false);
		var dl = new glsl.ast.declarator_list(type);
		dl.setLocation(line(), column());
		dl.declarations.push(decl);
		return dl;
	}
	/ type:fully_specified_type ident:any_identifier '[' ']' {
		var decl = new glsl.ast.declaration(ident, true);
		var dl = new glsl.ast.declarator_list(type);
		dl.setLocation(line(), column());
		dl.declarations.push(decl);
		return dl;
	}
	/ type:fully_specified_type ident:any_identifier '[' expr:constant_expression ']' {
		var decl = new glsl.ast.declaration(ident, true, expr);
		var dl = new glsl.ast.declarator_list(type);
		dl.setLocation(line(), column());
		dl.declarations.push(decl);
		return dl;
	}
	/ fully_specified_type any_identifier '[' ']' '=' initializer { }
	/ fully_specified_type any_identifier '[' constant_expression ']' '=' initializer { }
	/ type:fully_specified_type ident:any_identifier '=' init:initializer {
		var decl = new glsl.ast.declaration(ident, false, null, expr);
		var dl = new glsl.ast.declarator_list(type);
		dl.setLocation(line(), column());
		dl.declarations.push(decl);
		return dl;
	}
	/ INVARIANT variable_identifier { }

/* Line: 1049 */
fully_specified_type
	= spec:type_specifier {
		var fst = new glsl.ast.fully_specified_type();
		fst.setLocation(line(), column());
		fst.specifier = spec;
		return fst;
	}
	/ qual:type_qualifier spec:type_specifier {
		var fst = new glsl.ast.fully_specified_type();
		fst.setLocation(line(), column());
		fst.qualifier = qual;
		fst.specifier = spec;
		return fst;
	}

/* Line: 1067 */
layout_qualifier
	= LAYOUT_TOK '(' list:layout_qualifier_id_list ')' {
		return list;
	}

/* Line: 1074 */
/* Note: Rewrote left recursion logic */
layout_qualifier_id_list
	= layout_qualifier_id layout_qualifier_id_list_right { }

layout_qualifier_id_list_right
	= 
	/ ',' layout_qualifier_id layout_qualifier_id_list_right { }

/* Line: 1094 */
layout_qualifier_id
	= any_identifier { }
	/ any_identifier '=' INTCONSTANT { }

/* Line: 1164 */
interpolation_qualifier
	= SMOOTH { }
	/ FLAT { }
	/ NOPERSPECTIVE { }

/* Line: 1182 */
parameter_type_qualifier
	= CONST_TOK { }

/* Line: 1190 */
type_qualifier
	= storage_qualifier
	/ layout_qualifier
	/ layout_qualifier storage_qualifier { }
	/ interpolation_qualifier
	/ interpolation_qualifier storage_qualifier { }
	/ INVARIANT storage_qualifier { }
	/ INVARIANT interpolation_qualifier storage_qualifier { }
	/ INVARIANT { }

/* Line: 1222 */
storage_qualifier
	= CONST_TOK {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags.constant;
		return tq;
	}
	/ ATTRIBUTE {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags.attribute;
		return tq;
	}
	/ VARYING {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags.varying;
		return tq;
	}
	/ CENTROID VARYING {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags.centroid;
		tq.flags.q |= glsl.ast.type_qualifier.flags.varying;
		return tq;
	}
	/ IN_TOK {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags['in'];
		return tq;
	}
	/ OUT_TOK {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags.out;
		return tq;
	}
	/ CENTROID IN_TOK {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags.centroid;
		tq.flags.q |= glsl.ast.type_qualifier.flags['in'];
		return tq;
	}
	/ CENTROID OUT_TOK {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags.centroid;
		tq.flags.q |= glsl.ast.type_qualifier.flags.out;
		return tq;
	}
	/ UNIFORM {
		var tq = new glsl.ast.type_qualifier();
		tq.flags.q |= glsl.ast.type_qualifier.flags.uniform;
		return tq;
	}

/* Line: 1271 */
type_specifier
	= spec:type_specifier_no_prec {
		return spec;
	}
	/ qual:precision_qualifier spec:type_specifier_no_prec {
		spec.precision = qual;
	}

/* Line: 1283 */
type_specifier_no_prec
	= type_specifier_nonarray
	/ type_specifier_nonarray '[' ']' { }
	/ type_specifier_nonarray '[' constant_expression ']' { }

/* Line: 1299 */
type_specifier_nonarray
	= spec:basic_type_specifier_nonarray {
		var ts = new glsl.ast.type_specifier(spec);
		ts.setLocation(line(), column());
		return ts;
	}
	/ spec:struct_specifier {
		var ts = new glsl.ast.type_specifier(spec);
		ts.setLocation(line(), column());
		return ts;
	}
	/ ident:TYPE_IDENTIFIER {
		var ts = new glsl.ast.type_specifier(ident);
		ts.setLocation(line(), column());
		return ts;
	}

/* Line: 1374 */
basic_type_specifier_nonarray
	= VOID_TOK		{ return glsl.type['void']; }
	/ FLOAT_TOK		{ return glsl.type.float; }
	/ INT_TOK		{ return glsl.type.int; }
	/ UINT_TOK		{ return glsl.type.uint; }
	/ BOOL_TOK		{ return glsl.type.bool; }
	/ VEC2			{ return glsl.type.vec2; }
	/ VEC3			{ return glsl.type.vec3; }
	/ VEC4			{ return glsl.type.vec4; }
	/ BVEC2			{ return glsl.type.bvec2; }
	/ BVEC3			{ return glsl.type.bvec3; }
	/ BVEC4			{ return glsl.type.bvec4; }
	/ IVEC2			{ return glsl.type.ivec2; }
	/ IVEC3			{ return glsl.type.ivec3; }
	/ IVEC4			{ return glsl.type.ivec4; }
	/ UVEC2			{ return glsl.type.uvec2; }
	/ UVEC3			{ return glsl.type.uvec3; }
	/ UVEC4			{ return glsl.type.uvec4; }
	/ MAT2X2		{ return glsl.type.mat2; }
	/ MAT2X3		{ return glsl.type.mat2x3; }
	/ MAT2X4		{ return glsl.type.mat2x4; }
	/ MAT3X2		{ return glsl.type.mat3x2; }
	/ MAT3X3		{ return glsl.type.mat3; }
	/ MAT3X4		{ return glsl.type.mat3x4; }
	/ MAT4X2		{ return glsl.type.mat4x2; }
	/ MAT4X3		{ return glsl.type.mat4x3; }
	/ MAT4X4		{ return glsl.type.mat4; }
	/ SAMPLER1D		{ return glsl.type.sampler1d; }
	/ SAMPLER2D		{ return glsl.type.sampler2d; }
	/ SAMPLER2DRECT		{ return glsl.type.sampler2drect; }
	/ SAMPLER3D		{ return glsl.type.sampler3d; }
	/ SAMPLERCUBE		{ return glsl.type.samplercube; }
	/ SAMPLER1DSHADOW	{ return glsl.type.sampler1dshadow; }
	/ SAMPLER2DSHADOW	{ return glsl.type.sampler2dshadow; }
	/ SAMPLER2DRECTSHADOW	{ return glsl.type.sampler2drectshadow; }
	/ SAMPLERCUBESHADOW	{ return glsl.type.samplercubeshadow; }
	/ SAMPLER1DARRAY	{ return glsl.type.sampler1darray; }
	/ SAMPLER2DARRAY	{ return glsl.type.sampler2darray; }
	/ SAMPLER1DARRAYSHADOW	{ return glsl.type.sampler1darrayshadow; }
	/ SAMPLER2DARRAYSHADOW	{ return glsl.type.sampler2darrayshadow; }
	/ ISAMPLER1D		{ return glsl.type.isampler1d; }
	/ ISAMPLER2D		{ return glsl.type.isampler2d; }
	/ ISAMPLER3D		{ return glsl.type.isampler3d; }
	/ ISAMPLERCUBE		{ return glsl.type.isamplercube; }
	/ ISAMPLER1DARRAY	{ return glsl.type.isampler1darray; }
	/ ISAMPLER2DARRAY	{ return glsl.type.isampler2darray; }
	/ USAMPLER1D		{ return glsl.type.usampler1d; }
	/ USAMPLER2D		{ return glsl.type.usampler2d; }
	/ USAMPLER3D		{ return glsl.type.usampler3d; }
	/ USAMPLERCUBE		{ return glsl.type.usamplercube; }
	/ USAMPLER1DARRAY	{ return glsl.type.usampler1darray; }
	/ USAMPLER2DARRAY	{ return glsl.type.usampler2darray; }

/* Line: 1374 */
precision_qualifier
	= HIGHP {
		/*if (!state.es_shader && state.language_version < 130) {
			yyerror(yylsa[yylsp], state, "precision qualifier forbidden in %s (1.30 or later required)\n", state.version_string);
		}*/
		return glsl.ast.precision.high;
	}
	/ MEDIUMP {
		/*if (!state.es_shader && state.language_version < 130) {
			yyerror(yylsa[yylsp], state, "precision qualifier forbidden in %s (1.30 or later required)\n", state.version_string);
		}*/
		return glsl.ast.precision.medium;
	}
	/ LOWP {
		/*if (!state.es_shader && state.language_version < 130) {
			yyerror(yylsa[yylsp], state, "precision qualifier forbidden in %s (1.30 or later required)\n", state.version_string);
		}*/
		return glsl.ast.precision.low;
	}

/* Line: 1407 */
struct_specifier
	= STRUCT ident:any_identifier '{' list:struct_declaration_list '}' {
		var ss = new glsl.ast.struct_specifier(ident, list);
		ss.setLocation(line(), column());
		state.symbols.add_type(ident, glsl.type.void_type);
		return ss;
	}
	/ STRUCT '{' struct_declaration_list '}' { }

/* Line: 1423 */
/* Note: Rewrote left recursion logic */
struct_declaration_list
	= 
	/ decl:struct_declaration list:struct_declaration_list {
		if (list) {
			list.declarations.concat(decl.declarations);
			return list;
		}
		return decl;
	}


/* Line: 1436 */
struct_declaration
	= spec:type_specifier list:struct_declarator_list ';' {
		var type = new glsl.ast.fully_specified_type();
		type.setLocation(line(), column());
		type.specifier = spec;
		var dl = new glsl.ast.declarator_list(type);
		dl.setLocation(line(), column());
		dl.declarations.unshift(list);
		return dl;
	}

/* Line: 1451 */
/* Note: Rewrote left recursion logic */
struct_declarator_list
	= struct_declarator struct_declarator_list_right { }

struct_declarator_list_right
	= 
	/ ',' struct_declarator struct_declarator_list_right { }

/* Line: 1464 */
struct_declarator
	= ident:any_identifier {
		var dl = new glsl.ast.declaration(ident, false);
		dl.setLocation(line(), column());
		state.symbols.add_variable(ident);
		return dl;
	}
	/ any_identifier '[' constant_expression ']' { }		

/* Line: 1480 */
initializer
	= assignment_expression

/* Line: 1484 */
declaration_statement
	= declaration

/* Line: 1490 */
statement
	= compound_statement
	/ simple_statement

/* Line: 1495 */
simple_statement
	= declaration_statement
	/ expression_statement
	/ selection_statement
	/ switch_statement {
		return null;
	}
	/ case_label {
		return null;
	}
	/ iteration_statement
	/ jump_statement

/* Line: 1505 */
compound_statement
	= '{' '}' { }
	/ '{' {
		state.symbols.push_scope();
	}
	/ list:statement_list '}' {
		var cs = new glsl.ast.compound_statement(true, list);
		cs.setLocation(line(), column());
		state.symbols.pop_scope();
		return cs;
	}

/* Line: 1525 */
statement_no_new_scope
	= compound_statement_no_new_scope { }
	/ simple_statement

/* Line: 1530 */
compound_statement_no_new_scope
	= '{' '}' { }
	/ '{' list:statement_list '}' {
		var cs = new glsl.ast.compound_statement(false, list);
		cs.setLocation(line(), column());
		return cs;
	}

/* Line: 1545 */
/* Note: Rewrote left recursion logic */
statement_list
	= 
	/* / stmt:statement list:statement_list {		
		
		if (stmt == null) {
			expected("<nil> statement");
		}
		
		if (!list) {
			list = [];	
		}
		
		list.unshift(stmt);
		return list;
	}*/

/* Line: 1567 */
expression_statement
	= ';' { }
	/ expr:expression ';' {
		var n = new glsl.ast.expression_statement(expr);
		n.setLocation(line(), column());
		return n;
	}

/* Line: 1582 */
selection_statement
	= IF '(' expr:expression ')' stmt:selection_rest_statement {
		var node = new glsl.ast.selection_statement(expr, stmt.then_statement, stmt.else_statement);
		node.setLocation(line(), column());
	}

/* Line: 1591 */
selection_rest_statement
	= then_stmt:statement ELSE else_stmt:statement {
		var sr = {
			then_statement : then_stmt,
			else_statement : else_stmt
		};
		return sr;
	}
	/ stmt:statement {
		var sr = {
			then_statement : stmt,
			else_statement : null
		};
		return sr;
	}

/* Line: 1604 */
condition
	= expression { }
	/ fully_specified_type any_identifier '=' initializer { }

/* Line: 1622 */
switch_statement
	= SWITCH '(' expression ')' compound_statement

/* Line: 1626 */
case_label
	= CASE expression ':'
	/ DEFAULT ':'

/* Line: 1631 */
iteration_statement
	= WHILE '(' condition ')' statement_no_new_scope { }
	/ DO statement WHILE '(' expression ')' ';' { }
	/ FOR '(' for_init_statement for_rest_statement ')' statement_no_new_scope { }

/* Line: 1655 */
for_init_statement
	= expression_statement
	/ declaration_statement

/* Line: 1660 */
conditionopt
	= condition
	/*/ { return null; }*/

/* Line: 1668 */
for_rest_statement
	= conditionopt ';' { }
	/ conditionopt ';' expression { }

/* Line: 1682 */
jump_statement
	= CONTINUE ';' { }
	/ BREAK ';' { }
	/ RETURN ';' { }
	/ RETURN expression ';' { }
	/ DISCARD ';' { }

/* Line: 1715 */
external_declaration
	= function_definition
	/*/ declaration*/
	/ pragma_statement { return null; }

/* Line: 1721 */
function_definition
	= proto:function_prototype stmt:compound_statement_no_new_scope {
		var fd = new glsl.ast.function_definition();
		fd.setLocation(line(), column());
		fd.proto_type = proto;
		fd.body = stmt;
		state.symbols.pop_scope();
		return fd;
	}


/* Tokens */
SPC       = [ \t]*
SPCP      = [ \t]+

IDENTIFIER      = [_a-zA-Z][_a-zA-Z0-9]*
TYPE_IDENTIFIER
	= name:IDENTIFIER &{
		if (state.symbols.get_variable(name) || state.symbols.get_function(name)) {
			return false;
		} else if (state.symbols.get_type(name)) {
			return true;	
		} else {
			return false;	
		}
	}
NEW_IDENTIFIER
	= name:IDENTIFIER &{
		if (state.symbols.get_variable(name) || state.symbols.get_function(name)) {
			return false;
		} else if (state.symbols.get_type(name)) {
			return false;	
		} else {
			return true;	
		}
	}
EXTENSION       = [ \t]*"#"[ \t]*"extension"
INTCONSTANT     = [1-9][0-9]*
EOL             = "\n"
VERSION         = [ \t]*'#'[ \t]*
COLON           = ":"
PRAGMA_DEBUG_ON = SPC "#" SPC "pragma" SPCP "debug" SPC "(" SPC "on" SPC ")"

LE_OP        = "<="
GE_OP        = ">="
EQ_OP        = "=="
NE_OP        = "!="
AND_OP       = "&&"
OR_OP        = "||"
XOR_OP       = "^^"
LEFT_OP      = "<<"
RIGHT_OP     = ">>"
MUL_ASSIGN   = "*="
DIV_ASSIGN   = "/="
ADD_ASSIGN   = "+="
MOD_ASSIGN   = "%="
LEFT_ASSIGN  = "<<="
RIGHT_ASSIGN = "??="
AND_ASSIGN   = "&="
XOR_ASSIGN   = "^="
OR_ASSIGN    = "|="
SUB_ASSIGN   = "-="

/* Keywords */
ATTRIBUTE = "attribute"
CONST_TOK = "const"
BOOL_TOK  = "bool"
FLOAT_TOK = "float"
INT_TOK   = "int"
UINT_TOK  = "uint"

BREAK    = "break"
CONTINUE = "continue"
DO       = "do"
WHILE    = "while"
ELSE     = "else"
FOR      = "for"
IF       = "if"
DISCARD  = "discard"
RETURN   = "return"

BVEC2 = "bvec2"
BVEC3 = "bvec3"
BVEC4 = "bvec4"
IVEC2 = "ivec2"
IVEC3 = "ivec3"
IVEC4 = "ivec4"
UVEC2 = "uvec2"
UVEC3 = "uvec3"
UVEC4 = "uvec4"
VEC2  = "vec2"
VEC3  = "vec3"
VEC4  = "vec4"
MAT2X2 = "mat2"
MAT3X3 = "mat3"
MAT4X4 = "mat4"
MAT2X2 = "mat2x2"
MAT2X3 = "mat2x3"
MAT2X4 = "mat2x4"
MAT3X2 = "mat3x2"
MAT3X3 = "mat3x3"
MAT3X4 = "mat3x4"
MAT4X2 = "mat4x2"
MAT4X3 = "mat4x3"
MAT4X4 = "mat4x4"

IN_TOK = "in"
OUT_TOK = "out"
INOUT_TOK = "inout"
UNIFORM = "uniform"
VARYING = "varying"
CENTROID = "centroid"
INVARIANT = "invariant"
FLAT = "flat"
SMOOTH = "smooth"
NOPERSPECTIVE = "noperspective"

SAMPLER1D = "sampler1D"
SAMPLER2D = "sampler2D"
SAMPLER3D = "sampler3D"
SAMPLERCUBE = "samplerCube"
SAMPLER1DARRAY = "sampler1DArray"
SAMPLER2DARRAY = "sampler2DArray"
SAMPLER1DSHADOW = "sampler1DShadow"
SAMPLER2DSHADOW = "sampler2DShadow"
SAMPLERCUBESHADOW = "samplerCubeShadow"
SAMPLER1DARRAYSHADOW = "sampler1DArrayShadow"
SAMPLER2DARRAYSHADOW = "sampler2DArrayShadow"
ISAMPLER1D = "isampler1D"
ISAMPLER2D = "isampler2D"
ISAMPLER3D = "isampler3D"
ISAMPLERCUBE = "isamplerCube"
ISAMPLER1DARRAY = "isampler1DArray"
ISAMPLER2DARRAY = "isampler2DArray"
USAMPLER1D = "usampler1D"
USAMPLER2D = "usampler2D"
USAMPLER3D = "usampler3D"
USAMPLERCUBE = "usamplerCube"
USAMPLER1DARRAY = "usampler1DArray"
USAMPLER2DARRAY = "usampler2DArray"

STRUCT = 'struct'
VOID_TOK = 'void';

LAYOUT_TOK = "layout"

    /* Reserved words in GLSL 1.10. */
ASM = "asm"
CLASS = "class"
UNION = "union"
ENUM = "enum"
TYPEDEF = "typedef"
TEMPLATE = "template"
THIS = "this"
PACKED_TOK = "packed"
GOTO = "goto"
SWITCH = "switch"
DEFAULT = "default"
INLINE_TOK = "inline"
NOINLINE = "noinline"
VOLATILE = "volatile"
PUBLIC_TOK = "public"
STATIC = "static"
EXTERN = "extern"
EXTERNAL = "external"
INTERFACE = "interface"
LONG_TOK = "long"
SHORT_TOK = "short"
DOUBLE_TOK = "double"
HALF = "half"
FIXED_TOK = "fixed"
UNSIGNED = "unsigned"
INPUT_TOK = "input"
OUTPUT = "output"
HVEC2 = "hvec2"
HVEC3 = "hvec3"
HVEC4 = "hvec4"
DVEC2 = "dvec2"
DVEC3 = "dvec3"
DVEC4 = "dvec4"
FVEC2 = "fvec2"
FVEC3 = "fvec3"
FVEC4 = "fvec4"
SAMPLER2DRECT = "sampler2DRect"
SAMPLER3DRECT = "sampler3DRect"
SAMPLER2DRECTSHADOW = "sampler2DRectShadow"
SIZEOF = "sizeof"
CAST = "cast"
NAMESPACE = "namespace"
USING = "using"

    /* Additional reserved words in GLSL 1.20. */
LOWP = "lowp"
MEDIUMP = "mediump"
HIGHP = "highp"
PRECISION = "precision"

    /* Additional reserved words in GLSL 1.30. */
CASE = "case"
COMMON = "common"
PARTITION = "partition"
ACTIVE = "active"
SUPERP = "superp"
SAMPLERBUFFER = "samplerBuffer"
FILTER = "filter"
IMAGE1D = "image1D"
IMAGE2D = "image2D"
IMAGE3D = "image3D"
IMAGECUBE = "imageCube"
IIMAGE1D = "iimage1D"
IIMAGE2D = "iimage2D"
IIMAGE3D = "iimage3D"
IIMAGECUBE = "iimageCube"
UIMAGE1D = "uimage1D"
UIMAGE2D = "uimage2D"
UIMAGE3D = "uimage3D"
UIMAGECUBE = "uimageCube"
IMAGE1DARRAY = "image1DArray"
IMAGE2DARRAY = "image2DArray"
IIMAGE1DARRAY = "iimage1DArray"
IIMAGE2DARRAY = "iimage2DArray"
UIMAGE1DARRAY = "uimage1DArray"
UIMAGE2DARRAY = "uimage2DArray"
IMAGE1DSHADOW = "image1DShadow"
IMAGE2DSHADOW = "image2DShadow"
IMAGE1DARRAYSHADOW = "image1DArrayShadow"
IMAGE2DARRAYSHADOW = "image2DArrayShadow"
IMAGEBUFFER = "imageBuffer"
IIMAGEBUFFER = "iimageBuffer"
UIMAGEBUFFER = "uimageBuffer"
ROW_MAJOR = "row_major"
