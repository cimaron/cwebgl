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
	 * glScissor — define the scissor box
	 *
	 * @var GLint    x       Specify the lower left corner of the scissor box.
	 * @var GLint    y       
	 * @var GLsizei  width   Specify the width and height of the scissor box.
	 * @var GLsizei  height  
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glScissor.xml
	 */
	cnvgl.scissor = function(x, y, width, height) {
		var ctx, name;
		ctx = cnvgl.getCurrentContext();

		if (width < 0 || height < 0) {
			cnvgl.throw_error(ctx, cnvgl.INVALID_VALUE);
			return;
		}

		ctx.scissor.x = x;
		ctx.scissor.y = y;
		ctx.scissor.width = width;
		ctx.scissor.height = height;
		
		ctx.driver.scissor(ctx, x, y, width, height);
	};


}(cnvgl));

