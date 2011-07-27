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
	
	var yylex = function(_yylval, yylloc, scanner) {
		parser.yylval = copy(yylval, _yylval);
		var result = lexer.lex();
		if (result == 1) {
			result = 0; //YYEOF	
		}
		copy(yylloc, lexer.yylloc);
		return result;
	};

	var yyerror = function(yylloc, state, error) {
		compiler.errors.push(error + " at line " + yylloc.first_line + " column " + yylloc.first_column);
	};

	var YYPRINT = function(yyoutput, yytoknum, yyvaluep) {
		//object or child has print method
		if (yyvaluep.print) {
			yyvaluep.print();
			return;
		}

		if (typeof yyvaluep == 'object') {
			for (var i in yyvaluep) {
				if (yyvaluep[i] && yyvaluep[i].print) {
					YYPRINT(yyoutput, yytoknum, yyvaluep[i]);
					return;
				}
			}
		}

		if (JSON.stringify) {
			fprintf(stdout, JSON.stringify(yyvaluep, null, 4));
		} else {
			fprintf(stdout, yyvaluep + "");
			//console.log(yyvaluep);
		}
	}



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
			this.parser.extern('yylex', yylex);
			this.parser.extern('yyerror', yyerror);
			this.parser.extern('YYPRINT', YYPRINT);
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




