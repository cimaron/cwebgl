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
 * IR class
 */
(function(glsl) {

	//Internal Constructor
	function Initializer() {
		//public:
		this.node = null;
		this.d = null;
		this.op = null;
		this.s1 = null;
		this.s2 = null;

		//single link-list
		this.prev = null;
	}

	var IR = jClass('IR', Initializer);

	//static:
	var count = 1;
	function getNext() {
		return count++;	
	}

	//public:

	IR.IR = function(node, op, s1, s2) {
		this.node = node;
		this.op = op;
		this.s1 = s1;
		this.s2 = s2;
		this.d = getNext();
	};

	IR.toString = function() {
		var out;
		out = this.prev ? this.next.toString() : '';
		out += glsl.sprintf("%s t%s %s %s\n", this.op, this.d || '', this.s1 || '', this.s2 || '');
		return out;
	};

	IR.add = function(next) {
		next.prev = this;
		return next;
	};

	glsl.IR = IR.Constructor;

}(glsl));

