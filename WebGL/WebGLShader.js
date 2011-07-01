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


//----------------------------------------------------------------------------------------
//	class WebGLShader
//----------------------------------------------------------------------------------------

function cWebGLShader(context, /*GLenum*/ type) {	

	//members
	this._type = null;
	this._source = null;
	
	//Call constructor
	this.construct(context, type);
}

//----------------------------------------------------------------------------------------
//	Class Magic
//----------------------------------------------------------------------------------------

__WebGLShader =  new cWebGLObject().extend('cWebGLShader');
cWebGLShader.prototype = __WebGLShader;

//----------------------------------------------------------------------------------------
//	Methods
//----------------------------------------------------------------------------------------

__WebGLShader.cWebGLShader = function(context, type) {
	this.cWebGLObject(context);
	this._type = type;
	this._source = '';
	this.setObject(this.context().graphicsContext3D().createShader(type));
}

//public:

__WebGLShader.getType = function() {
	return this._type;
}

__WebGLShader.getSource = function() {
	return this._source;	
}

__WebGLShader.setSource = function(/*DOMString*/ source) {
	this._source = source;
}

//private:

