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
	 * glViewport — set the viewport
	 *
	 * @var GLint    x       Specify the lower left corner of the viewport rectangle, in pixels. The initial value is (0,0).
	 * @var GLint    y
	 * @var GLsizei  width   Specify the width and height of the viewport. When a GL context is first attached to a window, width and height are set to the dimensions of that window.
	 * @var GLsizei  height
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glViewport.xml
	 */
	cnvgl.viewport = function(x, y, width, height) {
	
		var state = cnvgl.getCurrentContext();
	
		if (width < 0 || height < 0) {
			cnvgl.throw_error(GL_INVALID_VALUE, ctx);
			return;
		}
	
		state.viewport.x = x;
		state.viewport.y = y;
		state.viewport.w = width;
		state.viewport.h = height;
	};


}(cnvgl));

