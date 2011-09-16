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
	__glUniform(location, v0, ['bool', 'int', 'sampler2D'], true);
}

function glUniform3f(location, v0, v1, v2) {
	//GL_INVALID_OPERATION is generated if a sampler is loaded using a command other than glUniform1i and glUniform1iv.
	__glUniform(location, [v0, v1, v2], ['vec3']);
}

function glUniform3fv(location, count, value) {
	var i, v;
	for (i = 0; i < count; i++) {
		v = 3 * i;
		__glUniform(i + location, [value[v], value[v + 1], value[v + 2]], ['vec3']);
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

	__glUniform(location, value, ['mat3']);
}

function glUniformMatrix4fv(location, count, transpose, value) {

	if (count < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	if (count > 1) {
		throw new Error('glUniformMatrix4fv with array not implemented yet');
	}
	
	__glUniform(location, value, ['mat4']);
}

function __glUniform(location, value, types) {
	var ctx, program_obj, uniform_obj;

	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.current_program;

	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (location != -1 && location < 0 && location >= program_obj.active_uniforms_count) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (location == -1) {
		return;
	}

	uniform_obj = program_obj.active_uniforms[location];

	if (types.indexOf(uniform_obj.definition.type) == -1) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	program_obj.active_uniforms_values[location] = value;
}

