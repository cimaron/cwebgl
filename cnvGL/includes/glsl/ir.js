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
(function(glsl, StdIO) {

	/**
	 * IR Class
	 *
	 * Stores intermediate representation (3-address code)
	 */	
	var IR = (function() {

		//Internal Constructor
		function Initializer() {
			//public:
			this.d = null;
			this.op = null;
			this.s1 = null;
			this.s2 = null;
		}
	
		var IR = jClass('IR', Initializer);
	
		//private:

		function parseOperand(name) {
			var n, obj, i, c;
			
			if (!name) {
				return;	
			}

			obj = {
				name : name,
				swizzle : "",
				comp : [0,1,2,3]
			};

			if (n = name.match(/(.*)(\.([xyzw]+))/)) {
				obj.name = n[1];
				obj.swizzle = n[3];
				obj.comp = obj.swizzle.split("");
				for (i = 0; i < obj.comp.length; i++) {
					obj.comp[i] = "xyzw".indexOf(obj.comp[i]);
				}
			}

			return obj;
		};

		//public:
	
		IR.IR = function(op, d, s1, s2, gen) {
			this.op = op;
			this.s1 = s1;
			this.s2 = s2;
			if (d) {
				this.d = d;
			} else if (gen) {
				this.d = IRS.getTemp(gen);				
			}
		};

		IR.getDest = function(obj) {
			return obj ? parseOperand.call(this, this.d) : this.d;
		};

		IR.getSrc1 = function(obj) {
			return obj ? parseOperand.call(this, this.s1) : this.s1;
		};

		IR.getSrc2 = function(obj) {
			return obj ? parseOperand.call(this, this.s2) : this.s2;
		};

		IR.toString = function() {
			var out;
			out = StdIO.sprintf("%s%s%s%s",
				this.op,
				this.d  ? ' '  + this.d  : '',
				this.s1 ? ', ' + this.s1 : '',
				this.s2 ? ', ' + this.s2 : ''
				);
			return out;
		};

		return IR.Constructor;
	}());


	/**
	 * IRS Class
	 *
	 * Stores IR code tree
	 */	
	var IRS = (function() {

		//Internal Constructor
		function Initializer() {
			//public:
			this.code = [];
			this.last = null;
		}

		var IRS = jClass('IRS', Initializer);

		//static:
		var count = 1;
		IRS.getTemp = function(n) {
			return n + count++;
		}

		//public:

		IRS.IRS = function() {
		};

		IRS.get = function(i) {
			return this.code[i];	
		};
	
		IRS.push = function(ir) {
			this.code.push(ir);
			this.last = ir;
		};
	
		IRS.toString = function() {
			return this.code.join("\n");
		};

		return IRS.Constructor;
	}());

	/**
	 * External interface
	 */
	glsl.IR = IR;
	glsl.IRS = IRS;

}(glsl, StdIO));

