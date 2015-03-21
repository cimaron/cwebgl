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


/**
 * Interface WebGLUniformLocation
 *
 * @param   cWebGLProgram   program    The program
 * @param   int             location   The location
 * @param   int             type       The type
 */
function cWebGLUniformLocation(program, location, type) {

	this._program = program;
	this._location = location;
	this._type = type;

	this._linkCount = this._program.getLinkCount();
}

var proto = cWebGLUniformLocation.prototype;

/**
 * Get program
 *
 * @protected
 *
 * @return   mixed
 */
proto.program = function() {

	if (this._program.getLinkCount() != this._linkCount) {
		return 0;
	}

	return this._program;
};

/**
 * Get location
 *
 * @protected
 *
 * @return   mixed
 */
proto.location = function() {

	if (this._program.getLinkCount() != this._linkCount) {
		throw new Error("Uniform no longer valid");	
	}

	return this._location;
};

/**
 * Get type
 *
 * @protected
 *
 * @return   mixed
 */
proto.type = function() {

	if (this._program.getLinkCount() != this._linkCount) {
		throw new Error("Uniform no longer valid");	
	}

	return this._type;
};

