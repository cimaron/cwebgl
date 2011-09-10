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


function glAttachShader(program, shader) {

	var ctx, program_obj, shader_obj;

	ctx = cnvgl_context.getCurrentContext();

	program_obj = ctx.shared.program_objects[program];
	shader_obj = cnvgl_objects[shader];

	//program or shader does not exist
	if (!program_obj || !shader_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//objects are not what they should be
	if (!program_obj instanceof cnvgl_program || !shader_obj instanceof cnvgl_shader) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	program_obj.attached_shaders.push(shader);	
	program_obj.attached_shaders_count++;
}

