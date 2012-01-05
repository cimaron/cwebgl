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

	/**
	 * Preprocesses a source string
	 *
	 * @param   string      The source
	 *
	 * @return  string
	 */
	function preprocess(source) {
		var output, s, e;
	
		//pretty basic, just want to make it work for right now

		//remove preprocessor directives
		output = source.replace(/[ \t]*\#[^\n]+/g, '');

		//remove single-line comments
		output = output.replace(/\/\/[^\n]*/g, '');

		//remove multi-line comments
		while ((s = output.indexOf("/*")) != -1) {
			if ((e = output.indexOf("*/", s + 2)) == -1) {
				glsl.errors.push("Unterminated comment");
				return false;
			}
			output = output.slice(0, s) + output.slice(e + 2);
		}

		return output;
	}
	
	/**
	 * External interface
	 */

	glsl.preprocess = preprocess;

}(glsl));

