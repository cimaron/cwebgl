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

	program_obj = ctx.shared.shaderObjects[program];
	shader_obj = ctx.shared.shaderObjects[shader];

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

	program_obj.attached_shaders.push(shader_obj);	
}


function glBindAttribLocation(program, index, name) {
	var ctx, program_obj, attr_obj;

	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.shaderObjects[program];
	
	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (!program_obj.attributes.bound[name]) {
		//do check that index is valid
		program_obj.attributes.bound[name] = index;
	}
}


function glCompileShader(shader) {
	var ctx, shader_obj, target, status;

	ctx = cnvgl_context.getCurrentContext();
	shader_obj = ctx.shared.shaderObjects[shader];

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

	target = (shader_obj.type == GL_FRAGMENT_SHADER) ? glsl.mode.fragment : glsl.mode.vertex;

	status = glsl.compile(shader_obj.shader_string, target);

	if (status) {
		shader_obj.compile_status = GL_TRUE;
		shader_obj.object_code = glsl.output;
	} else {
		shader_obj.information_log = glsl.errors.join("\n");
	}
}


function glCreateShader(shaderType) {
	var ctx, shader_obj, name;

	ctx = cnvgl_context.getCurrentContext();

	if (shaderType != GL_FRAGMENT_SHADER && shaderType != GL_VERTEX_SHADER) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return 0;
	}

	name = ctx.shared.shaderObjects.length;

	shader_obj = new cnvgl_shader(name, shaderType);	
	ctx.shared.shaderObjects.push(shader_obj);

	return shader_obj.name;
}


function glCreateProgram() {
	var ctx, program_obj, name;

	ctx = cnvgl_context.getCurrentContext();
	name = ctx.shared.shaderObjects.length;

	program_obj = new cnvgl_program();
	program_obj.name = name;

	ctx.shared.shaderObjects.push(program_obj);

	return name;
}


function glGetAttribLocation(program, name) {
	var ctx, program_obj, attr_obj;

	//get program
	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.shaderObjects[program];

	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (!program_obj.link_status) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (attrib_obj = program_obj.getActiveAttribute(name)) {
		return attrib_obj.location;	
	}

	return -1;
}


function glGetProgramiv(program, pname, params) {
	var ctx, program_obj, t, i;

	//get program
	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.shaderObjects[program];

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
			params[0] = program_obj.information_log.length;
			break;

		case GL_ATTACHED_SHADERS:
			params[0] = program_obj.attached_shaders.length;
			break;
		
		case GL_ACTIVE_ATTRIBUTES:
			params[0] = program_obj.attributes.active.length;
			break;

		case GL_ACTIVE_ATTRIBUTE_MAX_LENGTH:
			params[0] = 0;
			for (i in program_obj.attributes.names) {
				params[0] = Math.max(params[0], i.length);
			}
			break;

		case GL_ACTIVE_UNIFORMS:
			params[0] = program_obj.uniforms.active.length;
			break;

		case GL_ACTIVE_UNIFORM_MAX_LENGTH:
			params[0] = 0;
			for (i in program_obj.uniforms.names) {
				params[0] = Math.max(params[0], i.length);					
			}
			break;

		default:
			cnvgl_throw_error(GL_INVALID_ENUM);
			return;
	}
}


function glGetShaderiv(shader, pname, params) {
	var ctx, shader_obj;
	
	//get shader
	ctx = cnvgl_context.getCurrentContext();
	shader_obj = ctx.shared.shaderObjects[shader];

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
			params[0] = shader_obj.information_log.length;
			break;
		case GL_SHADER_SOURCE_LENGTH:
			params[0] = shader_obj.shader_string.length;
			break;
		default:
			cnvgl_throw_error(GL_INVALID_ENUM);
			return;
	}
}


function glGetShaderInfoLog(shader, maxLength, length, infoLog) {
	var ctx, shader_obj;

	//get shader
	ctx = cnvgl_context.getCurrentContext();
	shader_obj = ctx.shared.shaderObjects[shader];
	
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

	var log = shader_obj.information_log;
	
	if (maxLength && maxLength < log.length) {
		log = log.substring(0, maxLength);
	}

	length[0] = log.length;
	infoLog[0] = log;
}


function glLinkProgram(program) {
	var ctx, program_obj, i, attrib_obj, location, shader_obj, code;

	//get program
	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.shaderObjects[program];

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

	if (glsl.link(program_obj)) {
		program_obj.link_status = true;
	}
	
	//add linker errors here
}


function glShaderSource(shader, count, string, length) {
	var ctx, shader_obj;

	ctx = cnvgl_context.getCurrentContext();
	shader_obj = ctx.shared.shaderObjects[shader];

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

	shader_obj.shader_string = string.join();
}


function glUseProgram(program) {
	var ctx, program_obj, i, shader_obj;

	ctx = cnvgl_context.getCurrentContext();

	if (program == 0) {
		ctx.shader.activeProgram = null;
		GPU.setVertexProgram(null);
		GPU.setFragmentProgram(null);
		return;
	}

	//get program
	program_obj = ctx.shared.shaderObjects[program];

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

	ctx.shader.activeProgram = program_obj;

	//set active shaders in GPU
	for (i = 0; i < program_obj.attached_shaders.length; i++) {
		shader_obj = program_obj.attached_shaders[i];
		if (shader_obj.type == GL_VERTEX_SHADER) {
			GPU.uploadVertexShader(shader_obj.exec);
		} else {
			GPU.uploadFragmentShader(shader_obj.exec);	
		}
	}
}

