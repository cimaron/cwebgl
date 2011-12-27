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


var glsl = (function(ARB) {

	/**
	 * Local Scope
	 */
	var glsl, initialized;

	/**
	 * parse_state object
	 */
	function parse_state(target) {
		this.es_shader = true;
		this.language_version = 110;
		this.translation_unit = [];
		this.symbols = new glsl.symbol_table();
		this.target = target;
		this.scanner = glsl.lexer;
	};

	/**
	 * Get next token from lexer
	 *
	 * @param   object    Reference to array to store token in
	 * @param   object    Reference to array to store location of token in source file
	 * @param   object    Unused
	 *
	 * @return  boolean
	 */
	function next_token(yylval, yylloc, scanner) {
		lexer.yylval = {};
		var result = lexer.lex();
		if (result == 1) {
			result = 0; //YYEOF	
		}
		yylval[0] = lexer.yylval;
		yylloc[0] = lexer.yylloc;
		return result;
	}

	/*IF DEBUG
	function print_token_value(yyoutput, yytoknum, yyvaluep) {
		glsl.fprintf(2, JSON.stringify(yyvaluep).replace(/"/g, ''));
	}
	*/

	/**
	 * Store parse error
	 *
	 * @param   object    Location of error
	 * @param   object    Unused
	 * @param   object    Error string
	 */
	function print_error(yylloc, state, error) {
		glsl.errors.push(error + " at line " + yylloc.first_line + " column " + yylloc.first_column);
	}

	/**
	 * Compiler object
	 */
	glsl = {

		/**
		 * Compilation mode enumerations
		 */
		mode : {
			vertex : 0,
			fragment : 1
		},

		/**
		 * Compilation results
		 */
		errors : [],

		//expose to lexer/parser
		token : null,
		parseError : function(str, hash) {
			yyerror(lexer.yylloc, state, str);
		},

		initialize : function() {

			//lexer
			this.lexer.yy = this;

			//parser
			this.parser.yy = this;

			this.parser.yylex = next_token;
			this.parser.yyerror = print_error;
			/*IF DEBUG
			this.parser.YYPRINT = print_token_value;
			*/
			//this.parser.initialize_types = initialize_types;

			this.token = this.parser.yytokentype;
		},
 
		compile : function(source, target) {
			var status, irs;

			if (!initialized) {
				this.initialize();
				initialized = true;
			}

			//reset output
			this.output = null;
			this.errors = [];
			this.state = new parse_state(target);

			//preprocess
			source = this.preprocess(source, this.state);
			if (!source) {
				return false;
			}

			//scan/parse
			lexer.setInput(source);
			//need to get errors here
			if (this.parser.yyparse(this.state) != 0) {
				return false;
			}

			//generate IR code
			irs = this.generate_ir(this.state);
			if (!irs) {
				return false;
			}

			//optimize
			//@todo:

			//generate ARB code
			this.output = this.generate_arb(irs, this.state);

			status = (this.output ? true : false)
			return status;
		}
	};

	return glsl;
}(ARB));

include('cnvGL/includes/glsl/symbol.js');
include('cnvGL/includes/glsl/preprocessor.js');
include('cnvGL/includes/glsl/lexer.js');
include('cnvGL/includes/glsl/lexer_extern.js');
include('cnvGL/includes/glsl/parser.js');
//include('cnvGL/includes/glsl/parser_debug.js');
include('cnvGL/includes/glsl/builtin.js');
include('cnvGL/includes/glsl/ast.js');
include('cnvGL/includes/glsl/type.js');
include('cnvGL/includes/glsl/ir.js');
include('cnvGL/includes/glsl/ir_generator.js');
include('cnvGL/includes/glsl/ir_generator_tables.php');
include('cnvGL/includes/glsl/generator.js');

