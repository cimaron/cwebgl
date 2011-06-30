
/* description: Parses end executes mathematical expressions. */

/*note that [lL]?[fF] is incorrect, but we keep getting parse errors if using an OR expression*/
/*Need to debug this huge regex which should match the spec, but for now, a simplified version will have to suffice*/
/*floating-constant	(([0-9]+\.|([0-9]+)?\.[0-9]+)([eE][\-\+][0-9]+)?([lL]?[fF])?|[0-9]+[eE][\-\+][0-9]+([lL]?[fF])?)*/

/* lexical grammar */
%lex

integer-constant	([1-9][0-9]*|0[0-7]*|0[xX][0-9a-fA-F]+)[uU]
floating-constant	[0-9].[0-9]+
identifier			[a-zA-Z_][a-zA-Z0-9_]*


%%

\s+                   /* skip whitespace */

'attribute'					return 'ATTRIBUTE'
'const'						return 'CONST'
'bool'						return 'BOOL'
'float'						return 'FLOAT'
'double'					return 'DOUBLE'
'int'						return 'INT'
'uint'						return 'UINT'
'break'						return 'BREAK'
'continue'					return 'CONTINUE'
'do'						return 'DO'
'else'						return 'ELSE'
'for'						return 'FOR'
'if'						return 'IF'
'discard'					return 'DISCARD'
'return'					return 'RETURN'
'switch'					return 'SWITCH'
'case'						return 'CASE'
'default'					return 'DEFAULT'
'subroutine'				return 'SUBROUTINE'
'bvec2'						return 'BVEC2'
'bvec3'						return 'BVEC3'
'bvec4'						return 'BVEC4'
'ivec2'						return 'IVEC2'
'ivec3'						return 'IVEC3'
'ivec4'						return 'IVEC4'
'uvec2'						return 'UVEC2'
'uvec3'						return 'UVEC3'
'uvec4'						return 'UVEC4'
'vec2'						return 'VEC2'
'vec3'						return 'VEC3'
'vec4'						return 'VEC4'
'mat2'						return 'MAT2'
'mat3'						return 'MAT3'
'mat4'						return 'MAT4'
'centroid'					return 'CENTROID'
'in'						return 'IN'
'out'						return 'OUT'
'inout'						return 'INOUT'
'uniform'					return 'UNIFORM'
'varying'					return 'VARYING'
'patch'						return 'PATCH'
'sample'					return 'SAMPLE'
'dvec2'						return 'DVEC2'
'dvec3'						return 'DVEC3'
'dvec4'						return 'DVEC4'
'dmat2'						return 'DMAT2'
'dmat3'						return 'DMAT3'
'dmat4'						return 'DMAT4'
'noperspective'				return 'NOPERSPECTIVE'
'flat'						return 'FLAT'
'smooth'					return 'SMOOTH'
'layout'					return 'LAYOUT'
'mat2x2'					return 'MAT2X2'
'mat2x3'					return 'MAT2X3'
'mat2x4'					return 'MAT2X4'
'mat3x2'					return 'MAT3X2'
'mat3x3'					return 'MAT3X3'
'mat3x4'					return 'MAT3X4'
'mat4x2'					return 'MAT4X2'
'mat4x3'					return 'MAT4X3'
'mat4x4'					return 'MAT4X4'
'dmat2x2'					return 'DMAT2X2'
'dmat2x3'					return 'DMAT2X3'
'dmat2x4'					return 'DMAT2X4'
'dmat3x2'					return 'DMAT3X2'
'dmat3x3'					return 'DMAT3X3'
'dmat3x4'					return 'DMAT3X4'
'dmat4x2'					return 'DMAT4X2'
'dmat4x3'					return 'DMAT4X3'
'dmat4x4'					return 'DMAT4X4'
'sampler1d'					return 'SAMPLER1D'
'sampler2d'					return 'SAMPLER2D'
'sampler3d'					return 'SAMPLER3D'
'samplercube'				return 'SAMPLERCUBE'
'sampler1dshadow'			return 'SAMPLER1DSHADOW'
'sampler2dshadow'			return 'SAMPLER2DSHADOW'
'samplercubeshadow'			return 'SAMPLERCUBESHADOW'
'sampler1darray'			return 'SAMPLER1DARRAY'
'sampler2darray'			return 'SAMPLER2DARRAY'
'sampler1darrayshadow'		return 'SAMPLER1DARRAYSHADOW'
'sampler2darrayshadow'		return 'SAMPLER2DARRAYSHADOW'
'isampler1d'				return 'ISAMPLER1D'
'isampler2d'				return 'ISAMPLER2D'
'isampler3d'				return 'ISAMPLER3D'
'isamplercube'				return 'ISAMPLERCUBE'
'isampler1darray'			return 'ISAMPLER1DARRAY'
'isampler2darray'			return 'ISAMPLER2DARRAY'
'usampler1d'				return 'USAMPLER1D'
'usampler2d'				return 'USAMPLER2D'
'usampler3d'				return 'USAMPLER3D'
'usamplercube'				return 'USAMPLERCUBE'
'usampler1darray'			return 'USAMPLER1DARRAY'
'usampler2darray'			return 'USAMPLER2DARRAY'
'sampler2drect'				return 'SAMPLER2DRECT'
'sampler2drectshadow'		return 'SAMPLER2DRECTSHADOW'
'isampler2drect'			return 'ISAMPLER2DRECT'
'usampler2drect'			return 'USAMPLER2DRECT'
'samplerbuffer'				return 'SAMPLERBUFFER'
'isamplerbuffer'			return 'ISAMPLERBUFFER'
'usamplerbuffer'			return 'USAMPLERBUFFER'
'samplercubearray'			return 'SAMPLERCUBEARRAY'
'samplercubearrayshadow'	return 'SAMPLERCUBEARRAYSHADOW'
'isamplercubearray'			return 'ISAMPLERCUBEARRAY'
'usamplercubearray'			return 'USAMPLERCUBEARRAY'
'sampler2dms'				return 'SAMPLER2DMS'
'isampler2dms'				return 'ISAMPLER2DMS'
'usampler2dms'				return 'USAMPLER2DMS'
'sampler2dmsarray'			return 'SAMPLER2DMSArray'
'isampler2dmsarray'			return 'ISAMPLER2DMSArray'
'usampler2dmsarray'			return 'USAMPLER2DMSArray'
'struct'					return 'STRUCT'
'void'						return 'VOID'
'while'						return 'WHILE'
'type_name'					return 'TYPE_NAME'
'field_selection'			return 'FIELD_SELECTION'
'invariant'					return 'INVARIANT'
'highp'						return 'HIGH_PRECISION'
'mediump'					return 'MEDIUM_PRECISION'
'lowp'						return 'LOW_PRECISION'
'precision'					return 'PRECISION'

{identifier}				return 'IDENTIFIER'
{floating-constant}			return 'FLOATCONSTANT'
{integer-constant}			return 'INTCONSTANT'
'uintconstant'				return 'UINTCONSTANT'
'boolconstant'				return 'BOOLCONSTANT'

'<<'						return 'LEFT_OP'
'>>'						return 'RIGHT_OP'
'++'						return 'INC_OP'
'--'						return 'DEC_OP'
'<='						return 'LE_OP'
'>='						return 'GE_OP'
'=='						return 'EQ_OP'
'!='						return 'NE_OP'
'&&'						return 'AND_OP'
'||'						return 'OR_OP'
'^'							return 'XOR_OP'
'*='						return 'MUL_ASSIGN'
'/='						return 'DIV_ASSIGN'
'+='						return 'ADD_ASSIGN'
'%='						return 'MOD_ASSIGN'
'<<='						return 'LEFT_ASSIGN'
'>>='						return 'RIGHT_ASSIGN'
'&='						return 'AND_ASSIGN'
'^='						return 'XOR_ASSIGN'
'|='						return 'OR_ASSIGN'
'-='						return 'SUB_ASSIGN'
'('							return 'LEFT_PAREN'
')'							return 'RIGHT_PAREN'
'['							return 'LEFT_BRACKET'
']'							return 'RIGHT_BRACKET'
'.'							return 'DOT'
','							return 'COMMA'
':'							return 'COLON'
'='							return 'EQUAL'
'!'							return 'BANG'
'-'							return 'DASH'
'~'							return 'TILDE'
'+'							return 'PLUS'
'*'							return 'STAR'
'/'							return 'SLASH'
'%'							return 'PERCENT'
'<'							return 'LEFT_ANGLE'
'>'							return 'RIGHT_ANGLE'
'|'							return 'VERTICAL_BAR'
'^'							return 'CARET'
'&'							return 'AMPERSAND'
'?'							return 'QUESTION'

';'							return 'SEMICOLON'
'{'							return 'LEFT_BRACE'
'}'							return 'RIGHT_BRACE'
<<EOF>>						return 'EOF'
.							return 'INVALID'

/lex

/* operator associations and precedence */

%left '+'
%left '*'

%start glsl-start

%% /* language grammar */

glsl-start :
			translation_unit EOF				{ return $1; }
		;

variable_identifier:
			'IDENTIFIER'
		;

primary_expression:
			variable_identifier
		|	'INTCONSTANT'
		|	'UINTCONSTANT'
		|	'FLOATCONSTANT'
		|	'BOOLCONSTANT'
		|	'LEFT_PAREN' expression 'RIGHT_PAREN'
		;

postfix_expression:
			primary_expression
		|	postfix_expression 'LEFT_BRACKET' integer_expression 'RIGHT_BRACKET'
		|	function_call
		|	postfix_expression 'DOT' 'FIELD_SELECTION'
		|	postfix_expression 'INC_OP'
		|	postfix_expression 'DEC_OP'
		;

integer_expression:
			expression
		;

function_call:
			function_call_or_method
		;

function_call_or_method:
			function_call_generic
		|	postfix_expression 'DOT' function_call_generic
		;

function_call_generic:
			function_call_header_with_parameters 'RIGHT_PAREN'
		|	function_call_header_no_parameters 'RIGHT_PAREN'
		;

function_call_header_no_parameters:
			function_call_header 'VOID'
		|	function_call_header
		;

function_call_header_with_parameters:
			function_call_header assignment_expression
		|	function_call_header_with_parameters 'COMMA' assignment_expression
		;

function_call_header:
			function_identifier 'LEFT_PAREN'
		;

/* Grammar Note: Constructors look like functions, but lexical analysis recognized most of them as
   keywords. They are now recognized through “type_specifier”.
*/

function_identifier:
			type_specifier
		|	'IDENTIFIER'
		|	'FIELD_SELECTION'
		;

unary_expression:
			postfix_expression
		|	'INC_OP' unary_expression
		|	'DEC_OP' unary_expression
		|	unary_operator unary_expression
		;

/* Grammar Note: No traditional style type casts. */

unary_operator:
			'PLUS'
		|	'DASH'
		|	'BANG'
		|	'TILDE'
		;

/* Grammar Note: No '*' or '&' unary ops. Pointers are not supported. */

multiplicative_expression:
			unary_expression
		|	multiplicative_expression 'STAR' unary_expression
		|	multiplicative_expression 'SLASH' unary_expression
		|	multiplicative_expression 'PERCENT' unary_expression
		;

additive_expression:
			multiplicative_expression
		|	additive_expression 'PLUS' multiplicative_expression
		|	additive_expression 'DASH' multiplicative_expression
		;

shift_expression:
			additive_expression
		|	shift_expression 'LEFT_OP' additive_expression
		|	shift_expression 'RIGHT_OP' additive_expression
		;

relational_expression:
			shift_expression
		|	relational_expression 'LEFT_ANGLE' shift_expression
		|	relational_expression 'RIGHT_ANGLE' shift_expression
		|	relational_expression 'LE_OP' shift_expression
		|	relational_expression 'GE_OP' shift_expression
		;

equality_expression:
			relational_expression
		|	equality_expression 'EQ_OP' relational_expression
		|	equality_expression 'NE_OP' relational_expression
		;

and_expression:
			equality_expression
		|	and_expression 'AMPERSAND' equality_expression
		;

exclusive_or_expression:
			and_expression
		|	exclusive_or_expression 'CARET' and_expression
		;

inclusive_or_expression:
			exclusive_or_expression
		|	inclusive_or_expression 'VERTICAL_BAR' exclusive_or_expression
		;

logical_and_expression:
			inclusive_or_expression
		|	logical_and_expression 'AND_OP' inclusive_or_expression
		;

logical_xor_expression:
			logical_and_expression
		|	logical_xor_expression 'XOR_OP' logical_and_expression
		;

logical_or_expression:
			logical_xor_expression
		|	logical_or_expression 'OR_OP' logical_xor_expression
		;

conditional_expression:
			logical_or_expression
		|	logical_or_expression 'QUESTION' expression 'COLON' assignment_expression
		;

assignment_expression:
			conditional_expression
		|	unary_expression assignment_operator assignment_expression
		;

assignment_operator:
			'EQUAL'
		|	'MUL_ASSIGN'
		|	'DIV_ASSIGN'
		|	'MOD_ASSIGN'
		|	'ADD_ASSIGN'
		|	'SUB_ASSIGN'
		|	'LEFT_ASSIGN'
		|	'RIGHT_ASSIGN'
		|	'AND_ASSIGN'
		|	'XOR_ASSIGN'
		|	'OR_ASSIGN'
		;

expression:
			assignment_expression
		|	expression 'COMMA' assignment_expression
		;

constant_expression:
			conditional_expression
		;

declaration:
			function_prototype 'SEMICOLON'
		|	init_declarator_list 'SEMICOLON'
		|	'PRECISION' precision_qualifier type_specifier_no_prec 'SEMICOLON'
		|	type_qualifier 'IDENTIFIER' 'LEFT_BRACE' struct_declaration_list 'RIGHT_BRACE' 'SEMICOLON'
		|	type_qualifier 'IDENTIFIER' 'LEFT_BRACE' struct_declaration_list 'RIGHT_BRACE'
		|	'IDENTIFIER' 'SEMICOLON'
		|	type_qualifier 'IDENTIFIER' 'LEFT_BRACE' struct_declaration_list 'RIGHT_BRACE'
		|	'IDENTIFIER' 'LEFT_BRACKET' 'RIGHT_BRACKET' 'SEMICOLON'
		|	type_qualifier 'IDENTIFIER' 'LEFT_BRACE' struct_declaration_list 'RIGHT_BRACE'
		|	'IDENTIFIER' 'LEFT_BRACKET' constant_expression 'RIGHT_BRACKET' 'SEMICOLON'
		|	type_qualifier 'SEMICOLON'
		;

function_prototype:
			function_declarator 'RIGHT_PAREN'
		;

function_declarator:
			function_header
		|	function_header_with_parameters
		;

function_header_with_parameters:
			function_header parameter_declaration
		|	function_header_with_parameters 'COMMA' parameter_declaration
		;

function_header:
			fully_specified_type 'IDENTIFIER' 'LEFT_PAREN'
		;

parameter_declarator:
			type_specifier 'IDENTIFIER'
		|	type_specifier 'IDENTIFIER' 'LEFT_BRACKET' constant_expression 'RIGHT_BRACKET'
		;

parameter_declaration:
			parameter_type_qualifier parameter_qualifier parameter_declarator
		|	parameter_qualifier parameter_declarator
		|	parameter_type_qualifier parameter_qualifier parameter_type_specifier
		|	parameter_qualifier parameter_type_specifier
		;

parameter_qualifier:
			/* empty */
		|	'IN'
		|	'OUT'
		|	'INOUT'
		;

parameter_type_specifier:
			type_specifier
		;

init_declarator_list:
			single_declaration
		|	init_declarator_list 'COMMA' 'IDENTIFIER'
		|	init_declarator_list 'COMMA' 'IDENTIFIER' 'LEFT_BRACKET' 'RIGHT_BRACKET'
		|	init_declarator_list 'COMMA' 'IDENTIFIER' 'LEFT_BRACKET' constant_expression
		|	'RIGHT_BRACKET'
		|	init_declarator_list 'COMMA' 'IDENTIFIER' 'LEFT_BRACKET'
		|	'RIGHT_BRACKET' 'EQUAL' initializer
		|	init_declarator_list 'COMMA' 'IDENTIFIER' 'LEFT_BRACKET' constant_expression
		|	'RIGHT_BRACKET' 'EQUAL' initializer
		|	init_declarator_list 'COMMA' 'IDENTIFIER' 'EQUAL' initializer
		;

single_declaration:
			fully_specified_type
		|	fully_specified_type 'IDENTIFIER'
		|	fully_specified_type 'IDENTIFIER' 'LEFT_BRACKET' 'RIGHT_BRACKET'
		|	fully_specified_type 'IDENTIFIER' 'LEFT_BRACKET' constant_expression 'RIGHT_BRACKET'
		|	fully_specified_type 'IDENTIFIER' 'LEFT_BRACKET' 'RIGHT_BRACKET' 'EQUAL' initializer
		|	fully_specified_type 'IDENTIFIER' 'LEFT_BRACKET' constant_expression
		|	'RIGHT_BRACKET' 'EQUAL' initializer
		|	fully_specified_type 'IDENTIFIER' 'EQUAL' initializer
		|	'INVARIANT' 'IDENTIFIER'
		;

/* Grammar Note: No 'enum', or 'typedef'. */

fully_specified_type:
			type_specifier
		|	type_qualifier type_specifier
		;

invariant_qualifier:
			'INVARIANT'
		;

interpolation_qualifier:
			'SMOOTH'
		|	'FLAT'
		|	'NOPERSPECTIVE'
		;

layout_qualifier:
			'LAYOUT' 'LEFT_PAREN' layout_qualifier_id_list 'RIGHT_PAREN'
		;

layout_qualifier_id_list:
			layout_qualifier_id
		|	layout_qualifier_id_list 'COMMA' layout_qualifier_id
		;

layout_qualifier_id:
			'IDENTIFIER'
		|	'IDENTIFIER' 'EQUAL' 'INTCONSTANT'
		;

parameter_type_qualifier:
			'CONST'
		;

type_qualifier:
			storage_qualifier
		|	layout_qualifier
		|	layout_qualifier storage_qualifier
		|	interpolation_qualifier storage_qualifier
		|	interpolation_qualifier
		|	invariant_qualifier storage_qualifier
		|	invariant_qualifier interpolation_qualifier storage_qualifier
		|	invariant
		;

storage_qualifier:
			'CONST'
		|	'ATTRIBUTE' /* Vertex only. */
		|	'VARYING'
		|	'CENTROID' 'VARYING'
		|	'IN'
		|	'OUT'
		|	'CENTROID' 'IN'
		|	'CENTROID' 'OUT'
		|	'PATCH' 'IN'
		|	'PATCH' 'OUT'
		|	'SAMPLE' 'IN'
		|	'SAMPLE' 'OUT'
		|	'UNIFORM'
		;

type_specifier:
			type_specifier_no_prec
		|	precision_qualifier type_specifier_no_prec
		;

type_specifier_no_prec:
			type_specifier_nonarray
		|	type_specifier_nonarray 'LEFT_BRACKET' 'RIGHT_BRACKET'
		|	type_specifier_nonarray 'LEFT_BRACKET' constant_expression 'RIGHT_BRACKET'
		;

type_specifier_nonarray:
			'VOID'
		|	'FLOAT'
		|	'DOUBLE'
		|	'INT'
		|	'UINT'
		|	'BOOL'
		|	'VEC2'
		|	'VEC3'
		|	'VEC4'
		|	'DVEC2'
		|	'DVEC3'
		|	'DVEC4'
		|	'BVEC2'
		|	'BVEC3'
		|	'BVEC4'
		|	'IVEC2'
		|	'IVEC3'
		|	'IVEC4'
		|	'UVEC2'
		|	'UVEC3'
		|	'UVEC4'
		|	'MAT2'
		|	'MAT3'
		|	'MAT4'
		|	'MAT2X2'
		|	'MAT2X3'
		|	'MAT2X4'
		|	'MAT3X2'
		|	'MAT3X3'
		|	'MAT3X4'
		|	'MAT4X2'
		|	'MAT4X3'
		|	'MAT4X4'
		|	'DMAT2'
		|	'DMAT3'
		|	'DMAT4'
		|	'DMAT2X2'
		|	'DMAT2X3'
		|	'DMAT2X4'
		|	'DMAT3X2'
		|	'DMAT3X3'
		|	'DMAT3X4'
		|	'DMAT4X2'
		|	'DMAT4X3'
		|	'DMAT4X4'
		|	'SAMPLER1D'
		|	'SAMPLER2D'
		|	'SAMPLER3D'
		|	'SAMPLERCUBE'
		|	'SAMPLER1DSHADOW'
		|	'SAMPLER2DSHADOW'
		|	'SAMPLERCUBESHADOW'
		|	'SAMPLER1DARRAY'
		|	'SAMPLER2DARRAY'
		|	'SAMPLER1DARRAYSHADOW'
		|	'SAMPLER2DARRAYSHADOW'
		|	'SAMPLERCUBEARRAY'
		|	'SAMPLERCUBEARRAYSHADOW'
		|	'ISAMPLER1D'
		|	'ISAMPLER2D'
		|	'ISAMPLER3D'
		|	'ISAMPLERCUBE'
		|	'ISAMPLER1DARRAY'
		|	'ISAMPLER2DARRAY'
		|	'ISAMPLERCUBEARRAY'
		|	'USAMPLER1D'
		|	'USAMPLER2D'
		|	'USAMPLER3D'
		|	'USAMPLERCUBE'
		|	'USAMPLER1DARRAY'
		|	'USAMPLER2DARRAY'
		|	'USAMPLERCUBEARRAY'
		|	'SAMPLER2DRECT'
		|	'SAMPLER2DRECTSHADOW'
		|	'ISAMPLER2DRECT'
		|	'USAMPLER2DRECT'
		|	'SAMPLERBUFFER'
		|	'ISAMPLERBUFFER'
		|	'USAMPLERBUFFER'
		|	'SAMPLER2DMS'
		|	'ISAMPLER2DMS'
		|	'USAMPLER2DMS'
		|	'SAMPLER2DMSARRAY'
		|	'ISAMPLER2DMSARRAY'
		|	'USAMPLER2DMSARRAY'
		|	struct_specifier
		|	'TYPE_NAME'
		;

precision_qualifier:
			'HIGH_PRECISION'
		|	'MEDIUM_PRECISION'
		|	'LOW_PRECISION'
		;

struct_specifier:
			'STRUCT' 'IDENTIFIER' 'LEFT_BRACE' struct_declaration_list 'RIGHT_BRACE'
		|	'STRUCT' 'LEFT_BRACE' struct_declaration_list 'RIGHT_BRACE'
		;

struct_declaration_list:
			struct_declaration
		|	struct_declaration_list struct_declaration
		;

struct_declaration:
			type_specifier struct_declarator_list 'SEMICOLON'
		|	type_qualifier type_specifier struct_declarator_list 'SEMICOLON'
		;

struct_declarator_list:
			struct_declarator
		|	struct_declarator_list 'COMMA' struct_declarator
		;

struct_declarator:
			'IDENTIFIER'
		|	'IDENTIFIER' 'LEFT_BRACKET' 'RIGHT_BRACKET'
		|	'IDENTIFIER' 'LEFT_BRACKET' constant_expression 'RIGHT_BRACKET'
		;

initializer:
			assignment_expression
		;

declaration_statement:
			declaration
		;

statement:
			compound_statement
		|	simple_statement
		;

/* Grammar Note: labeled statements for SWITCH only; 'goto' is not supported. */

simple_statement:
			declaration_statement
		|	expression_statement
		|	selection_statement
		|	switch_statement
		|	case_label
		|	iteration_statement
		|	jump_statement
		;

compound_statement:
			'LEFT_BRACE' 'RIGHT_BRACE'
		|	'LEFT_BRACE' statement_list 'RIGHT_BRACE'
		;

statement_no_new_scope:
			compound_statement_no_new_scope
		|	simple_statement
		;

compound_statement_no_new_scope:
			'LEFT_BRACE' 'RIGHT_BRACE'
		|	'LEFT_BRACE' statement_list 'RIGHT_BRACE'
		;

statement_list:
			statement
		|	statement_list statement
		;

expression_statement:
			'SEMICOLON'
		|	expression 'SEMICOLON'
		;

selection_statement:
			'IF' 'LEFT_PAREN' expression 'RIGHT_PAREN' selection_rest_statement
		;

selection_rest_statement:
			statement 'ELSE' statement
		|	statement
		;

condition:
			expression
		|	fully_specified_type 'IDENTIFIER' 'EQUAL' initializer
		;

switch_statement:
			'SWITCH' 'LEFT_PAREN' expression 'RIGHT_PAREN' 'LEFT_BRACE' switch_statement_list
		|	'RIGHT_BRACE'
		;

switch_statement_list:
			/* nothing */
		|	statement_list
		;

case_label:
			'CASE' expression 'COLON'
		|	'DEFAULT' 'COLON'
		;

iteration_statement:
			'WHILE' 'LEFT_PAREN' condition 'RIGHT_PAREN' statement_no_new_scope
		|	'DO' statement 'WHILE' 'LEFT_PAREN' expression 'RIGHT_PAREN' 'SEMICOLON'
		|	'FOR' 'LEFT_PAREN' for_init_statement for_rest_statement 'RIGHT_PAREN'
		|	statement_no_new_scope
		;

for_init_statement:
			expression_statement
		|	declaration_statement
		;

conditionopt:
			condition
		|	/* empty */
		;

for_rest_statement:
			conditionopt 'SEMICOLON'
		|	conditionopt 'SEMICOLON' expression
		;

jump_statement:
			'CONTINUE' 'SEMICOLON'
		|	'BREAK' 'SEMICOLON'
		|	'RETURN' 'SEMICOLON'
		|	'RETURN' expression
		|	'DISCARD' 'SEMICOLON' /* Fragment shader only.*/
		;

/* Grammar Note: No 'goto'. Gotos are not supported.*/

translation_unit:
			external_declaration
		|	translation_unit external_declaration
		;

external_declaration:
			function_definition
		|	declaration
		;

function_definition:
		function_prototype compound_statement_no_new_scope
		;
