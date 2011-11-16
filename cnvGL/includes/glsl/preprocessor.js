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

(function(glsl) {

	//-----------------------------------------------------------
	//External interface

	glsl.preprocessor = {

		output : '',
		status : false,
		errors : [],

		preprocess : function(source) {
			var s, e;
			
			//reinitialize
			this.status = false;
			this.errors = [];
			
			//pretty basic, just want to make it work for right now
			
			//remove preprocessor directives
			this.output = source.replace(/[ \t]*\#[^\n]+/g, '');

			//remove single-line comments
			this.output = this.output.replace(/\/\/[^\n]*/g, '');

			//remove multi-line comments
			while ((s = this.output.indexOf("/*")) != -1) {
				if ((e = this.output.indexOf("*/", s + 2)) == -1) {
					this.status = false;
					this.errors.push("Unterminated comment");
					return false;
				}
				this.output = this.output.slice(0, s) + this.output.slice(e + 2);
			}

			this.status = true;
			return true;
		}
	};

}(glsl));

