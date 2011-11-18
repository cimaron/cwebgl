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
include('cnvGL/constants.js');

include('cnvGL/objects/cnvgl_attrib_array.js');
include('cnvGL/objects/cnvgl_attribute.js');
include('cnvGL/objects/buffer.js');
include('cnvGL/objects/cnvgl_context.js');
include('cnvGL/objects/context_shared.js');
include('cnvGL/objects/cnvgl_fragment.js');
include('cnvGL/objects/cnvgl_primitive.js');
include('cnvGL/objects/cnvgl_program.js');
include('cnvGL/objects/cnvgl_shader.js');
include('cnvGL/objects/texture_image.js');
include('cnvGL/objects/texture_object.js');
include('cnvGL/objects/texture_unit.js');
include('cnvGL/objects/cnvgl_uniform.js');
include('cnvGL/objects/cnvgl_vertex.js');

//Compiler
include('cnvGL/includes/glsl/object.js');
include('cnvGL/includes/glsl/compiler.js');
include('cnvGL/includes/glsl/output.js');
include('cnvGL/includes/glsl/symbol.js');
include('cnvGL/includes/glsl/preprocessor.js');
include('cnvGL/includes/glsl/lexer.js');
include('cnvGL/includes/glsl/lexer_extern.js');
include('cnvGL/includes/glsl/parser.js');
include('cnvGL/includes/glsl/type.js');
//include('cnvGL/includes/glsl/parser_debug.js');
include('cnvGL/includes/glsl/ast.js');
include('cnvGL/includes/glsl/generator.js');

//Linker
include('cnvGL/includes/linker/linker.js');

//Rendering Pipeline
include('cnvGL/includes/rendering/primitive/line.js');
include('cnvGL/includes/rendering/primitive/point.js');
include('cnvGL/includes/rendering/primitive/triangle.js');
include('cnvGL/includes/rendering/clipping.js');
include('cnvGL/includes/rendering/culling.js');
include('cnvGL/includes/rendering/fragment.js');
include('cnvGL/includes/rendering/interpolate.js');
include('cnvGL/includes/rendering/primitive.js');
include('cnvGL/includes/rendering/program.js');
include('cnvGL/includes/rendering/renderer.js');
include('cnvGL/includes/rendering/texture.js');
include('cnvGL/includes/rendering/vertex.js');


include('cnvGL/functions/blend.js');
include('cnvGL/functions/bufferobj.js');
include('cnvGL/functions/clear.js');
include('cnvGL/functions/depth.js');
include('cnvGL/functions/draw.js');
include('cnvGL/functions/enable.js');
include('cnvGL/functions/polygon.js');
include('cnvGL/functions/shaderapi.js');
include('cnvGL/functions/texobj.js');
include('cnvGL/functions/texstate.js');
include('cnvGL/functions/varray.js');

//the following files need to be merged into logical groups as done above
include('cnvGL/functions/glGet.js');
include('cnvGL/functions/glGetError.js');
include('cnvGL/functions/glGetUniformLocation.js');
include('cnvGL/functions/glPixelStore.js');
include('cnvGL/functions/glTexImage2D.js');
include('cnvGL/functions/glTexParameter.js');
include('cnvGL/functions/glUniform.js');
include('cnvGL/functions/glViewport.js');


//internal functions
function cnvgl_throw_error(error) {
	var ctx;
	ctx = cnvgl_context.getCurrentContext();
	if (error && ctx.errorValue == GL_NO_ERROR) {
		ctx.errorValue = error;
	}
}

cnvgl_objects = [0];
cnvgl_textures = [0];

