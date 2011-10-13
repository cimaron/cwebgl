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

/* Jison generated lexer */
var lexer = (function () {
	var lexer = ({
		EOF: 1,
		parseError: function parseError(str, hash) {
			if (this.yy.parseError) {
				this.yy.parseError(str, hash);
			} else {
				throw new Error(str);
			}
		},
		setInput: function (input) {
			this._input = input;
			this._more = this._less = this.done = false;
			this.yylineno = this.yyleng = 0;
			this.yytext = this.matched = this.match = '';
			this.conditionStack = ['INITIAL'];
			this.yylloc = {
				first_line: 1,
				first_column: 0,
				last_line: 1,
				last_column: 0
			};
			return this;
		},
		input: function () {
			var ch = this._input[0];
			this.yytext += ch;
			this.yyleng++;
			this.match += ch;
			this.matched += ch;
			var lines = ch.match(/\n/);
			if (lines) this.yylineno++;
			this._input = this._input.slice(1);
			return ch;
		},
		unput: function (ch) {
			this._input = ch + this._input;
			return this;
		},
		more: function () {
			this._more = true;
			return this;
		},
		pastInput: function () {
			var past = this.matched.substr(0, this.matched.length - this.match.length);
			return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
		},
		upcomingInput: function () {
			var next = this.match;
			if (next.length < 20) {
				next += this._input.substr(0, 20 - next.length);
			}
			return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
		},
		showPosition: function () {
			var pre = this.pastInput();
			var c = new Array(pre.length + 1).join("-");
			return pre + this.upcomingInput() + "\n" + c + "^";
		},
		next: function () {
			if (this.done) {
				return this.EOF;
			}
			if (!this._input) this.done = true;

			var token, match, col, lines;
			if (!this._more) {
				this.yytext = '';
				this.match = '';
			}
			var rules = this._currentRules();
			for (var i = 0; i < rules.length; i++) {
				match = this._input.match(this.rules[rules[i]]);
				if (match) {
					lines = match[0].match(/\n.*/g);
					if (lines) this.yylineno += lines.length;
					this.yylloc = {
						first_line: this.yylloc.last_line,
						last_line: this.yylineno + 1,
						first_column: this.yylloc.last_column,
						last_column: lines ? lines[lines.length - 1].length - 1 : this.yylloc.last_column + match[0].length
					};
					this.yytext += match[0];
					this.match += match[0];
					this.matches = match;
					this.yyleng = this.yytext.length;
					this._more = false;
					this._input = this._input.slice(match[0].length);
					this.matched += match[0];
					token = this.performAction.call(this, this.yy, this, rules[i], this.conditionStack[this.conditionStack.length - 1]);
					if (token) return token;
					else return;
				}
			}
			if (this._input === "") {
				return this.EOF;
			} else {
				this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
					text: "",
					token: null,
					line: this.yylineno
				});
			}
		},
		lex: function lex() {
			var r = this.next();
			if (typeof r !== 'undefined') {
				return r;
			} else {
				return this.lex();
			}
		},
		begin: function begin(condition) {
			this.conditionStack.push(condition);
		},
		popState: function popState() {
			return this.conditionStack.pop();
		},
		_currentRules: function _currentRules() {
			return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
		}
	});
	lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {

		var YYSTATE = YY_START;
		switch ($avoiding_name_collisions) {
		case 0:
			/* Preprocessor tokens. */
			break;
		case 1:
			break;
		case 2:
			this.begin('PP');
			return yy.token.VERSION;
			break;
		case 3:
			this.begin('PP');
			return yy.token.EXTENSION;
			break;
		case 4:
			/* Eat characters until the first digit is
			 * encountered
			 */
			var ptr = 0;
			while (yy_.yytext.slice(0, 1) < '0' || yy_.yytext.slice(0, 1) > '9')
			ptr++;

			/* Subtract one from the line number because
			 * yy_.yylineno is zero-based instead of
			 * one-based.
			 */
			yy_.yylineno = parseInt(yy_.yytext.slice(0, 1), 10) - 1;
			yylloc.source = parseInt(yy_.yytext.slice(0), 10);

			break;
		case 5:
			/* Eat characters until the first digit is
			 * encountered
			 */
			var ptr = 0;
			while (yy_.yytext.slice(0, 1) < '0' || yy_.yytext.slice(0, 1) > '9')
			ptr++;

			/* Subtract one from the line number because
			 * yy_.yylineno is zero-based instead of
			 * one-based.
			 */
			yy_.yylineno = parseInt(yy_.yytext.slice(0, 1), 10) - 1;

			break;
		case 6:
			this.begin('PP');
			return yy.token.PRAGMA_DEBUG_ON;

			break;
		case 7:
			this.begin('PP');
			return yy.token.PRAGMA_DEBUG_OFF;

			break;
		case 8:
			this.begin('PP');
			return yy.token.PRAGMA_OPTIMIZE_ON;

			break;
		case 9:
			this.begin('PP');
			return yy.token.PRAGMA_OPTIMIZE_OFF;

			break;
		case 10:
			this.begin('PP');
			return yy.token.PRAGMA_INVARIANT_ALL;

			break;
		case 11:
			this.begin('PRAGMA');
			break;
		case 12:
			this.begin('INITIAL');
			yy_.yylineno++;
			yycolumn = 0;
			break;
		case 13:
			break;
		case 14:
			break;
		case 15:
			break;
		case 16:
			return yy.token.COLON;
			break;
		case 17:
			yylval.identifier = strdup(yy_.yytext);
			return yy.token.IDENTIFIER;

			break;
		case 18:
			yylval.n = parseInt(yy_.yytext);
			return yy.token.INTCONSTANT;

			break;
		case 19:
			this.begin('INITIAL');
			yy_.yylineno++;
			yycolumn = 0;
			return yy.token.EOL;
			break;
		case 20:
			/*yy_.yylineno++; yycolumn = 0;*/
			break;
		case 21:
			return yy.token.ATTRIBUTE;
			break;
		case 22:
			return yy.token.CONST_TOK;
			break;
		case 23:
			return yy.token.BOOL_TOK;
			break;
		case 24:
			return yy.token.FLOAT_TOK;
			break;
		case 25:
			return yy.token.INT_TOK;
			break;
		case 26:
			return this.KEYWORD(130, 130, UINT_TOK);
			break;
		case 27:
			return yy.token.BREAK;
			break;
		case 28:
			return yy.token.CONTINUE;
			break;
		case 29:
			return yy.token.DO;
			break;
		case 30:
			return yy.token.WHILE;
			break;
		case 31:
			return yy.token.
			ELSE;
			break;
		case 32:
			return yy.token.FOR;
			break;
		case 33:
			return yy.token.IF;
			break;
		case 34:
			return yy.token.DISCARD;
			break;
		case 35:
			return yy.token.RETURN;
			break;
		case 36:
			return yy.token.BVEC2;
			break;
		case 37:
			return yy.token.BVEC3;
			break;
		case 38:
			return yy.token.BVEC4;
			break;
		case 39:
			return yy.token.IVEC2;
			break;
		case 40:
			return yy.token.IVEC3;
			break;
		case 41:
			return yy.token.IVEC4;
			break;
		case 42:
			return this.KEYWORD(130, 130, UVEC2);
			break;
		case 43:
			return this.KEYWORD(130, 130, UVEC3);
			break;
		case 44:
			return this.KEYWORD(130, 130, UVEC4);
			break;
		case 45:
			return yy.token.VEC2;
			break;
		case 46:
			return yy.token.VEC3;
			break;
		case 47:
			return yy.token.VEC4;
			break;
		case 48:
			return yy.token.MAT2X2;
			break;
		case 49:
			return yy.token.MAT3X3;
			break;
		case 50:
			return yy.token.MAT4X4;
			break;
		case 51:
			return this.KEYWORD(120, 120, MAT2X2);
			break;
		case 52:
			return this.KEYWORD(120, 120, MAT2X3);
			break;
		case 53:
			return this.KEYWORD(120, 120, MAT2X4);
			break;
		case 54:
			return this.KEYWORD(120, 120, MAT3X2);
			break;
		case 55:
			return this.KEYWORD(120, 120, MAT3X3);
			break;
		case 56:
			return this.KEYWORD(120, 120, MAT3X4);
			break;
		case 57:
			return this.KEYWORD(120, 120, MAT4X2);
			break;
		case 58:
			return this.KEYWORD(120, 120, MAT4X3);
			break;
		case 59:
			return this.KEYWORD(120, 120, MAT4X4);
			break;
		case 60:
			return yy.token.IN_TOK;
			break;
		case 61:
			return yy.token.OUT_TOK;
			break;
		case 62:
			return yy.token.INOUT_TOK;
			break;
		case 63:
			return yy.token.UNIFORM;
			break;
		case 64:
			return yy.token.VARYING;
			break;
		case 65:
			return this.KEYWORD(120, 120, CENTROID);
			break;
		case 66:
			return this.KEYWORD([120, 1], [120, 1], INVARIANT, true, true);
			break;
		case 67:
			return this.KEYWORD([130, 1], 130, FLAT);
			break;
		case 68:
			return this.KEYWORD(130, 130, SMOOTH);
			break;
		case 69:
			return this.KEYWORD(130, 130, NOPERSPECTIVE);
			break;
		case 70:
			return yy.token.SAMPLER1D;
			break;
		case 71:
			return yy.token.SAMPLER2D;
			break;
		case 72:
			return yy.token.SAMPLER3D;
			break;
		case 73:
			return yy.token.SAMPLERCUBE;
			break;
		case 74:
			return this.KEYWORD(130, 130, SAMPLER1DARRAY);
			break;
		case 75:
			return this.KEYWORD(130, 130, SAMPLER2DARRAY);
			break;
		case 76:
			return yy.token.SAMPLER1DSHADOW;
			break;
		case 77:
			return yy.token.SAMPLER2DSHADOW;
			break;
		case 78:
			return this.KEYWORD(130, 130, SAMPLERCUBESHADOW);
			break;
		case 79:
			return this.KEYWORD(130, 130, SAMPLER1DARRAYSHADOW);
			break;
		case 80:
			return this.KEYWORD(130, 130, SAMPLER2DARRAYSHADOW);
			break;
		case 81:
			return this.KEYWORD(130, 130, ISAMPLER1D);
			break;
		case 82:
			return this.KEYWORD(130, 130, ISAMPLER2D);
			break;
		case 83:
			return this.KEYWORD(130, 130, ISAMPLER3D);
			break;
		case 84:
			return this.KEYWORD(130, 130, ISAMPLERCUBE);
			break;
		case 85:
			return this.KEYWORD(130, 130, ISAMPLER1DARRAY);
			break;
		case 86:
			return this.KEYWORD(130, 130, ISAMPLER2DARRAY);
			break;
		case 87:
			return this.KEYWORD(130, 130, USAMPLER1D);
			break;
		case 88:
			return this.KEYWORD(130, 130, USAMPLER2D);
			break;
		case 89:
			return this.KEYWORD(130, 130, USAMPLER3D);
			break;
		case 90:
			return this.KEYWORD(130, 130, USAMPLERCUBE);
			break;
		case 91:
			return this.KEYWORD(130, 130, USAMPLER1DARRAY);
			break;
		case 92:
			return this.KEYWORD(130, 130, USAMPLER2DARRAY);
			break;
		case 93:
			return 218;
			break;
		case 94:
			return yy.token.VOID_TOK;
			break;
		case 95:
			/*copy manually*/
			break;
		case 96:
			return yy.token.INC_OP;
			break;
		case 97:
			return yy.token.DEC_OP;
			break;
		case 98:
			return yy.token.LE_OP;
			break;
		case 99:
			return yy.token.GE_OP;
			break;
		case 100:
			return yy.token.EQ_OP;
			break;
		case 101:
			return yy.token.NE_OP;
			break;
		case 102:
			return yy.token.AND_OP;
			break;
		case 103:
			return yy.token.OR_OP;
			break;
		case 104:
			return yy.token.XOR_OP;
			break;
		case 105:
			return yy.token.LEFT_OP;
			break;
		case 106:
			return yy.token.RIGHT_OP;
			break;
		case 107:
			return yy.token.MUL_ASSIGN;
			break;
		case 108:
			return yy.token.DIV_ASSIGN;
			break;
		case 109:
			return yy.token.ADD_ASSIGN;
			break;
		case 110:
			return yy.token.MOD_ASSIGN;
			break;
		case 111:
			return yy.token.LEFT_ASSIGN;
			break;
		case 112:
			return yy.token.RIGHT_ASSIGN;
			break;
		case 113:
			return yy.token.AND_ASSIGN;
			break;
		case 114:
			return yy.token.XOR_ASSIGN;
			break;
		case 115:
			return yy.token.OR_ASSIGN;
			break;
		case 116:
			return yy.token.SUB_ASSIGN;
			break;
		case 117:
			this.yylval.real = parseFloat(yy_.yytext);
			return yy.token.FLOATCONSTANT;

			break;
		case 118:
			this.yylval.real = parseFloat(yy_.yytext);
			return yy.token.FLOATCONSTANT;

			break;
		case 119:
			this.yylval.real = parseFloat(yy_.yytext);
			return yy.token.FLOATCONSTANT;;

			break;
		case 120:
			this.yylval.real = parseFloat(yy_.yytext);
			return yy.token.FLOATCONSTANT;;

			break;
		case 121:
			this.yylval.real = parseFloat(yy_.yytext);
			return yy.token.FLOATCONSTANT;;

			break;
		case 122:
			this.yylval.n = parseInt(yy_.yytext + 2, 16);
			return this.IS_UINT(yy_.yytext) ? yy.token.UINTCONSTANT : yy.token.INTCONSTANT;

			break;
		case 123:
			this.yylval.n = parseInt(yy_.yytext, 8);
			return this.IS_UINT(yy_.yytext) ? yy.token.UINTCONSTANT : yy.token.INTCONSTANT;

			break;
		case 124:
			this.yylval.n = parseInt(yy_.yytext);
			return this.IS_UINT(yy_.yytext) ? yy.token.UINTCONSTANT : yy.token.INTCONSTANT;

			break;
		case 125:
			this.yylval.n = 1;
			return yy.token.BOOLCONSTANT;

			break;
		case 126:
			this.yylval.n = 0;
			return yy.token.BOOLCONSTANT;

			break;
		case 127:
			return this.KEYWORD([110, 1], 999, yy.token.ASM);
			break;
		case 128:
			return this.KEYWORD([110, 1], 999, yy.token.CLASS);
			break;
		case 129:
			return this.KEYWORD([110, 1], 999, yy.token.UNION);
			break;
		case 130:
			return this.KEYWORD([110, 1], 999, yy.token.ENUM);
			break;
		case 131:
			return this.KEYWORD([110, 1], 999, yy.token.TYPEDEF);
			break;
		case 132:
			return this.KEYWORD([110, 1], 999, yy.token.TEMPLATE);
			break;
		case 133:
			return this.KEYWORD([110, 1], 999, yy.token.THIS);
			break;
		case 134:
			return this.KEYWORD([110, 1], 999, yy.token.PACKED_TOK);
			break;
		case 135:
			return this.KEYWORD([110, 1], 999, yy.token.GOTO);
			break;
		case 136:
			return this.KEYWORD([110, 1], 130, yy.token.SWITCH);
			break;
		case 137:
			return this.KEYWORD([110, 1], 130, yy.token.DEFAULT);
			break;
		case 138:
			return this.KEYWORD([110, 1], 999, yy.token.INLINE_TOK);
			break;
		case 139:
			return this.KEYWORD([110, 1], 999, yy.token.NOINLINE);
			break;
		case 140:
			return this.KEYWORD([110, 1], 999, yy.token.VOLATILE);
			break;
		case 141:
			return this.KEYWORD([110, 1], 999, yy.token.PUBLIC_TOK);
			break;
		case 142:
			return this.KEYWORD([110, 1], 999, yy.token.STATIC);
			break;
		case 143:
			return this.KEYWORD([110, 1], 999, yy.token.EXTERN);
			break;
		case 144:
			return this.KEYWORD([110, 1], 999, yy.token.EXTERNAL);
			break;
		case 145:
			return this.KEYWORD([110, 1], 999, yy.token.INTERFACE);
			break;
		case 146:
			return this.KEYWORD([110, 1], 999, yy.token.LONG_TOK);
			break;
		case 147:
			return this.KEYWORD([110, 1], 999, yy.token.SHORT_TOK);
			break;
		case 148:
			return this.KEYWORD([110, 1], 400, yy.token.DOUBLE_TOK);
			break;
		case 149:
			return this.KEYWORD([110, 1], 999, yy.token.HALF);
			break;
		case 150:
			return this.KEYWORD([110, 1], 999, yy.token.FIXED_TOK);
			break;
		case 151:
			return this.KEYWORD([110, 1], 999, yy.token.UNSIGNED);
			break;
		case 152:
			return this.KEYWORD([110, 1], 999, yy.token.INPUT_TOK);
			break;
		case 153:
			return this.KEYWORD([110, 1], 999, yy.token.OUTPUT);
			break;
		case 154:
			return this.KEYWORD([110, 1], 999, yy.token.HVEC2);
			break;
		case 155:
			return this.KEYWORD([110, 1], 999, yy.token.HVEC3);
			break;
		case 156:
			return this.KEYWORD([110, 1], 999, yy.token.HVEC4);
			break;
		case 157:
			return this.KEYWORD([110, 1], 400, yy.token.DVEC2);
			break;
		case 158:
			return this.KEYWORD([110, 1], 400, yy.token.DVEC3);
			break;
		case 159:
			return this.KEYWORD([110, 1], 400, yy.token.DVEC4);
			break;
		case 160:
			return this.KEYWORD([110, 1], 999, yy.token.FVEC2);
			break;
		case 161:
			return this.KEYWORD([110, 1], 999, yy.token.FVEC3);
			break;
		case 162:
			return this.KEYWORD([110, 1], 999, yy.token.FVEC4);
			break;
		case 163:
			return yy.token.SAMPLER2DRECT;
			break;
		case 164:
			return this.KEYWORD([110, 1], 999, yy.token.SAMPLER3DRECT);
			break;
		case 165:
			return yy.token.SAMPLER2DRECTSHADOW;
			break;
		case 166:
			return this.KEYWORD([110, 1], 999, yy.token.SIZEOF);
			break;
		case 167:
			return this.KEYWORD([110, 1], 999, yy.token.CAST);
			break;
		case 168:
			return this.KEYWORD([110, 1], 999, yy.token.NAMESPACE);
			break;
		case 169:
			return this.KEYWORD([110, 1], 999, yy.token.USING);
			break;
		case 170:
			return this.KEYWORD(120, [130, 1], yy.token.LOWP);
			break;
		case 171:
			return this.KEYWORD(120, [130, 1], yy.token.MEDIUMP);
			break;
		case 172:
			return this.KEYWORD(120, [130, 1], yy.token.HIGHP);
			break;
		case 173:
			return this.KEYWORD(120, [130, 1], yy.token.PRECISION);
			break;
		case 174:
			return this.KEYWORD(130, 130, yy.token.CASE);
			break;
		case 175:
			return this.KEYWORD(130, 999, yy.token.COMMON);
			break;
		case 176:
			return this.KEYWORD(130, 999, yy.token.PARTITION);
			break;
		case 177:
			return this.KEYWORD(130, 999, yy.token.ACTIVE);
			break;
		case 178:
			return this.KEYWORD([130, 1], 999, yy.token.SUPERP);
			break;
		case 179:
			return this.KEYWORD(130, 140, yy.token.SAMPLERBUFFER);
			break;
		case 180:
			return this.KEYWORD(130, 999, yy.token.FILTER);
			break;
		case 181:
			return this.KEYWORD(130, 999, yy.token.IMAGE1D);
			break;
		case 182:
			return this.KEYWORD(130, 999, yy.token.IMAGE2D);
			break;
		case 183:
			return this.KEYWORD(130, 999, yy.token.IMAGE3D);
			break;
		case 184:
			return this.KEYWORD(130, 999, yy.token.IMAGECUBE);
			break;
		case 185:
			return this.KEYWORD(130, 999, yy.token.IIMAGE1D);
			break;
		case 186:
			return this.KEYWORD(130, 999, yy.token.IIMAGE2D);
			break;
		case 187:
			return this.KEYWORD(130, 999, yy.token.IIMAGE3D);
			break;
		case 188:
			return this.KEYWORD(130, 999, yy.token.IIMAGECUBE);
			break;
		case 189:
			return this.KEYWORD(130, 999, yy.token.UIMAGE1D);
			break;
		case 190:
			return this.KEYWORD(130, 999, yy.token.UIMAGE2D);
			break;
		case 191:
			return this.KEYWORD(130, 999, yy.token.UIMAGE3D);
			break;
		case 192:
			return this.KEYWORD(130, 999, yy.token.UIMAGECUBE);
			break;
		case 193:
			return this.KEYWORD(130, 999, yy.token.IMAGE1DARRAY);
			break;
		case 194:
			return this.KEYWORD(130, 999, yy.token.IMAGE2DARRAY);
			break;
		case 195:
			return this.KEYWORD(130, 999, yy.token.IIMAGE1DARRAY);
			break;
		case 196:
			return this.KEYWORD(130, 999, yy.token.IIMAGE2DARRAY);
			break;
		case 197:
			return this.KEYWORD(130, 999, yy.token.UIMAGE1DARRAY);
			break;
		case 198:
			return this.KEYWORD(130, 999, yy.token.UIMAGE2DARRAY);
			break;
		case 199:
			return this.KEYWORD(130, 999, yy.token.IMAGE1DSHADOW);
			break;
		case 200:
			return this.KEYWORD(130, 999, yy.token.IMAGE2DSHADOW);
			break;
		case 201:
			return this.KEYWORD(130, 999, yy.token.IMAGE1DARRAYSHADOW);
			break;
		case 202:
			return this.KEYWORD(130, 999, yy.token.IMAGE2DARRAYSHADOW);
			break;
		case 203:
			return this.KEYWORD(130, 999, yy.token.IMAGEBUFFER);
			break;
		case 204:
			return this.KEYWORD(130, 999, yy.token.IIMAGEBUFFER);
			break;
		case 205:
			return this.KEYWORD(130, 999, yy.token.UIMAGEBUFFER);
			break;
		case 206:
			return this.KEYWORD(130, 999, yy.token.ROW_MAJOR);
			break;
		case 207:
			var state = yy.state;
			this.yylval.identifier = yy_.yytext;
			return this.classify_identifier(state, yy_.yytext);

			break;
		case 208:
			return yy_.yytext[0].charCodeAt(0);
			break;
		case 209:
			return 0; /*YYEOF*/
			break;
		}
	};
	lexer.rules = [/^[ \r\t]+/, /^[ \t]*#[ \t]*$/, /^[ \t]*#[ \t]*version\b/, /^[ \t]*#[ \t]*extension\b/, /^^[ \t]*[ \t]*line[ \t]+([1-9][0-9]*|[xX][0-9a-fA-F]+|[0-7]*)[ \t]+([1-9][0-9]*|[xX][0-9a-fA-F]+|[0-7]*)[ \t]*$/, /^^[ \t]*[ \t]*line[ \t]+([1-9][0-9]*|[xX][0-9a-fA-F]+|[0-7]*)[ \t]*$/, /^[ \t]*#[ \t]*pragma[ \t]+debug[ \t]*\([ \t]*on[ \t]*\)/, /^[ \t]*#[ \t]*pragma[ \t]+debug[ \t]*\([ \t]*off[ \t]*\)/, /^[ \t]*#[ \t]*pragma[ \t]+optimize[ \t]*\([ \t]*on[ \t]*\)/, /^[ \t]*#[ \t]*pragma[ \t]+optimize[ \t]*\([ \t]*off[ \t]*\)/, /^[ \t]*#[ \t]*pragma[ \t]+STDGL[ \t]+invariant[ \t]*\([ \t]*all[ \t]*\)/, /^[ \t]*#[ \t]*pragma[ \t]+/, /^[\n]/, /^./, /^\/\/[^\n]*/, /^[ \t\r]*/, /^:/, /^[_a-zA-Z][_a-zA-Z0-9]*/, /^[1-9][0-9]*/, /^[\n]/, /^[\n]/, /^attribute\b/, /^const\b/, /^bool\b/, /^float\b/, /^int\b/, /^uint\b/, /^break\b/, /^continue\b/, /^do\b/, /^while\b/, /^else\b/, /^for\b/, /^if\b/, /^discard\b/, /^return\b/, /^bvec2\b/, /^bvec3\b/, /^bvec4\b/, /^ivec2\b/, /^ivec3\b/, /^ivec4\b/, /^uvec2\b/, /^uvec3\b/, /^uvec4\b/, /^vec2\b/, /^vec3\b/, /^vec4\b/, /^mat2\b/, /^mat3\b/, /^mat4\b/, /^mat2x2\b/, /^mat2x3\b/, /^mat2x4\b/, /^mat3x2\b/, /^mat3x3\b/, /^mat3x4\b/, /^mat4x2\b/, /^mat4x3\b/, /^mat4x4\b/, /^in\b/, /^out\b/, /^inout\b/, /^uniform\b/, /^varying\b/, /^centroid\b/, /^invariant\b/, /^flat\b/, /^smooth\b/, /^noperspective\b/, /^sampler1D\b/, /^sampler2D\b/, /^sampler3D\b/, /^samplerCube\b/, /^sampler1DArray\b/, /^sampler2DArray\b/, /^sampler1DShadow\b/, /^sampler2DShadow\b/, /^samplerCubeShadow\b/, /^sampler1DArrayShadow\b/, /^sampler2DArrayShadow\b/, /^isampler1D\b/, /^isampler2D\b/, /^isampler3D\b/, /^isamplerCube\b/, /^isampler1DArray\b/, /^isampler2DArray\b/, /^usampler1D\b/, /^usampler2D\b/, /^usampler3D\b/, /^usamplerCube\b/, /^usampler1DArray\b/, /^usampler2DArray\b/, /^struct\b/, /^void\b/, /^layout\b/, /^\+\+/, /^--/, /^<=/, /^>=/, /^==/, /^!=/, /^&&/, /^\|\|/, /^\^\^/, /^<</, /^>>/, /^\*=/, /^\/=/, /^\+=/, /^%=/, /^<<=/, /^>>=/, /^&=/, /^\^=/, /^\|=/, /^-=/, /^[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?[fF]?/, /^\.[0-9]+([eE][+-]?[0-9]+)?[fF]?/, /^[0-9]+\.([eE][+-]?[0-9]+)?[fF]?/, /^[0-9]+[eE][+-]?[0-9]+[fF]?/, /^[0-9]+[fF]/, /^0[xX][0-9a-fA-F]+[uU]?/, /^0[0-7]*[uU]?/, /^[1-9][0-9]*[uU]?/, /^true\b/, /^false\b/, /^asm\b/, /^class\b/, /^union\b/, /^enum\b/, /^typedef\b/, /^template\b/, /^this\b/, /^packed\b/, /^goto\b/, /^switch\b/, /^default\b/, /^inline\b/, /^noinline\b/, /^volatile\b/, /^public\b/, /^static\b/, /^extern\b/, /^external\b/, /^interface\b/, /^long\b/, /^short\b/, /^double\b/, /^half\b/, /^fixed\b/, /^unsigned\b/, /^input\b/, /^output\b/, /^hvec2\b/, /^hvec3\b/, /^hvec4\b/, /^dvec2\b/, /^dvec3\b/, /^dvec4\b/, /^fvec2\b/, /^fvec3\b/, /^fvec4\b/, /^sampler2DRect\b/, /^sampler3DRect\b/, /^sampler2DRectShadow\b/, /^sizeof\b/, /^cast\b/, /^namespace\b/, /^using\b/, /^lowp\b/, /^mediump\b/, /^highp\b/, /^precision\b/, /^case\b/, /^common\b/, /^partition\b/, /^active\b/, /^superp\b/, /^samplerBuffer\b/, /^filter\b/, /^image1D\b/, /^image2D\b/, /^image3D\b/, /^imageCube\b/, /^iimage1D\b/, /^iimage2D\b/, /^iimage3D\b/, /^iimageCube\b/, /^uimage1D\b/, /^uimage2D\b/, /^uimage3D\b/, /^uimageCube\b/, /^image1DArray\b/, /^image2DArray\b/, /^iimage1DArray\b/, /^iimage2DArray\b/, /^uimage1DArray\b/, /^uimage2DArray\b/, /^image1DShadow\b/, /^image2DShadow\b/, /^image1DArrayShadow\b/, /^image2DArrayShadow\b/, /^imageBuffer\b/, /^iimageBuffer\b/, /^uimageBuffer\b/, /^row_major\b/, /^[_a-zA-Z][_a-zA-Z0-9]*/, /^./, /^$/];
	lexer.conditions = {
		"PRAGMA": {
			"rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209],
			"inclusive": true
		},
		"PP": {
			"rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209],
			"inclusive": true
		},
		"INITIAL": {
			"rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209],
			"inclusive": true
		}
	};
	return lexer;
})();

