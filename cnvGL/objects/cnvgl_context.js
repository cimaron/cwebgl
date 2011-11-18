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

		//states
		this.array = {};
		this.color = {};
		this.depth = {};
		this.pack = {};
		this.polygon = {};
		this.texture = {};
		this.unpack = {};
		this.viewport = {};

		//direct
		this.errorValue = 0;
	
		//Frame Buffers
		this.color_buffer = null;
		this.depth_buffer = null;

		//Buffers
		this.current_program = null;
		this.vertex_attrib_arrays = [];

		this.shared = null;

		//Shaders
	}

	var cnvgl_context = jClass('cnvgl_context', Initializer);

	//public:

	cnvgl_context.cnvgl_context = function() {
		var i;

		this.shared = cnvgl_context_shared.getInstance();

		//array state
		this.array = {
			arrayBufferObj : null,
			elementArrayBufferObj : null
		};

		//color state
		this.color = {
			clearColor : [0,0,0,0],
			colorMask : [0xFF, 0xFF, 0xFF, 0xFF],
			blendEnabled : GL_FALSE,
			blendSrcRGB : GL_ONE,
			blendSrcA : GL_ONE,
			blendDestRGB : GL_ZERO,
			blendDestA : GL_ZERO
		};

		//depth state
		this.depth = {
			clear : 1.0,
			func : GL_LESS,
			test : GL_FALSE
		};

		//pack state
		this.pack = {
			alignment : 4
		};

		//polygon state
		this.polygon = {
			cullFaceMode : GL_BACK,
			cullFlag : GL_FALSE,
			frontFace : GL_CCW
		};

		//texture state
		this.initTextures();

		//unpack state
		this.unpack = {
			alignment : 4
		};

		//viewport state
		this.viewport = {
			near : 0.0,
			far : 1.0,
			x : 0,
			y : 0,
			w : 0,
			h : 0
		};

		//direct
		this.errorValue = GL_NO_ERROR;

		//Vertex attribute arrays
		for (i = 0; i < cnvgl_const.GL_MAX_VERTEX_ATTRIBS; i++) {
			this.vertex_attrib_arrays[i] = new cnvgl_attrib_array_object();
		}

		this.renderer = new cnvgl_renderer(this);
	};

	cnvgl_context.initTextures = function() {
		var units, i, unit;
		this.texture.currentUnit = GL_TEXTURE0;
		this.texture.unit = [];
		for (i = 0; i < cnvgl_const.GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS; i++) {
			unit = new cnvgl_texture_unit(this, GL_TEXTURE0 + i);
			unit.current_texture[GL_TEXTURE_2D] = this.shared.default_texture_objects[GL_TEXTURE_2D];
			this.texture.unit[i] = unit;
		}
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

