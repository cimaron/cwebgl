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


function glGetProgramiv(program, pname, params) {
	var ctx, program_obj, t, i;

	//get program
	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.program_objects[program];

	//no shader exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a program (BAD!)
	if (!program_obj instanceof cnvgl_program) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}	

	switch (pname) {

		case GL_DELETE_STATUS:
			params[0] = program_obj.delete_status ? GL_TRUE : GL_FALSE;
			break;
		
		case GL_LINK_STATUS:
			params[0] = program_obj.link_status;
			break;
		
		case GL_VALIDATE_STATUS:
			params[0] = program_obj.validate_status ? GL_TRUE : GL_FALSE;
			break;
		
		case GL_INFO_LOG_LENGTH:
			params[0] = program_obj.information_log_length;
			break;

		case GL_ATTACHED_SHADERS:
			params[0] = program_obj.attached_shaders_count;
			break;
		
		case GL_ACTIVE_ATTRIBUTES:
			params[0] = 0;
			params[0] = program_obj.active_attributes_count;
			break;

		case GL_ACTIVE_ATTRIBUTE_MAX_LENGTH:
			params[0] = 0;
			t = program_obj.active_attributes;
			for (i = 0; i < program_obj.active_attributes_count; i++) {
				if (params[0] < t[i].name.length) {
					params[0] = t[i].name.length;	
				}
			}
			break;
		
		case GL_ACTIVE_UNIFORMS:
			params[0] = program_obj.active_uniforms_count;
			break;

		case GL_ACTIVE_UNIFORM_MAX_LENGTH:
			params[0] = 0;
			t = program_obj.active_uniforms;
			for (i = 0; i < program_obj.active_uniforms_count; i++) {
				if (params[0] < t[i].name.length) {
					params[0] = t[i].name.length;	
				}
			}
			break;

		default:
			cnvgl_throw_error(GL_INVALID_ENUM);
			return;
	}
}

