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
		this.d = null;
		this.op = null;
		this.s1 = null;
		this.s2 = null;
	}

	var IR = jClass('IR', Initializer);

	//static:
	var count = 1;
	function getNextRegister(n) {
		return n + count++;
	}

	var lbl = 0;
	IR.Constructor.genLabel = function() {
		return 'lbl' + lbl++;
	};

	//public:

	IR.IR = function(op, d, s1, s2, gen) {
		this.op = op;
		this.s1 = s1;
		this.s2 = s2;
		if (d) {
			this.d = d;	
		} else if (gen) {
			this.d = getNextRegister(gen);				
		}
	};

	IR.toString = function() {
		var out;
		out = glsl.sprintf("%s %s%s%s",
			this.op,
			this.d || '',
			this.s1 ? ', ' + this.s1 : '',
			this.s2 ? ', ' + this.s2 : ''
			);
		return out;
	};

	glsl.IR = IR.Constructor;

}(glsl));

