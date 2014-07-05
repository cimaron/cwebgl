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

function glsl_state(options) {

	this.options = util._extend({
		target : 0,
		language_version : 100,
	}, options);

	this.symbols = new SymbolTable();
	this.translation_unit = [];

	this.info_log = [];
	this.error = false;
}

proto = glsl_state.prototype = {};

/**
 * Get identifier type
 *
 * @param   object   state   GLSL state
 * @param   string   name    Identifier name
 *
 * @return  string
 */
proto.classify_identifier = function(name) {
	if (this.symbols.get_variable(name) || this.symbols.get_function(name)) {
		return 'IDENTIFIER';
	} else if (this.symbols.get_type(name)) {
		return 'TYPE_IDENTIFIER';
	} else {
		return 'NEW_IDENTIFIER';
	}
};


proto.addError = function(err, location) {
	this.error = true;
	if (location) {
		err = util.format("%u(%u): %s", location.first_line, location.first_column, err);
	}
	this.info_log.push(err);
};


/**
 * Jison parser compatibility
 */
glsl.parse = function(src, options) {
	var result, state;

	state = new glsl_state(options);

	symbol_table_init(state);

	parser.yy =  {
		test : 1,
		state : state
	};

	result = parser.parse(src);
	if (!result) {
		state.error = true;	
	}

	return state;
};
	
