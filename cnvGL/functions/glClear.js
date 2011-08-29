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


function glClear(mask) {

	var buffer, clear, state, i;

	//mask = mask & (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_ACCUM_BUFFER_BIT | and GL_STENCIL_BUFFER_BIT);

	if (mask & ~(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_ACCUM_BUFFER_BIT | GL_STENCIL_BUFFER_BIT)) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	state = cnvgl_context.getCurrentContext();

	//GL_COLOR_BUFFER_BIT
	if (mask & GL_COLOR_BUFFER_BIT) {
		buffer = state.color_buffer;
		clear = state.clear_color;
		for (i = 0, l = buffer.length; i < l; i += 4) {
			buffer[i] = clear[0];
			buffer[i + 1] = clear[1];
			buffer[i + 2] = clear[2];
			buffer[i + 3] = clear[3];
		}
	}

	//GL_DEPTH_BUFFER_BIT
	if (mask & GL_DEPTH_BUFFER_BIT) {
		buffer = state.depth_buffer;
		clear = state.depth.clear;
		for (i = 0, l = buffer.length; i < l; i ++) {
			buffer[i] = clear;
		}
	}

	if (mask & ~(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT)) {
		throw new Error('glClear: todo');
	}

}

