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

(function(cnvgl) {


	function cnvgl_get(pname, params) {
		switch (pname) {
			case cnvgl.MAX_VERTEX_ATTRIBS:
				params[0] = GPU.shader.MAX_VERTEX_ATTRIBS;
				return;
			case cnvgl.MAX_FRAGMENT_UNIFORM_COMPONENTS:
				params[0] = GPU.shader.MAX_FRAGMENT_UNIFORM_COMPONENTS;
				return;
			default:
				console.log('glGet(): pname not implemented yet', pname);
		}
	}


	/**
	 * glGetError — return error information
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGetError.xml
	 */
	cnvgl.getError = function() {
		var ctx, error;
		ctx = cnvgl.getCurrentContext();
		error = ctx.errorValue;
		ctx.errorValue = cnvgl.NO_ERROR;
		return error;
	};

	
	/**
	 * glGet — return the value or values of a selected parameter
	 *
	 * @var GLenum       pname   Specifies the parameter value to be returned. The symbolic constants in the list below are accepted.
	 * @var [GLboolean]  params  Returns the value or values of the specified parameter.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGet.xml
	 */
	cnvgl.getBooleanv = function(pname, params) {
		cnvgl_get(pname, params);
		params[0] = (params[0] == 0.0 ? cnvgl.FALSE : cnvgl.TRUE);
	};


	/**
	 * glGet — return the value or values of a selected parameter
	 *
	 * @var GLenum      pname   Specifies the parameter value to be returned. The symbolic constants in the list below are accepted.
	 * @var [GLdouble]  params  Returns the value or values of the specified parameter.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGet.xml
	 */
	cnvgl.getDoublev = function(pname, params) {
		cnvgl_get(pname, params);
		if (typeof params[0] == 'boolean') {
			params[0] = params[0] ? cnvgl.TRUE : cnvgl.FALSE;	
		}
	};


	/**
	 * glGet — return the value or values of a selected parameter
	 *
	 * @var GLenum     pname   Specifies the parameter value to be returned. The symbolic constants in the list below are accepted.
	 * @var [GLfloat]  params  Returns the value or values of the specified parameter.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGet.xml
	 */
	cnvgl.getFloatv = function(pname, params) {
		cnvgl_get(pname, params);
		if (typeof params[0] == 'boolean') {
			params[0] = params[0] ? cnvgl.TRUE : cnvgl.FALSE;	
		}
	};


	/**
	 * glGet — return the value or values of a selected parameter
	 *
	 * @var GLenum   pname   Specifies the parameter value to be returned. The symbolic constants in the list below are accepted.
	 * @var [GLint]  params  Returns the value or values of the specified parameter.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGet.xml
	 */
	cnvgl.getIntegerv = function(pname, params) {
		cnvgl_get(pname, params);
		if (typeof params[0] == 'boolean') {
			params[0] = params[0] ? cnvgl.TRUE : cnvgl.FALSE;	
		} else {
			params[0] = Math.round(params[0]);
		}
	};


}(cnvgl));

