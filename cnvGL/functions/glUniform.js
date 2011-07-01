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


function glUniformMatrix4fv(/*GLint*/ location, /*GLsizei*/ count, /*GLboolean*/ transpose, /*const GLfloat* */ value) {
	__glUniform(location, count, transpose, value, 4, false, true, [4, 4]);
}

function __glUniform(location, count, transpose, value, _size, _integer, _vector, _matrix) {

	var current_program = cnvgl_state.current_program
	
	if (!current_program) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (location != -1 && location < 0 && location >= current_program.active_uniforms_count) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (count < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	var uniform_obj = current_program.active_uniforms[location];

	var itypes = ['int', 'ivec2', 'ivec3', 'ivec4'];
	var ftypes = ['float', 'vec2', 'vec3', 'vec4', 'mat4'];

	if (location == -1) {
		return;	
	}

	//@todo: check for "or an array of these"
	if ((_integer && itypes.indexOf(uniform_obj.definition.data_type) == -1) ||
		(!_integer && ftypes.indexOf(uniform_obj.definition.data_type) == -1)) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (count > 1 && !uniform_variable.pointer) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;		
	}

	//GL_INVALID_OPERATION is generated if a sampler is loaded using a command other than glUniform1i and glUniform1iv.
	
	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	current_program.active_uniforms_values[location] = value;

	current_program.executable.access.setUniform(uniform_obj.name, value);

}

