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
		var i;
		str = log[file] + str;
		while ((i = str.indexOf("\n")) != -1) {
			if (file == 2) {
				console.log(str.slice(0, i));
			} else {
				console.info(str.slice(0, i));	
			}
			str = str.slice(i + 1);
		}
		log[file] = str;
	}


	var yyextra = {
		scanner : null,
		translation_unit : [],
		symbols : {
			variables : {},
			functions : {},
			types : {}
		},
		
		es_shader : true,		
		language_version : 110,
		version_string : ''
	};

	var yylval = {};
	var token;

	var copy = function(target, source) {
		for (var i in source) {
			target[i] = source[i];	
		}
		return target;
	};

	var next_token = function(_yylval, yylloc, scanner) {
		parser.yylval = copy(yylval, _yylval);
		var result = lexer.lex();
		if (result == 1) {
			result = 0; //YYEOF	
		}
		copy(yylloc, lexer.yylloc);
		return result;
	};

	var print_node = function(yyoutput, yytoknum, yyvaluep) {
		//object or child has print method
		if (yyvaluep.print) {
			yyvaluep.print();
			return;
		}
		
		if (typeof yyvaluep == 'object') {
			for (var i in yyvaluep) {
				if (yyvaluep[i] && yyvaluep[i].print) {
					print_node(yyoutput, yytoknum, yyvaluep[i]);
					return;
				}
			}
		}
		
		if (JSON.stringify) {
			fprintf(1, JSON.stringify(yyvaluep, null, 4));
		} else {
			fprintf(1, yyvaluep + "");
			//console.log(yyvaluep);
		}		
	}

	var print_error = function(yylloc, state, error) {
		compiler.errors.push(error + " at line " + yylloc.first_line + " column " + yylloc.first_column);
	};


	var initialize_types = function(state) {
		
	}


	var compiler = {

		errors : [],

		//expose to lexer/parser
		yyextra : yyextra,		
		yylval : yylval,		
		token : token,
		parseError : function(str, hash) {
			yyerror(lexer.yylloc, yyextra, str);
		},

		setPreprocessor : function(p) {
			this.preprocessor = preprocessor = p;
		},

		setLexer : function(l) {
			this.lexer = lexer = l;
			l.yy = this;
		},

		setParser : function(p) {
			this.parser = parser = p;
			this.parser.extern('yylex', next_token);
			this.parser.extern('yyerror', print_error);
			this.parser.extern('printf', printf);
			this.parser.extern('fprintf', fprintf);
			this.parser.extern('YYPRINT', print_node);
			this.parser.extern('YYFPRINTF', fprintf);
			this.parser.extern('initialize_types', initialize_types);
			this.token = p.yytokentype;

			this.lexer.classify_identifier = p.classify_identifier;
			this.lexer.KEYWORD = p.KEYWORD;
		},
 
		compile : function(src) {
			src = preprocessor.process(src);
			lexer.setInput(src);
			var result = parser.yyparse(yyextra);
			return result;
		}
	}
	
	return compiler;
})();




