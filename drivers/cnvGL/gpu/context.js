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


(function(GPU) {

	GPU.Context = function() {
		this.activeVarying = [];
		this.blendEnabled = cnvgl.FALSE;
		this.blendDestA = cnvgl.ZERO;
		this.blendDestRGB = cnvgl.ZERO;
		this.blendEquationA = cnvgl.FUNC_ADD;
		this.blendEquationRGB = cnvgl.FUNC_ADD;
		this.blendSrcA = cnvgl.ONE;
		this.blendSrcRGB = cnvgl.ONE;
		this.clearColor = null;
		this.clearDepth = null;
		this.colorBuffer = null;
		this.colorMask = [0xFF, 0xFF, 0xFF, 0xFF];
		this.cullFlag = cnvgl.FALSE;
		this.cullFrontFace = cnvgl.CCW;
		this.cullFaceMode = cnvgl.BACK;
		this.depthBuffer = null;
		this.depthFunc = cnvgl.LESS;
		this.depthMask = cnvgl.TRUE;
		this.depthTest = null;
		this.viewportF = 1;
		this.viewportH = 0;
		this.viewportN = 0;
		this.viewportW = 0;
		this.viewportX = 0;
		this.viewportY = 0;
	};

}(GPU));

