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


cWebGLShader = (function() {
	
	function Initializer() {
		cWebGLObject.Initializer.apply(this);
		//public:
		this._type = null;
		this._source = null;
	}

	var cWebGLShader = jClass('cWebGLShader', Initializer, cWebGLObject);

	//public:

	cWebGLShader.cWebGLShader = function(context, type) {
		this.cWebGLObject(context);
		this._type = type;
		this._source = '';
		this.setObject(this.context().graphicsContext3D().createShader(type));
	};

	cWebGLShader.getType = function() {
		return this._type;
	};

	cWebGLShader.getSource = function() {
		return this._source;	
	};

	cWebGLShader.setSource = function(/*DOMString*/ source) {
		this._source = source;
	};

	return cWebGLShader.Constructor;

}());

