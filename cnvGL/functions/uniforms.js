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

function glUniform1i(location, v0) {
	v0 = v0|0; //floor(v0);
	__glUniform(location, [v0], 1, 1);
}

function glUniform1f(location, v0) {
	v0 = v0 * 1.0; //force bool to float
	__glUniform(location, [v0], 1, 1);
}

function glUniform3f(location, v0, v1, v2) {
	//GL_INVALID_OPERATION is generated if a sampler is loaded using a command other than glUniform1i and glUniform1iv.
	__glUniform(location, [v0, v1, v2], 1, 3);
}

function glUniform3fv(location, count, value) {
	var i, v;
	for (i = 0; i < count; i++) {
		v = 3 * i;
		__glUniform(i + location, [value[v], value[v + 1], value[v + 2]], 1, 3);
	}
}

function glUniformMatrix3fv(location, count, transpose, value) {

	if (count < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	if (count > 1) {
		throw new Error('glUniformMatrix3fv with array not implemented yet');
	}

	__glUniform(location, value, 3, 3);
}

function glUniformMatrix4fv(location, count, transpose, value) {

	if (count < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	if (count > 1) {
		throw new Error('glUniformMatrix4fv with array not implemented yet');
	}

	__glUniform(location, value, 4, 4);
}

function __glUniform(location, value, slots, components) {
	var ctx, program_obj, uniform_obj, i;

	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shader.activeProgram;

	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (location == -1) {
		return;
	}

	//may want to set a uniform location cache in program_obj to avoid this lookup
	for (i = 0; i < program_obj.uniforms.active.length; i++) {
		if (program_obj.uniforms.active[i].location == location) {
			uniform_obj = program_obj.uniforms.active[i];
			break;
		}
	}

	if (!uniform_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;		
	}

	if (slots != uniform_obj.slots || slots * components != uniform_obj.size) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;		
	}

	for (i = 0; i < slots; i++) {
		GPU.memcpy(GPU.memory.shader.uniforms, (location + i) * 4, value, components, (components * i));
	}
}

function glGetUniformLocation(program, name) {
	var ctx, program_obj, u;

	//get program
	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.shaderObjects[program];

	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
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

	if (u = program_obj.uniforms.names[name]) {
		return u.location;
	}

	return -1;
}

