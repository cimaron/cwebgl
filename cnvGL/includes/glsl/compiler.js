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

var compiler = (function() {

	var preprocessor;
	var lexer;
	var parser;

	//stdin, stdout, stderr, buffer
	var output = [null, '', ''];
	var log = [null, '', ''];

	var sprintf = function(str) {
		var i = 1, m, rest = str; str = '';
		while (m = rest.match('%([l]?)([dus%])')) {
			var d = m[0];
			switch (m[2]) {
				case 'u':
				case 'd':
					d = parseInt(arguments[i]);
					break;
				case 's':
					d = arguments[i];
					break;
				case '%':
					d = '%';
					break;
				default:
			}
			i++;
			str += rest.slice(0, m.index) + d;
			rest = rest.slice(m.index + m[0].length);
		}
		str += rest;
		return str;
	};

	var printf = function() {
		var args = [].splice.call(arguments, 0);
		args.unshift(1);
		fprintf.apply(null, args);
	}
	
	var fprintf = function(file, str) {
		var args = [].splice.call(arguments, 1);	
		str = sprintf.apply(null, args);
		output[file ? file : 1] = str;
		ob_stream(file, str);
	};

	var ob_stream = function(file, str) {
		debugger;
		var i;
		str = log[file] + str;
		while ((i = str.indexOf("\n")) != -1) {
			if (file == 1) {
				console.log(str.slice(0, i));
			} else {
				console.info(str.slice(0, i));	
			}
			str = str.slice(i + 1);
		}
		log[file] = str;
	};

	var symbol_table_entry;


	var symbol_table = (function() {

		//Internal Constructor
		function symbol_table() {
			this.table = {
				functions : {},
				types : {},
				variables : {}
			};
		}
		
		//public:	
		symbol_table.push_scope = function() {	
		}
		
		symbol_table.pop_scope = function() {
		}
		
		symbol_table.name_declared_this_scope = function(name) {	
		}
		
		symbol_table.add_variable = function(v) {	
		}
	
		symbol_table.add_type = function(name, t) {
			
		}
		
		symbol_table.add_function = function(f) {
			debugger;
			this.table.functions;
		}
		
		symbol_table.add_global_function = function(f) {
			
		}
		
		symbol_table.get_variable = function(name) {
			
		}
		
		symbol_table.get_type = function(name) {
			
		}
		
		symbol_table.get_function = function(name) {
			
		}
		
		//private:
		symbol_table.get_entry = function(name) {
			
		}

		//External Constructor
		function Constructor() {
			symbol_table.apply(this);
		}

		//Class Inheritance
		Constructor.prototype = symbol_table;

		return Constructor;	
	
	})();



	var parse_state = function() {

		this.scanner = null;
		this.translation_unit = [];
		this.symbols = new symbol_table();
		this.es_shader = false;
		this.language_version = 0;
		this.version_string = null;
		this.target = null;
		
		this.Const = {
			/* 1.10 */
			MaxLights : 0,
			MaxClipPlanes : 0,
			MaxTextureUnits : 0,
			MaxTextureCoords : 0,
			MaxVertexAttribs : 0,
			MaxVertexUniformComponents : 0,
			MaxVaryingFloats : 0,
			MaxVertexTextureImageUnits : 0,
			MaxCombinedTextureImageUnits : 0,
			MaxTextureImageUnits : 0,
			MaxFragmentUniformComponents : 0,
			
			/* ARB_draw_buffers */
			MaxDrawBuffers : 0,
			
			/**
			* Set of GLSL versions supported by the current context
			*
			* Knowing that version X is supported doesn't mean that versions before
			* X are also supported.  Version 1.00 is only supported in an ES2
			* context or when GL_ARB_ES2_compatibility is supported.  In an OpenGL
			* 3.0 "forward compatible" context, GLSL 1.10 and 1.20 are \b not
			* supported.
			*/
			/*@{*/
			GLSL_100ES : 1,
			GLSL_110 : 2,
			GLSL_120 : 4,
			GLSL_130 : 8
		};


		/**
		* During AST to IR conversion, pointer to current IR function
		*
		* Will be \c NULL whenever the AST to IR conversion is not inside a
		* function definition.
		*/
		this.current_function = null;
		
		/** Have we found a return statement in this function? */
		this.found_return = false;
		
		/** Was there an error during compilation? */
		this.error = false;
		
		/**
		* Are all shader inputs / outputs invariant?
		*
		* This is set when the 'STDGL invariant(all)' pragma is used.
		*/
		this.all_invariant = false;
		
		/** Loop or switch statement containing the current instructions. */
		this.loop_or_switch_nesting = null;
		this.loop_or_switch_nesting_ast = null;
		
		this.user_structures = null;
		this.num_user_structures = 0;
		this.info_log = null;
		
		/**
		* \name Enable bits for GLSL extensions
		*/
		/*@{
		unsigned ARB_draw_buffers_enable:1;
		unsigned ARB_draw_buffers_warn:1;
		unsigned ARB_explicit_attrib_location_enable:1;
		unsigned ARB_explicit_attrib_location_warn:1;
		unsigned ARB_fragment_coord_conventions_enable:1;
		unsigned ARB_fragment_coord_conventions_warn:1;
		unsigned ARB_texture_rectangle_enable:1;
		unsigned ARB_texture_rectangle_warn:1;
		unsigned EXT_texture_array_enable:1;
		unsigned EXT_texture_array_warn:1;
		unsigned ARB_shader_stencil_export_enable:1;
		unsigned ARB_shader_stencil_export_warn:1;
		/*@}*/
		
		/** Extensions supported by the OpenGL implementation. */
		this.gl_extensions = null;
		
		/** Shaders containing built-in functions that are used for linking. */
		this.buultins_to_link = new Array(16);
		this.num_builtines_to_link = 0;
	};

	var state = new parse_state();
	state.es_shader = true;
	state.language_version = 110;


	var token;

	var copy = function(target, source) {
		for (var i in target) {
			delete target[i];
		}
		for (var i in source) {
			target[i] = source[i];	
		}
		return target;
	};

	var next_token = function(p_yylval, yylloc, scanner) {
		lexer.yylval = {};

		var result = lexer.lex();
		if (result == 1) {
			result = 0; //YYEOF	
		}

		//references reset in lexer, copy properties into our object
		copy(yylloc, lexer.yylloc);
		copy(p_yylval, lexer.yylval);
		return result;
	};

	var print_token_value = function(yyoutput, yytoknum, yyvaluep) {
		fprintf(2, JSON.stringify(yyvaluep).replace(/"/g, ''));
	}

	var print_error = function(yylloc, state, error) {
		compiler.errors.push(error + " at line " + yylloc.first_line + " column " + yylloc.first_column);
	};


	var initialize_types = function(state) {
		
	}


	var compiler = {

		errors : [],

		//expose to lexer/parser
		symbol_table : symbol_table,
		state : state,
		token : token,
		parseError : function(str, hash) {
			yyerror(lexer.yylloc, state, str);
		},

		setPreprocessor : function(p) {
			this.preprocessor = preprocessor = p;
		},

		setLexer : function(l) {
			this.lexer = lexer = l;
			l.yy = this;
			lexer_extern(l);
			state.scanner = l;
		},

		setParser : function(p) {
			this.parser = parser = p;
			p.yy = this;

			this.parser.extern('yylex', next_token);
			this.parser.extern('yyerror', print_error);
			this.parser.extern('printf', printf);
			this.parser.extern('fprintf', fprintf);
			this.parser.extern('YYPRINT', print_token_value);
			this.parser.extern('YYFPRINTF', fprintf);
			this.parser.extern('initialize_types', initialize_types);

			this.token = p.yytokentype;			
		},
 
		compile : function(src) {
			src = preprocessor.process(src);
			lexer.setInput(src);
			var result = parser.yyparse(state);
			return result;
		}
	}
	
	return compiler;
})();




