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
 * Interface WebGLShader
 *
 * @param   WebGLRenderingContext   context   The rendering context
 * @param   int                     type      The shader type (FRAGMENT_SHADER, VERTEX_SHADER)
 */
function cWebGLShader(context, type) {

	cWebGLObject.apply(this, arguments);

	this._type = type;
	this._source = '';
	this._isValid = false;

	cnvgl.setContext(context._context);
	this.setObject(cnvgl.createShader(type));
}

util.inherits(cWebGLShader, cWebGLObject);
var proto = cWebGLShader.prototype;

/**
 * Get shader type
 *
 * @protected
 *
 * @return  int
 */
proto.getType = function() {
	return this._type;
};

/**
 * Get shader source
 *
 * @protected
 *
 * @return  string
 */
proto.getSource = function() {
	return this._source;	
};

/**
 * Set shader source
 *
 * @protected
 *
 * @param   string   source   The shader source
 */
proto.setSource = function(source) {
	this._source = source;
};

/**
 * Get valid status
 *
 * @protected
 *
 * @return  bool
 */
proto.isValid = function() {
	return this._isValid;
};

/**
 * Set valid status
 *
 * @protected
 *
 * @param   bool   valid   Status
 */
proto.isValid = function(valid) {
	this._isValid = valid;
};

