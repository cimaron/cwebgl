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
 * objCode class
 */
(function(glsl) {

	//Internal Constructor
	function Initializer() {
		//public:
		this.vars = null;
		this.code = [];
		this.last = null;
	}

	var objCode = jClass('objCode', Initializer);

	//public:

	objCode.objCode = function() {
		this.vars = {
			uniform : [],
			attribute : [],
			varying : [],
		};
	};

	objCode.varUsed = function(name, type) {
		if (this.vars[type].indexOf(name) == -1) {
			this.vars[type].push(name);	
		}
	};
	
	objCode.get = function(i) {
		return this.code[i];	
	};

	objCode.push = function(ir) {
		this.code.push(ir);
		this.last = ir;
	};

	objCode.toString = function() {
		return this.code.join("\n");
	};

	glsl.objCode = objCode.Constructor;

}(glsl));

