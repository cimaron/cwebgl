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
CONNECTION WITH THE SOFTWARE OR THE USE		 OR OTHER DEALINGS IN THE SOFTWARE.
*/


/**
 * Code class
 */
(function(glsl) {

	/**
	 * Returns indentation for the current scope
	 *
	 * @return  string
	 */
	function g_indent() {
		return new Array(glsl.generator.depth + 1).join("\t");
	}

	//Internal Constructor
	function Initializer() {
		//public:
		this.code = null;
		this.type = null;
		this.type_name = null;
		this.ast_node = null;
	}

	var objCode = jClass('objCode', Initializer);

	//public:

	objCode.objCode = function(code, type, ast_node) {
		this.code = "";
		if (code) {
			this.addCode(code);
		}
		this.setType(type);
		this.ast_node = ast_node;
	};

	objCode.setType = function(type) {
		this.type = type;
		this.type_name = glsl.type.names[type];
	};

	objCode.toString = function() {
		return this.code;
	};

	objCode.addCode = function(c) {
		this.code += c.toString();
	};

	objCode.addLine = function(l) {
		this.code +=
			  g_indent()
			+ l.toString()
			+ "\n";
	};

	objCode.apply = function() {
		Array.prototype.unshift.call(arguments, this.code);
		this.code = glsl.sprintf.apply(glsl, arguments);
	};

	glsl.objCode = objCode.Constructor;

}(glsl));

