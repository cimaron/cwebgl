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


include('cnvGL/defines.js');

include('cnvGL/objects/attrib_array_object.js');
include('cnvGL/objects/buffer.js');
include('cnvGL/objects/constants.js');
include('cnvGL/objects/cnvgl_context.js');
include('cnvGL/objects/context_shared.js');
include('cnvGL/objects/cnvgl_fragment.js');
include('cnvGL/objects/framebuffer.js');
include('cnvGL/objects/cnvgl_primitive.js');
include('cnvGL/objects/cnvgl_program.js');
include('cnvGL/objects/cnvgl_shader.js');
include('cnvGL/objects/renderbuffer.js');
include('cnvGL/objects/texture.js');
include('cnvGL/objects/cnvgl_vertex.js');

//Compiler
include('cnvGL/includes/ARB/ARB.js');
include('cnvGL/includes/ARB/instruction.js');
include('cnvGL/includes/glsl/glsl.js');
include('cnvGL/includes/linker/linker.js');

//Rendering Pipeline
include('cnvGL/includes/gpu/gpu.js');
include('cnvGL/includes/rendering/primitive/line.js');
include('cnvGL/includes/rendering/primitive/point.js');
include('cnvGL/includes/rendering/primitive/triangle.js');
include('cnvGL/includes/rendering/clipping.js');
include('cnvGL/includes/rendering/culling.js');
include('cnvGL/includes/rendering/fragment.js');
include('cnvGL/includes/rendering/interpolate.js');
include('cnvGL/includes/rendering/primitive.js');
include('cnvGL/includes/rendering/renderer.js');
include('cnvGL/includes/rendering/vertex.js');


include('cnvGL/functions/blend.js');
include('cnvGL/functions/bufferobj.js');
include('cnvGL/functions/clear.js');
include('cnvGL/functions/depth.js');
include('cnvGL/functions/draw.js');
include('cnvGL/functions/enable.js');
include('cnvGL/functions/fbobject.js');
include('cnvGL/functions/get.js');
include('cnvGL/functions/pixelstore.js');
include('cnvGL/functions/polygon.js');
include('cnvGL/functions/shaderapi.js');
include('cnvGL/functions/teximage.js');
include('cnvGL/functions/texobj.js');
include('cnvGL/functions/texparam.js');
include('cnvGL/functions/texstate.js');
include('cnvGL/functions/uniforms.js');
include('cnvGL/functions/varray.js');
include('cnvGL/functions/viewport.js');

//internal functions
function cnvgl_throw_error(error) {
	var ctx;
	ctx = cnvgl_context.getCurrentContext();
	if (error && ctx.errorValue == GL_NO_ERROR) {
		ctx.errorValue = error;
	}
}

function cnvgl_malloc(format, size) {
	var data, zero, i;
	switch (format) {
		case GL_RGBA:
			data = new Uint8Array(size * 4);
			break;
		case GL_DEPTH_COMPONENT16:
		case GL_DEPTH_COMPONENT32:
			if (Float32Array.native) {
				data = new Float32Array(size);
			} else {
				data = new Array(size);
				zero = true;
			}
			break;
		default:
			throw new Error('format not implemented');
	}
	if (zero) {
		for (i = 0; i < data.length; i++) {
			data[i] = 0;	
		}
	}
	return data;
}

cnvgl_objects = [0];

