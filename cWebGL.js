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


var cWebGLRenderingContext;

(function() {

	//@todo: implement per spec (2.1)
	function getContext(ctx, skip) {
		if (ctx == 'experimental-webgl' && !skip) {
			return cWebGLRenderingContext.create(this);
		}
		return this._getContext(ctx);
	}

	function getElementById(id) {
		var el = document._getElementById(id);
		if (el && el.getContext) {
			el._getContext = el.getContext;
			el.getContext = getContext;
		}
		return el;		
	}

	document._getElementById = document.getElementById;
	document.getElementById = getElementById;

}());

