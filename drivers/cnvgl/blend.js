/*
Copyright (c) 2014 Cimaron Shanahan

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

proto.blendColor = function(ctx, r, g, b, a) {
	this.command('set', 'blendColor', [r, g, b, a]);
};

proto.blendFunc = function(ctx, sfactor, dfactor) {
	this.command('blendFunc', getGPUBlendFunction(sfactor), getGPUBlendFunction(dfactor));	
};

/**
 * Set GPU blend equations
 */
proto.blendEquationSeparate = function(ctx, rgb, a) {
	this.command('blendEqs', getGPUBlendEquation(rgb), getGPUBlendEquation(a));
};


/**
 * Convert GL blend mode to GPU blend mode
 */
function getGPUBlendEquation(mode) {

	switch (mode) {

		case cnvgl.FUNC_ADD:
			return GPU.constants.fnBlendEqAdd;

		case cnvgl.FUNC_SUBTRACT:
			return GPU.constants.fnBlendEqSub;
		
		case cnvgl.FUNC_REVERSE_SUBTRACT:
			return GPU.constants.fnBlendEqRevSub;
	}

	throw new Error("cnvGL.driver: Invalid equation");
}

/**
 * Convert GL blend mode to GPU blend mode
 */
function getGPUBlendFunction(fn) {

	switch (fn) {

		case cnvgl.ONE:
			return GPU.constants.fnBlendFnOne;

		case cnvgl.ZERO:
			return GPU.constants.fnBlendFnZero;
		
		case cnvgl.SRC_ALPHA:
			return GPU.constants.fnBlendFnSrcAlpha;

		case cnvgl.ONE_MINUS_SRC_ALPHA:
			return GPU.constants.fnBlendFnOneMinusSrcAlpha;

		case cnvgl.DST_ALPHA:
			return GPU.constants.fnBlendFnDestAlpha;

		case cnvgl.ONE_MINUS_DST_ALPHA:
			return GPU.constants.fnBlendFnOneMinusDestAlpha;
	}

	throw new Error("cnvGL.driver: Invalid function");
}


