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
	this.command('set', 'blendSrcA', sfactor);
	this.command('set', 'blendSrcRGB', sfactor);
	this.command('set', 'blendDestA', dfactor);
	this.command('set', 'blendDestRGB', dfactor);
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
	var fns = GPU.constants.fragment.fn.blend;

	switch (mode) {

		case cnvgl.FUNC_ADD:
			return fns.eqAdd;

		case cnvgl.FUNC_SUBTRACT:
			return fns.eqSub;
		
		case cnvgl.FUNC_REVERSE_SUBTRACT:
			return fns.eqRevSub;
	}

	throw new Error("cnvGL.driver: Invalid equation mode");
}


