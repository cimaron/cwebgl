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


function glBindAttribLocation(program, index, name) {
	var ctx, program_obj, attr_obj;

	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.program_objects[program];
	
	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (program_obj.attributes[name]) {
		attr_obj = program_obj.attributes[name];	
	} else {
		attr_obj = new cnvgl_attribute(name);
	}

	//do check that index is valid
	attr_obj.location = index;

	program_obj.attributes[name] = attr_obj;
}


function glCompileShader(shader) {

	//get shader
	var shader_obj = cnvgl_objects[shader];

	//no shader exists
	if (!shader_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a shader (BAD!)
	if (!shader_obj instanceof cnvgl_shader) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	shader_obj.compile_status = GL_FALSE;
	shader_obj.information_log = '';
	shader_obj.information_log_length = 0;

	//get source
	var shader_string = shader_obj.shader_string;

	var glsl_mode = (shader_obj.type == GL_FRAGMENT_SHADER) ? 1 : 2;

	glsl.compile(shader_string, glsl_mode);

	if (glsl.status) {
		shader_obj.compile_status = GL_TRUE;
		shader_obj.object_code = glsl.output;
	} else {
		shader_obj.information_log = glsl.errors.join("\n");
		shader_obj.information_log_length = shader_obj.information_log.length;
	}
}


function glCreateShader(/*GLenum*/ shaderType) {

	if (shaderType != GL_FRAGMENT_SHADER && shaderType != GL_VERTEX_SHADER) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return 0;
	}

	/*if (between glBegin and glEnd) {
		throw GL_INVALID_OPERATION
		return 0;
	} */
	
	var shader = new cnvgl_shader();
	shader.type = shaderType;

	cnvgl_objects.push(shader);
	shader.name = cnvgl_objects.length - 1;
	
	return shader.name;
}


function glCreateProgram() {
	var ctx, program_obj, name;

	ctx = cnvgl_context.getCurrentContext();
	name = ctx.shared.program_objects.length;

	program_obj = new cnvgl_program();
	program_obj.name = name;

	ctx.shared.program_objects.push(program_obj);

	return name;
}


function glGetAttribLocation(program, name) {
	var ctx, program_obj, i;

	//get program
	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.program_objects[program];

	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (!program_obj.link_status) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (name.indexOf('gl_') == 0 || !program_obj.active_attributes[name]) {
		return -1;
	}
	
	return program_obj.active_attributes[name].location;
}


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


function glGetShaderiv(shader, pname, params) {

	//get shader
	var shader_obj = cnvgl_objects[shader];

	//no shader exists
	if (!shader_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a shader (BAD!)
	if (!shader_obj instanceof cnvgl_shader) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}	

	switch (pname) {
		case GL_SHADER_TYPE:
			params[0] = shader_obj.type;
			break;
		case GL_DELETE_STATUS:
			params[0] = shader_obj.delete_status ? GL_TRUE : GL_FALSE;
			break;
		case GL_COMPILE_STATUS:
			params[0] = shader_obj.compile_status ? GL_TRUE : GL_FALSE;
			break;
		case GL_INFO_LOG_LENGTH:
			params[0] = shader_obj.information_log_length;
			break;
		case GL_SHADER_SOURCE_LENGTH:
			params[0] = shader_obj.shader_string_length;
			break;
		default:
			cnvgl_throw_error(GL_INVALID_ENUM);
			return;
	}
}


function glGetShaderInfoLog(shader, maxLength, length, infoLog) {

	//get shader
	var shader_obj = cnvgl_objects[shader];

	//no shader exists
	if (!shader_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a shader (BAD!)
	if (!shader_obj instanceof cnvgl_shader) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}
	
	if (maxLength < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	var log = shader_obj.information_log;
	
	if (maxLength && maxLength < log.length) {
		log = log.substring(0, maxLength);
	}

	length[0] = log.length;
	infoLog[0] = log;
}


function glLinkProgram(program) {
	var ctx, program_obj, linker, i, attrib_obj;

	//get program
	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.program_objects[program];

	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a program
	if (!program_obj instanceof cnvgl_program) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	//link error conditions:
	//The number of active attribute variables supported by the implementation has been exceeded.

	//reset
	program_obj.link_status = false;
	program_obj.fragment_program = null;
	program_obj.vertex_program = null;

	program_obj.active_uniforms_count = 0;
	program_obj.active_uniforms = [];
	program_obj.active_uniforms_values = [];

	program_obj.active_attributes_count = 0;
	program_obj.active_attributes = [];
	program_obj.active_attributes_values = [];	

	linker = ctx.shared.linker;

	//may want to move this into the linker itself
	for (i = 0; i < program_obj.attached_shaders_count; i++) {
		var location = program_obj.attached_shaders[i];
		var shader_obj = cnvgl_objects[location];
		linker.addObjectCode(shader_obj.object_code);
	}

	linker.link(program_obj);

	if (linker.status) {
		program_obj.link_status = true;
		program_obj.program = linker.output;
	}
}


function glShaderSource(shader, count, string, length) {

	//if (shader compiler not supported) then
	//	cnvgl_throw_error(GL_INVALID_OPERATION);
	//endif

	//get shader
	var shader_obj = cnvgl_objects[shader];

	//no shader exists
	if (!shader_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a shader (BAD!)
	if (!shader_obj instanceof cnvgl_shader) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	/*
	if (string.length < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
	}
	*/

	//if between glbegin and glend
	//cnvgl_throw_error(GL_INVALID_OPERATION);

	shader_obj.shader_string = string.join();
	shader_obj.shader_string_length = shader_obj.shader_string.length;
}


function glUseProgram(program) {
	var ctx, program_obj;

	ctx = cnvgl_context.getCurrentContext();

	if (program == 0) {
		ctx.vertex_executable = null;
		ctx.fragment_executable = null;
		return;
	}

	//get program
	program_obj = ctx.shared.program_objects[program];

	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	//object is not a program (BAD!)
	if (!program_obj instanceof cnvgl_program) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (!program_obj.link_status) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	ctx.current_program = program_obj;

	ctx.renderer.setProgram(program_obj);
}

