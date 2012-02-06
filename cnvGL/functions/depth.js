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
	 * glClearDepth — specify the clear value for the depth buffer
	 *
	 * @var GLclampd  depth  Specifies the depth value used when the depth buffer is cleared. The initial value is 1.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glClearDepth.xml
	 */
	cnvgl.clearDepth = function(depth) {
		var ctx;
		ctx = cnvgl.getCurrentContext();
	
		depth = Math.max(Math.min(depth, 1), 0);
		ctx.depth.clear = depth;
	};
	

	/**
	 * glDepthFunc — specify the value used for depth buffer comparisons
	 *
	 * @var GLenum  func  Specifies the depth comparison function.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glDepthFunc.xml
	 */
	cnvgl.depthFunc = function(func) {
		var ctx;
		ctx = cnvgl.getCurrentContext();

		if (func != cnvgl.NEVER
			&& func != cnvgl.LESS
			&& func != cnvgl.EQUAL
			&& func != cnvgl.LEQUAL
			&& func != cnvgl.GREATER
			&& func != cnvgl.NOTEQUAL
			&& func != cnvgl.GEQUAL
			&& func != cnvgl.ALWAYS) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;		
		}

		ctx.depth.func = func;

		ctx.driver.depthFunc(ctx, func);
	};


	/**
	 * glDepthMask — enable or disable writing into the depth buffer
	 *
	 * @var GLboolean  flag  Specifies whether the depth buffer is enabled for writing.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glDepthMask.xml
	 */
	cnvgl.depthMask = function(mask) {
		var ctx;
		ctx = cnvgl.getCurrentContext();
	
		ctx.depth.mask = mask ? cnvgl.TRUE : cnvgl.FALSE;
		
		ctx.driver.depthMask(ctx, mask);
	};


}(cnvgl));

