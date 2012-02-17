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
		  

	/**
	 * glClearColor — specify clear values for the color buffers
	 *
	 * @var GLclampf  red    Specify the red, green, blue, and alpha values used when the color buffers are cleared. The initial values are all 0.
	 * @var GLclampf  green
	 * @var GLclampf  blue
	 * @var GLclampf  alpha
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glClearColor.xml
	 */
	cnvgl.clearColor = function(red, green, blue, alpha) {
		var ctx, c;
		ctx = cnvgl.getCurrentContext();
		c = ctx.color.clearColor;
		c[0] = Math.round(255 * Math.max(Math.min(red, 1), 0));
		c[1] = Math.round(255 * Math.max(Math.min(green, 1), 0));
		c[2] = Math.round(255 * Math.max(Math.min(blue, 1), 0));
		c[3] = Math.round(255 * Math.max(Math.min(alpha, 1), 0));
	};


	/**
	 * glClear — clear buffers to preset values
	 *
	 * @var GLbitfield  mask  Bitwise OR of masks that indicate the buffers to be cleared.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glClear.xml
	 */
	cnvgl.clear = function(mask) {
		var ctx;

		ctx = cnvgl.getCurrentContext();

		if (mask & ~(cnvgl.COLOR_BUFFER_BIT | cnvgl.DEPTH_BUFFER_BIT | cnvgl.STENCIL_BUFFER_BIT)) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}

		ctx.driver.clear(ctx, ctx.color.clearColor, ctx.depth.clear, ctx.stencil.clear, mask);
	};


}(cnvgl));

