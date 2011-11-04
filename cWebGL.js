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

(function() {

	var getNativeContext, i, validContext, hasCanvas, hasWebGL, current;

	validContext = ["webgl","experimental-webgl"];
	hasCanvas = (typeof HTMLCanvasElement != "undefined");
	current = [];

	for (i = 0; i < validContext.length; i++) {
		try {
			if (document.createElement("canvas").getContext(validContext[i])) {
				hasWebGL = true;
			}
		} catch (e) {
		}
	}

	if (hasCanvas && !hasWebGL) {
		getNativeContext = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function(contextId, config, nativeCtx) {
			if (validContext.indexOf(contextId) !== -1 && !nativeCtx) {
				if (!current[this]) {
					current[this] = cWebGLRenderingContext.create(this, new cWebGLContextAttributes(config));
				}
				return current[this];
			}
			return getNativeContext.call(this, contextId);
		};
	}

	if (typeof WebGLRenderingContext != 'undefined') {
		WebGLRenderingContext.prototype.setTargetFps = function() {};
		WebGLRenderingContext.native = true;
	} else {
		window.WebGLRenderingContext = cWebGLRenderingContext;
	}

}());

