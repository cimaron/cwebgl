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


function cnvgl_context() {

	this.current_error_code = 0;

	this.enabled = {};

	//Frame Buffers
	this.clear_color = [0,0,0,0];
	this.clear_depth = 0,	
	this.color_buffer = null;
	this.depth_buffer = null;

	//Viewport
	this.viewport_x = 0;
	this.viewport_y = 0;
	this.viewport_w = 0;
	this.viewport_h = 0;

	//Buffers
	this.bound_buffers = {};

	this.current_program = null;

	//Shaders	
}

cnvgl_context.getCurrentContext = function() {
	if (!window.cnvgl_state) {
		cnvgl_state = new cnvgl_context();	
		cnvgl_state.enabled[GL_DEPTH_TEST] = GL_TRUE;
		cnvgl_state.bound_buffers[GL_ARRAY_BUFFER] = 0;
		cnvgl_state.bound_buffers[GL_ELEMENT_ARRAY_BUFFER] = 0;		
		cnvgl_state.vertex_processor = new cnvgl_vertex_processor();
	}
	return cnvgl_state;
}

