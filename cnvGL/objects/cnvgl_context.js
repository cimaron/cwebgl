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

var cnvgl_context = (function() {
							  
	function Initializer() {

		this.current_error_code = 0;
	
		//states
		this.depth = {};
		this.polygon = {};
		this.viewport = {};
		this.texture = {};

		//Frame Buffers
		this.clear_color = [0,0,0,0];
		this.color_buffer = null;
		this.depth_buffer = null;

		//Buffers
		this.bound_buffers = {};
	
		this.current_program = null;
	
		this.vertex_attrib_arrays = [];
	
		//Shaders		
	}

	var cnvgl_context = jClass('cnvgl_context', Initializer);

	//public:

	cnvgl_context.cnvgl_context = function() {
		var i;

		//depth state
		this.depth.clear = 1.0;
		this.depth.func = GL_LESS;
		this.depth.test = GL_FALSE;

		//polygon state
		this.polygon.cullFaceMode = GL_BACK;
		this.polygon.cullFlag = GL_FALSE;
		this.polygon.frontFace = GL_CCW;

		//viewport state
		this.viewport.near = 0;
		this.viewport.far = 1;
		this.viewport.x = 0;
		this.viewport.y = 0;
		this.viewport.w = 0;
		this.viewport.h = 0;

		//texture state
		this.texture.active = GL_TEXTURE0;

		this.bound_buffers[GL_ARRAY_BUFFER] = 0;
		this.bound_buffers[GL_ELEMENT_ARRAY_BUFFER] = 0;		

		//Vertex attribute arrays
		for (i = 0; i < cnvgl_const.GL_MAX_VERTEX_ATTRIBS; i++) {
			this.vertex_attrib_arrays[i] = new cnvgl_attrib_array_object();
		}
		
		this.renderer = new cnvgl_renderer();
		this.renderer.state = this;
	};

	//static:

	var context;

	cnvgl_context.Constructor.getCurrentContext = function() {
		if (!context) {
			context = new cnvgl_context.Constructor();
		}
		return context;
	};

	return cnvgl_context.Constructor;

}());

