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

var cnvgl_context_shared = (function() {
							  
	function Initializer() {
		//public:
		this.texture_objects = [];
		this.default_texture_objects = {};

		this.shaderObjects = [0];
		this.frameBuffers = [0];
		this.renderBuffers = [0];
	}

	var cnvgl_context_shared = jClass('cnvgl_context_shared', Initializer);
	
	//static:
	var instance = null;
	cnvgl_context_shared.Constructor.getInstance = function() {
		if (instance) {
			return instance;	
		}
		return new cnvgl_context_shared.Constructor();
	};

	//public:

	cnvgl_context_shared.cnvgl_context_shared = function() {
		this.initTextures();
	};
	
	cnvgl_context_shared.initTextures = function() {
		var tex2d, tex2di;
		this.texture_objects[0] = 0;

		//default texture objects
		tex2d = new cnvgl_texture_object(0, GL_TEXTURE_2D);
		this.default_texture_objects[GL_TEXTURE_2D] = tex2d;
		tex2di = new cnvgl_texture_object(tex2d);
		tex2di.data = new Uint8Array([0,0,0,255]);
		tex2di.width = 1;
		tex2di.height = 1;
		tex2di.internalFormat = GL_RGBA;
		tex2d.images[0] = tex2di;
	};

	return cnvgl_context_shared.Constructor;

}());

