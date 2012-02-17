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


	function validate_stencil_func(ctx, func) {
		switch (func) {
			case cnvgl.NEVER:
			case cnvgl.LESS:
			case cnvgl.LEQUAL:
			case cnvgl.GREATER:
			case cnvgl.GEQUAL:
			case cnvgl.EQUAL:
			case cnvgl.NOTEQUAL:
			case cnvgl.ALWAYS:
				return true;
			default:
				return false;
		}
	}

	
	function validate_stencil_op(ctx, op) {
		switch (op) {
			case cnvgl.KEEP:
			case cnvgl.ZERO:
			case cnvgl.REPLACE:
			case cnvgl.INCR:
			case cnvgl.DECR:
			case cnvgl.INVERT:
			case cnvgl.INCR_WRAP:
			case cnvgl.DECR_WRAP:
				return true;
			default:
				return false;
		}
	}


	/**
	 * glClearStencil — specify the clear value for the stencil buffer
	 *
	 * @var GLint  s  Specifies the index used when the stencil buffer is cleared.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glClearStencil.xml
	 */
	cnvgl.clearStencil = function(s) {
		var ctx;
		ctx = cnvgl.getCurrentContext();

		ctx.stencil.clear = s;
	};


	/**
	 * glStencilFunc — set front and back function and reference value for stencil testing
	 *
	 * @var GLenum   func  Specifies the test function.
	 * @var GLint    ref   Specifies the reference value for the stencil test.
	 * @var GLuint   mask  Specifies a mask that is ANDed with both the reference value and the stored stencil value when the test is done.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glStencilFunc.xml
	 */
	cnvgl.stencilFunc = function(func, ref, mask) {
		var ctx;
		ctx = cnvgl.getCurrentContext();

		if (!validate_stencil_func(ctx, func)) {
			cnvgl.throw_error(ctx, cnvgl.INVALID_ENUM);
			return;
		}

		ref = Math.max(Math.min(ref, 0xFF), 0);

		ctx.stencil.func[0] = ctx.stencil.func[1] = func;
		ctx.stencil.ref[0] = ctx.stencil.ref[1] = ref;
		ctx.stencil.valueMask[0] = ctx.stencil.valueMask = mask;

		ctx.driver.stencilFunc(ctx, func, ref, mask);
	};


	/**
	 * glStencilMask — control the front and back writing of individual bits in the stencil planes
	 *
	 * @var GLuint  mask  Specifies a bit mask to enable and disable writing of individual bits in the stencil planes.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glStencilMask.xml
	 */
	cnvgl.stencilMask = function(mask) {
		var ctx;
		ctx = cnvgl.getCurrentContext();

		ctx.stencil.writeMask[0] = ctx.stencil.writeMask[1] = mask;

		ctx.driver.stencilMask(ctx, mask);
	};


	/**
	 * glStencilOp — set front and back stencil test actions
	 *
	 * @var GLenum  sfail   Specifies the action to take when the stencil test fails.
	 * @var GLenum  dpfail  Specifies the stencil action when the stencil test passes, but the depth test fails.
	 * @var GLenum  dppass  Specifies the stencil action when both the stencil test and the depth test pass, or when the stencil test passes and either there is no depth buffer or depth testing is not enabled.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glStencilOp.xml
	 */
	cnvgl.stencilOp = function(sfail, dpfail, dppass) {
		var ctx;
		ctx = cnvgl.getCurrentContext();

		if (!validate_stencil_op(ctx, sfail)) {
			cnvgl.throw_error(ctx, cnvgl.INVALID_ENUM);
			return;
		}
		if (!validate_stencil_op(ctx, dpfail)) {
			cnvgl.throw_error(ctx, cnvgl.INVALID_ENUM);
			return;
		}
		if (!validate_stencil_op(ctx, dppass)) {
			cnvgl.throw_error(ctx, cnvgl.INVALID_ENUM);
			return;
		}

		ctx.stencil.failFunc[0]  = ctx.stencil.failFunc[1]  = sfail;
		ctx.stencil.zFailFunc[0] = ctx.stencil.zFailFunc[1] = dpfail;
		ctx.stencil.zPassFunc[0] = ctx.stencil.zPassFunc[1] = dppass;

		ctx.driver.stencilOp(ctx, sfail, dpfail, dppass);
	};


}(cnvgl));

