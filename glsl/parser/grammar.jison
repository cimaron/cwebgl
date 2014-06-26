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

%{
	var ast = require('./ast.js');
	var type = require('./type.js').types;
%}

/* lexical grammar */
%lex

DEC_INT		[1-9][0-9]*
HEX_INT		0[xX][0-9a-fA-F]+
OCT_INT		0[0-7]*
INT		({DEC_INT}|{HEX_INT}|{OCT_INT})
SPC		[ \t]*
SPCP		[ \t]+
HASH		^{SPC}#{SPC}

%s PRAGMA PP

%%

[ \r\t]+		;

/* Preprocessor tokens. */ 
[ \t]*\#[ \t]*$             {}
[ \t]*\#[ \t]*"version"     { this.begin('PP'); return 'VERSION'; }
[ \t]*\#[ \t]*"extension"   { this.begin('PP'); return 'EXTENSION'; }

{HASH}"line"{SPCP}{INT}{SPCP}{INT}{SPC}$ {
	
	/* Eat characters until the first digit is
	 * encountered
	 */
	
	var ptr = 0;
	while (yytext.slice(0, 1) < '0' || yytext.slice(0, 1) > '9') {
		ptr++;
	}

	/* Subtract one from the line number because
	 * yylineno is zero-based instead of
	 * one-based.
	 */
	yylineno = parseInt(yytext.slice(0, 1), 10) - 1;
	yylloc.source = parseInt(yytext.slice(0), 10);
}

{HASH}"line"{SPCP}{INT}{SPC}$	{
				   /* Eat characters until the first digit is
				    * encountered
				    */
					var ptr = 0;
					while (yytext.slice(0, 1) < '0' || yytext.slice(0, 1) > '9')
						ptr++;

				   /* Subtract one from the line number because
				    * yylineno is zero-based instead of
				    * one-based.
				    */
				   yylineno = parseInt(yytext.slice(0, 1), 10) - 1;
				}
{SPC}\#{SPC}"pragma"{SPCP}"debug"{SPC}\({SPC}"on"{SPC}\) {
				  this.begin('PP');
				  return 'PRAGMA_DEBUG_ON';
				}
{SPC}\#{SPC}"pragma"{SPCP}"debug"{SPC}\({SPC}"off"{SPC}\) {
				  this.begin('PP');
				  return 'PRAGMA_DEBUG_OFF';
				}
{SPC}\#{SPC}"pragma"{SPCP}"optimize"{SPC}\({SPC}"on"{SPC}\) {
				  this.begin('PP');
				  return 'PRAGMA_OPTIMIZE_ON';
				}
{SPC}\#{SPC}"pragma"{SPCP}"optimize"{SPC}\({SPC}"off"{SPC}\) {
				  this.begin('PP');
				  return 'PRAGMA_OPTIMIZE_OFF';
				}
{SPC}\#{SPC}"pragma"{SPCP}"STDGL"{SPCP}"invariant"{SPC}\({SPC}"all"{SPC}\) {
				  this.begin('PP');
				  return 'PRAGMA_INVARIANT_ALL';
				}
{SPC}\#{SPC}"pragma"{SPCP}	{ this.begin('PRAGMA'); }

<PRAGMA>[\n]			{ this.begin('INITIAL'); yylineno++; yycolumn = 0; }
<PRAGMA>.			{ }

<PP>\/\/[^\n]*			{ }
<PP>[ \t\r]*			{ }
<PP>":"				return ":";
<PP>[_a-zA-Z][_a-zA-Z0-9]*	{
				   yylval.identifier = strdup(yytext);
				   return 'IDENTIFIER';
				}
<PP>[1-9][0-9]*			{
				    yylval.n = parseInt(yytext);
				    return 'INTCONSTANT';
				}
<PP>[\n]				{ this.begin('INITIAL'); yylineno++; yycolumn = 0; return 'EOL'; }

[\n]		{ /*yylineno++; yycolumn = 0;*/ }

"attribute"	return 'ATTRIBUTE';
"const"		return 'CONST';
"bool"		return 'BOOL';
"float"		return 'FLOAT';
"int"		return 'INT';

"break"		return 'BREAK';
"continue"	return 'CONTINUE';
"do"		return 'DO';
"while"		return 'WHILE';
"else"		return 'ELSE';
"for"		return 'FOR';
"if"		return 'IF';
"discard"		return 'DISCARD';
"return"		return 'RETURN';

"bvec2"		return 'BVEC2';
"bvec3"		return 'BVEC3';
"bvec4"		return 'BVEC4';
"ivec2"		return 'IVEC2';
"ivec3"		return 'IVEC3';
"ivec4"		return 'IVEC4';
"vec2"		return 'VEC2';
"vec3"		return 'VEC3';
"vec4"		return 'VEC4';
"mat2"		return 'MAT2X2';
"mat3"		return 'MAT3X3';
"mat4"		return 'MAT4X4';

"in"              return 'IN';
"out"             return 'OUT';
"inout"           return 'INOUT';
"uniform"	      return 'UNIFORM';
"varying"         return 'VARYING';
"invariant"       return 'INVARIANT';
"flat"            return 'FLAT';
"smooth"          return 'SMOOTH';

"sampler1D"	return 'SAMPLER1D';
"sampler2D"	return 'SAMPLER2D';
"sampler3D"	return 'SAMPLER3D';
"samplerCube"	return 'SAMPLERCUBE';
"sampler1DShadow"	return 'SAMPLER1DSHADOW';
"sampler2DShadow"	return 'SAMPLER2DSHADOW';


"struct"		return 'STRUCT';
"void"		return 'VOID';

"layout"		{/*copy manually*/}

"++"		return '++';
"--"		return '--';
"<="		return '<=';
">="		return '>=';
"=="		return '==';
"!="		return '!=';
"&&"		return '&&';
"||"		return '||';
"^^"		return '^^';
"<<"		return '<<';
">>"		return '>>';

"*="		return '*=';
"/="		return '/=';
"+="		return '+=';
"%="		return '%=';
"<<="		return '<<=';
">>="		return '>>=';
"&="		return '&=';
"^="		return '^=';
"|="		return '|=';
"-="		return '-=';

[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?[fF]?	{
			    this.yylval = parseFloat(yytext);
			    return 'FLOATCONSTANT';
			}
\.[0-9]+([eE][+-]?[0-9]+)?[fF]?		{
				this.yylval = parseFloat(yytext);
				return 'FLOATCONSTANT';
			}
[0-9]+\.([eE][+-]?[0-9]+)?[fF]?		{
			    this.yylval = parseFloat(yytext);
			    return 'FLOATCONSTANT';
			}
[0-9]+[eE][+-]?[0-9]+[fF]?		{
			    this.yylval = parseFloat(yytext);
			    return 'FLOATCONSTANT';
			}
[0-9]+[fF]		{
			    this.yylval = parseFloat(yytext);
			    return 'FLOATCONSTANT';
			}
"0"[xX][0-9a-fA-F]+[uU]?	{
			    this.yylval = parseInt(yytext + 2, 16);
			    return this.IS_UINT(yytext) ? 'UINTCONSTANT' : 'INTCONSTANT';
			}
"0"[0-7]*[uU]?		{
			    this.yylval = parseInt(yytext, 8);
			    return this.IS_UINT(yytext) ? 'UINTCONSTANT' : 'INTCONSTANT';
			}
[1-9][0-9]*[uU]?	{
				this.yylval = parseInt(yytext);
				return this.IS_UINT(yytext) ? 'UINTCONSTANT' : 'INTCONSTANT';
			}
"true"			{
			    this.yylval = 1;
			    return 'BOOLCONSTANT';
			}
"false"			{
			    this.yylval = 0;
			    return 'BOOLCONSTANT';
			}


"asm"		return 'ASM'
"class"		return 'CLASS'
"union"		return 'UNION'
"enum"		return 'ENUM'
"typedef"		return 'TYPEDEF'
"template"	return 'TEMPLATE'
"this"		return 'THIS'
"packed"		return 'PACKED'
"goto"		return 'GOTO'
"switch"		return 'SWITCH'
"default"		return 'DEFAULT'
"inline"		return 'INLINE'
"noinline"	return 'NOINLINE'
"volatile"	return 'VOLATILE'
"public"		return 'PUBLIC'
"static"		return 'STATIC'
"extern"		return 'EXTERN'
"external"	return 'EXTERNAL'
"interface"	return 'INTERFACE'
"long"		return 'LONG'
"short"		return 'SHORT'
"double"		return 'DOUBLE'
"half"		return 'HALF'
"fixed"		return 'FIXED'
"unsigned"	return 'UNSIGNED'
"input"		return 'INPUT'
"output"		return 'OUTPUT'
"hvec2"		return 'HVEC2'
"hvec3"		return 'HVEC3'
"hvec4"		return 'HVEC4'
"dvec2"		return 'DVEC2'
"dvec3"		return 'DVEC3'
"dvec4"		return 'DVEC4'
"fvec2"		return 'FVEC2'
"fvec3"		return 'FVEC3'
"fvec4"		return 'FVEC4'

"sampler2DRect"         return 'SAMPLER2DRECT';
"sampler3DRect"         return 'SAMPLER3DRECT';
"sampler2DRectShadow"   return 'SAMPLER2DRECTSHADOW';
"sizeof"                return 'SIZEOF';
"cast"                  return 'CAST';
"namespace"             return 'NAMESPACE';
"using"                 return 'USING';

"lowp"                  return 'LOWP';
"mediump"               return 'MEDIUMP';
"highp"                 return 'HIGHP';
"precision"             return 'PRECISION';

[_a-zA-Z][_a-zA-Z0-9]* {
	yy.yylval = yytext;
	return yy.state.classify_identifier(yy.state, yytext);
}

.         return yytext;

<<EOF>>   return 'EOF';


/lex

/* operator associations and precedence */

%left '+'
%left '*'
%right THEN ELSE

%start glsl-start

%% /* language grammar */

glsl-start :
			translation_unit EOF		{ return $1; }
		;

translation_unit: 
	version_statement extension_statement_list
	external_declaration_list
	;

/* Line: 229 */
version_statement:
	  /* blank - no #version specified: defaults are already set */
	| VERSION INTCONSTANT EOL
	;

/* Line: 270 */
pragma_statement:
	  'PRAGMA_DEBUG_ON' 'EOL'
	| 'PRAGMA_DEBUG_OFF' 'EOL'
	| 'PRAGMA_OPTIMIZE_ON' 'EOL'
	| 'PRAGMA_OPTIMIZE_OFF' 'EOL'
	| 'PRAGMA_INVARIANT_ALL' 'EOL'
	;

/* Line: 287 */
extension_statement_list:

	| extension_statement_list extension_statement
	;

/* Line: 292 */
any_identifier:
	variable_identifier
	| 'TYPE_IDENTIFIER'
	;

/* Line: 298 */
extension_statement:
	  'EXTENSION' any_identifier ':' any_identifier 'EOL'
	;

/* Line: 307 */
external_declaration_list:
	  external_declaration {
			if ($1 != null) {
				yy.state.translation_unit.push($1);
			}
		}
	| external_declaration_list external_declaration {
			if ($2 != null) {
				yy.state.translation_unit.push($2);
			}
		}
	;

/* Line: 326 */
variable_identifier:
		  'IDENTIFIER'
		| 'NEW_IDENTIFIER'
		;

/* Line: 331 */
primary_expression:
			variable_identifier
		|	'INTCONSTANT'
		|	'UINTCONSTANT'
		|	'FLOATCONSTANT'
		|	'BOOLCONSTANT'
		|	'(' expression ')'
		;

/* Line: 373 */
postfix_expression:
			primary_expression
		|	postfix_expression '[' integer_expression ']'
		|	function_call
		|	postfix_expression '.' any_identifier
		|	postfix_expression '++'
		|	postfix_expression '--'
		;

/* Line: 406 */
integer_expression:
			expression
		;

/* Line: 410 */
function_call:
			function_call_or_method
		;

/* Line: 414 */
function_call_or_method:
			function_call_generic
		|	postfix_expression '.' method_call_generic
		;

/* Line: 424 */
function_call_generic:
			function_call_header_with_parameters ')'
		|	function_call_header_no_parameters ')'
		;

/* Line: 429 */
function_call_header_no_parameters:
			function_call_header 'VOID'
		|	function_call_header
		;

/* Line: 434 */
function_call_header_with_parameters:
		  function_call_header assignment_expression {
				$$ = $1;
				$$.setLocation(@1.first_line, @1.first_column);
				$$.expressions.push($2);
			}	
		|  function_call_header_with_parameters ',' assignment_expression
		;

/* Line: 452 */
/* Fix conflict */
function_call_header:
		  type_specifier '(' {
				$$ = new ast.function_expression($1);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| variable_identifier '('
		| 'FIELD_SELECTION'
		;

/* Line: 456 */
/*
function_identifier:
	  type_specifier
	| variable_identifier
	| 'FIELD_SELECTION'
	;
*/

/* Line: 478 */
method_call_generic:
	  method_call_header_with_parameters ')'
	| method_call_header_no_parameters ')'
	;

/* Line: 489 */
method_call_header_no_parameters:
	  method_call_header 'VOID'
	| method_call_header
	;

/* Line: 489 */
method_call_header_with_parameters:
		method_call_header assignment_expression
	| method_call_header_with_parameters ',' assignment_expression
	;

/* Line: 507 */
method_call_header:
		variable_identifier '('
	;

/* Grammar Note: Constructors look like functions, but lexical analysis recognized most of them as
   keywords. They are now recognized through â€œtype_specifierâ€?.
*/

	/* Grammar Note: No traditional style type casts. */
/* Line: 518 */
unary_expression:
		  postfix_expression
		| '++' unary_expression {
				$$ = new ast.expression($1, $2);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| '--' unary_expression {
				$$ = new ast.expression($1, $2);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| unary_operator unary_expression {
				$$ = new ast.expression($1, $2);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

	/* Grammar Note: No '*' or '&' unary ops. Pointers are not supported. */
/* Line: 570 */
unary_operator:
		  '+'
		| '-'
		| '!'
		| '~'
		;

/* Line: 548 */
multiplicative_expression:
		  unary_expression
		| multiplicative_expression '*' unary_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| multiplicative_expression '/' unary_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| multiplicative_expression '%' unary_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 570 */
additive_expression:
		  multiplicative_expression
		| additive_expression '+' multiplicative_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| additive_expression '-' multiplicative_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 586 */
shift_expression:
		  additive_expression
		| shift_expression '<<' additive_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| shift_expression '>>' additive_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 602 */
relational_expression:
		  shift_expression
		| relational_expression '<' shift_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| relational_expression '>' shift_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| relational_expression '<=' shift_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| relational_expression '>=' shift_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 630 */
equality_expression:
		  relational_expression
		| equality_expression '==' relational_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		| equality_expression '!=' relational_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 646 */
and_expression:
		  equality_expression
		| and_expression '&' equality_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 656 */
exclusive_or_expression:
		  and_expression
		| exclusive_or_expression '^' and_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 666 */
inclusive_or_expression:
		  exclusive_or_expression
		| inclusive_or_expression '|' exclusive_or_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 676 */
logical_and_expression:
		  inclusive_or_expression
		| logical_and_expression '&&' inclusive_or_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 686 */
logical_xor_expression:
		  logical_and_expression
		| logical_xor_expression '^^' logical_and_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 696 */
logical_or_expression:
		  logical_xor_expression
		| logical_or_expression '||' logical_xor_expression {
				$$ = new ast.expression_bin($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 706 */
conditional_expression:
		  logical_or_expression
		| logical_or_expression '?' expression ':' assignment_expression {
				$$ = new ast.expression($2, $1, $3, $5);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 716 */
assignment_expression:
		  conditional_expression
		| unary_expression assignment_operator assignment_expression {
				$$ = new ast.expression($2, $1, $3);
				$$.setLocation(@1.first_line, @1.first_column);
			}
		;

/* Line: 726 */
assignment_operator:
		  '='
		| '*='
		| '/='
		| '%='
		| '+='
		| '-='
		| '<<='
		| '>>='
		| '&='
		| '^='
		| '|='
		;

/* Line: 740 */
expression:
		  assignment_expression {
				$$ = $1;
			}
		| expression ',' assignment_expression {
				if ($1.oper != $2) {
					$$ = new ast.expression($2);
					$$.setLocation(@1.first_line, @1.first_column);
					$$.expressions.push($1);
				} else {
					$$ = $1;
				}
				$$.expressions.push($3);
			}
		;

/* Line: 760 */
constant_expression:
		  conditional_expression
		;

/* Line: 764 */
declaration:
		  function_prototype ';' {
				yy.state.symbols.pop_scope();
				$$ = $1;
			}
		| init_declarator_list ';' {
				$$ = $1;
			}
		| 'PRECISION' precision_qualifier type_specifier_no_prec ';'
		;

/* Line: 782 */
function_prototype:
			function_declarator ')'
		;

/* Line: 786 */
function_declarator:
			function_header
		|	function_header_with_parameters
		;

/* Line: 791 */
function_header_with_parameters:
		  function_header parameter_declaration {
			  	$$ = $1;
				$$.parameters.push($2);
			}
		| function_header_with_parameters ',' parameter_declaration
		;

/* Line: 804 */
function_header:
		  fully_specified_type variable_identifier '(' {
				$$ = new ast.func();
				$$.setLocation(@1.first_line, @1.first_column);
				$$.return_type = $1;
				$$.identifier = $2;
				yy.state.symbols.add_function($2);
				yy.state.symbols.push_scope();
			}
		;

/* Line: 818 */
parameter_declarator:
			type_specifier any_identifier
		|	type_specifier any_identifier '[' constant_expression ']'
		;

/* Line: 843 */
parameter_declaration:
		  parameter_type_qualifier parameter_qualifier parameter_declarator
		| parameter_qualifier parameter_declarator
		| parameter_type_qualifier parameter_qualifier parameter_type_specifier
		| parameter_qualifier parameter_type_specifier {
				$$ = new ast.parameter_declarator();
				$$.setLocation(@1.first_line, @1.first_column);
				$$.type = new ast.fully_specified_type();
				$$.type.qualifier = $1;
				$$.type.specifier = $2;
			}
		;

/* Line: 878 */
parameter_qualifier:
			/* empty */
		|	'IN'
		|	'OUT'
		|	'INOUT'
		;

/* Line: 901 */
parameter_type_specifier:
			type_specifier
		;

/* Line: 905 */
init_declarator_list:
		  single_declaration
		| init_declarator_list ',' any_identifier
		| init_declarator_list ',' any_identifier '[' ']'
		| init_declarator_list ',' any_identifier '[' constant_expression ']'
		| init_declarator_list ',' any_identifier '[' ']' '=' initializer
		| init_declarator_list ',' any_identifier '[' constant_expression ']' '=' initializer
		| init_declarator_list ',' any_identifier '=' initializer
		;

/* Grammar Note: No 'enum', or 'typedef'. */
/* Line: 969 */
single_declaration:
		  fully_specified_type {
				if ($1.specifier.type_specifier != types.struct) {
					yy.state.error(@1, "empty declaration list");
					return 0;
				} else {
					$$ = new ast.declarator_list($1);
					$$.setLocation(@1.first_line, @1.first_column);
				}
			}
		| fully_specified_type any_identifier {
				var decl = new ast.declaration($2, false);
				$$ = new ast.declarator_list($1);
				$$.setLocation(@1.first_line, @1.first_column);
				$$.declarations.push(decl);
			}
		| fully_specified_type any_identifier '[' ']' {
				var decl = new ast.declaration($2, true);
				$$ = new ast.declarator_list($1);
				$$.setLocation(@1.first_line, @1.first_column);
				$$.declarations.push(decl);
			}
		| fully_specified_type any_identifier '[' constant_expression ']' {
				var decl = new ast.declaration($2, true, $4);
				$$ = new ast.declarator_list($1);
				$$.setLocation(@1.first_line, @1.first_column);
				$$.declarations.push(decl);
			}
		| fully_specified_type any_identifier '[' ']' '=' initializer {
				var decl = new ast.declaration($2, true, null, $6);
				$$ = new ast.declarator_list($1);
				$$.setLocation(@1.first_line, @1.first_column);
				$$.declarations.push(decl);
			}
		| fully_specified_type any_identifier '[' constant_expression ']' '=' initializer {
				var decl = new ast.declaration($2, true, $4, $7);
				$$ = new ast.declarator_list($1);
				$$.setLocation(@1.first_line, @1.first_column);
				$$.declarations.push(decl);
			}
		| fully_specified_type any_identifier '=' initializer {
				var decl = new ast.declaration($2, false, null, $4);
				$$ = new ast.declarator_list($1);
				$$.setLocation(@1.first_line, @1.first_column);
				$$.declarations.push(decl);
			}
		| 'INVARIANT' variable_identifier
		;

/* Line: 1049 */
fully_specified_type:
		  type_specifier {
				$$ = new ast.fully_specified_type();
				$$.setLocation(@1.first_line, @1.first_column);
				$$.specifier = $1;
			}
		| type_qualifier type_specifier {
				$$ = new ast.fully_specified_type();
				$$.setLocation(@1.first_line, @1.first_column);
				$$.qualifier = $1;
				$$.specifier = $2;
			}
		;

/* Line: 1067 */
layout_qualifier:
		  'LAYOUT' '(' layout_qualifier_id_list ')' {
				$$ = $3;	
			}
		;

/* Line: 1074 */
layout_qualifier_id_list:
			layout_qualifier_id
		|	layout_qualifier_id_list ',' layout_qualifier_id
		;

/* Line: 1094 */
layout_qualifier_id:
			any_identifier
		|	any_identifier '=' 'INTCONSTANT'
		;

/* Line: 1164 */
interpolation_qualifier:
			'SMOOTH'
		|	'FLAT'
		|	'NOPERSPECTIVE'
		;

/* Line: 1182 */
parameter_type_qualifier:
			'CONST'
		;


/* Line: 1190 */
type_qualifier:
			storage_qualifier
		|	layout_qualifier
		|	layout_qualifier storage_qualifier
		|	interpolation_qualifier
		|	interpolation_qualifier storage_qualifier
		|	'INVARIANT' storage_qualifier
		|	'INVARIANT' interpolation_qualifier storage_qualifier
		|	'INVARIANT'
		;

/* Line: 1222 */
storage_qualifier:
		  'CONST'
		| 'ATTRIBUTE' /* Vertex only. */ {
				$$ = new ast.type_qualifier();
				$$.flags |= ast.type_qualifier.flags.attribute;
			}
		| 'VARYING' {
				$$ = new ast.type_qualifier();
				$$.flags |= ast.type_qualifier.flags.varying;
			}
		| 'CENTROID' 'VARYING' {
				$$ = new ast.type_qualifier();
				$$.flags |= ast.type_qualifier.flags.centroid;
				$$.flags |= ast.type_qualifier.flags.varying;
			}
		| 'IN' {
				$$ = new ast.type_qualifier();
				$$.flags |= ast.type_qualifier.flags['in'];
			}
		| 'OUT' {
				$$ = new ast.type_qualifier();
				$$.flags |= ast.type_qualifier.flags.out;
			}
		| 'CENTROID' 'IN' {
				$$ = new ast.type_qualifier();
				$$.flags |= ast.type_qualifier.flags.centroid;
				$$.flags |= ast.type_qualifier.flags['in'];
			}
		| 'CENTROID' 'OUT' {
				$$ = new ast.type_qualifier();
				$$.flags |= ast.type_qualifier.flags.centroid;
				$$.flags |= ast.type_qualifier.flags.out;
			}
		| 'UNIFORM' {
				$$ = new ast.type_qualifier();
				$$.flags |= ast.type_qualifier.flags.uniform;
			}
		;

/* Line: 1271 */
type_specifier:
		  type_specifier_no_prec {
				$$ = $1;  
			}
		| precision_qualifier type_specifier_no_prec {
				$$ = $2;
				$$.precision = $1;
			}
		;

/* Line: 1283 */
type_specifier_no_prec:
			type_specifier_nonarray
		|	type_specifier_nonarray '[' ']'
		|	type_specifier_nonarray '[' constant_expression ']'
		;

/* Line: 1299 */
type_specifier_nonarray:
	  basic_type_specifier_nonarray {
		  	$$ = new ast.type_specifier($1);
			$$.setLocation(@1.first_line, @1.first_column);
		}
	| struct_specifier {
		  	$$ = new ast.type_specifier($1);
			$$.setLocation(@1.first_line, @1.first_column);
		}
	| 'TYPE_IDENTIFIER' {
		  	$$ = new ast.type_specifier($1);
			$$.setLocation(@1.first_line, @1.first_column);
		}
	;


/* Line: 1374 */
basic_type_specifier_nonarray:
			'VOID'
		|	'FLOAT'
		|	'DOUBLE'
		|	'INT'
		|	'UINT'
		|	'BOOL'
		|	'VEC2'
		|	'VEC3'
		|	'VEC4'
		|	'BVEC2'
		|	'BVEC3'
		|	'BVEC4'
		|	'IVEC2'
		|	'IVEC3'
		|	'IVEC4'
		|	'MAT2X2'
		|	'MAT3X3'
		|	'MAT4X4'
		|	'SAMPLER1D'
		|	'SAMPLER2D'
		|	'SAMPLER3D'
		|	'SAMPLERCUBE'
		|	'SAMPLER1DSHADOW'
		|	'SAMPLER2DSHADOW'
		;

/* Line: 1374 */
precision_qualifier:
			'HIGHP'
		|	'MEDIUMP'
		|	'LOWP'
		;

/* Line: 1407 */
struct_specifier:
		  'STRUCT' any_identifier '{' struct_declaration_list '}' {
				$$ = new ast.struct_specifier($2, $4);
				$$.setLocation(@1.first_line, @2.first_column);
				yy.state.symbols.add_type($2, types._void);
			}			  
		| 'STRUCT' '{' struct_declaration_list '}'
		;

/* Line: 1423 */
struct_declaration_list:
		  struct_declaration {
				$$ = [$1];
			}
		| struct_declaration_list struct_declaration {
				$$ = $1;
				$$.push($2);
			}
		;

/* Line: 1436 */
struct_declaration:
		  type_specifier struct_declarator_list ';' {
				var type = new ast.fully_specified_type();
				type.setLocation(@1.first_line, @2.first_column);
				type.specifier = $1;
				$$ = new ast.declarator_list(type);
				$$.setLocation(@1.first_line, @2.first_column);
				$$.declarations = $2;
			}
		;

/* Line: 1451 */
struct_declarator_list:
			struct_declarator
		|	struct_declarator_list ',' struct_declarator
		;

/* Line: 1464 */
struct_declarator:
		  any_identifier {
				$$ = new ast.declaration(ident, false);
				$$.setLocation(@1.first_line, @2.first_column);
				yy.state.symbols.add_variable($1);
			}
		| any_identifier '[' constant_expression ']'
		;

/* Line: 1480 */
initializer:
			assignment_expression
		;

/* Line: 1484 */
declaration_statement:
			declaration
		;

/* Line: 1490 */
statement:
			compound_statement
		|	simple_statement
		;

/* Grammar Note: labeled statements for SWITCH only; 'goto' is not supported. */

/* Line: 1495 */
simple_statement:
		  declaration_statement
		| expression_statement
		| selection_statement
		| switch_statement {
				$$ = null; }
		| case_label {
				$$ = null; }
		| iteration_statement
		| jump_statement
		;

/* Line: 1505 */
compound_statement:
			'{' '}'
		|	'{' statement_list '}'
		;

/* Line: 1525 */
statement_no_new_scope:
			compound_statement_no_new_scope
		|	simple_statement
		;

/* Line: 1530 */
compound_statement_no_new_scope:
		  '{' '}'
		| '{' statement_list '}' {
				$$ = new ast.compound_statement(false, $2);
				$$.setLocation(@1.first_line, @1.first_column); console.log('compound_statement_no_new_scope', $$); }
		;

/* Line: 1545 */
statement_list:
		  statement {
				if ($1 == null) {
					yy.state.error(@1, "<nil> statement\n");
				} else {
					$$ = [$1];
				}
			}
		| statement_list statement {
				if ($2 == null) {
					yy.state.error(@1, "<nil> statement");	
				}
				$$ = $1;
				$$.push($2);
			}
		;

/* Line: 1567 */
expression_statement:
		  ';'
		| expression ';' {
				$$ = new ast.expression_statement($1);
				$$.setLocation(@1.first_line, @2.first_column); console.log('expression_statement', $$); }
		;

/* Line: 1582 */
selection_statement:
			'IF' '(' expression ')' selection_rest_statement
		;

/* Line: 1591 */
selection_rest_statement:
		  statement 'ELSE' statement
		| statement %prec THEN
		;

/* Line: 1604 */
condition:
			expression
		|	fully_specified_type any_identifier '=' initializer
		;

/* Line: 1622 */
switch_statement:
			'SWITCH' '(' expression ')' compound_statement
		;

/* Line: 1626 */
case_label:
			'CASE' expression ':'
		|	'DEFAULT' ':'
		;

/* Line: 1631 */
iteration_statement:
			'WHILE' '(' condition ')' statement_no_new_scope
		|	'DO' statement 'WHILE' '(' expression ')' ';'
		|	'FOR' '(' for_init_statement for_rest_statement ')' statement_no_new_scope
		;

/* Line: 1655 */
for_init_statement:
			expression_statement
		|	declaration_statement
		;

/* Line: 1660 */
conditionopt:
			condition
		|	/* empty */
		;

/* Line: 1668 */
for_rest_statement:
			conditionopt ';'
		|	conditionopt ';' expression
		;

/* Line: 1682 */
jump_statement:
			'CONTINUE' ';'
		|	'BREAK' ';'
		|	'RETURN' ';'
		|	'RETURN' expression ';'
		|	'DISCARD' ';' /* Fragment shader only.*/
		;

/* Line: 1715 */
external_declaration:
		  function_definition {
				$$ = $1; }
		| declaration {
				$$ = $1; }
		| pragma_statement {
				$$ = null; }
		;

/* Line: 1721 */
function_definition:
		  function_prototype compound_statement_no_new_scope {
				$$ = new ast.function_definition();
				$$.setLocation(@1.first_line, @1.first_column);
				$$.proto_type = $1;
				$$.body = $2;
				yy.state.symbols.pop_scope(); console.log('function_definition', $$); }
		;

