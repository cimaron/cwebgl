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

var util = require('util');

function glsl_state(options) {

	this.options = util._extend({
		target : 0,
		language_version : 100,
	});

	this.symbols = new symbol.SymbolTable();
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
}






proto.error = function(locp, err) {
	this.error = true;
	this.info_log.push(
		util.format("%u:%u(%u): error: ", locp.source, locp.first_line, locp.first_column) +
		err ? util.format.apply(arguments.slice(1)) : "");
}





/**
 * Jison parser compatibility
 */
function parse(src, options) {

	var state = new glsl_state(options);

	parser.yy =  {
		test : 1,
		state : state
	};

	result = parser.parse(src);
	if (!result) {
		state.error = true;	
	}

	return state;
}



module.exports.compile = parse;