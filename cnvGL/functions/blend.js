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
	 * glBlendFunc — specify pixel arithmetic
	 *
	 * @var GLenum  sfactor  Specifies how the red, green, blue, and alpha source blending factors are computed.
	 * @var GLenum  dfactor  Specifies how the red, green, blue, and alpha destination blending factors are computed.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glBlendFunc.xml
	 */
	cnvgl.blendFunc = function(sfactor, dfactor) {
		var ctx, i;

		ctx = cnvgl.getCurrentContext();
		
		//todo: add checks here
		
		ctx.color.blendSrcRGB = sfactor;
		ctx.color.blendSrcA = sfactor;
		ctx.color.blendDestRGB = dfactor;
		ctx.color.blendDestA = dfactor;
		
		ctx.driver.blendFunc(ctx, sfactor, dfactor);
	};


	/**
	 * glColorMask — enable and disable writing of frame buffer color components
	 *
	 * @var GLboolean  red    Specify whether red, green, blue, and alpha can or cannot be written into the frame buffer.
	 * @var GLboolean  green
	 * @var GLboolean  blue
	 * @var GLboolean  alpha
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glColorMask.xml
	 */
	cnvgl.colorMask = function(r, g, b, a) {
		var ctx;
		ctx = cnvgl.getCurrentContext();
	
		ctx.color.colorMask = [
			r ? 0xFF : 0,
			g ? 0xFF : 0,
			b ? 0xFF : 0,
			a ? 0xFF : 0
		];

		ctx.driver.colorMask(ctx, r, g, b, a);
	};
	
	
}(cnvgl));

