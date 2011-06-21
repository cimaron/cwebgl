
function glUniformMatrix4fv(/*GLint*/ location, /*GLsizei*/ count, /*GLboolean*/ transpose, /*const GLfloat* */ value) {
	__glUniform(location, count, transpose, value, 4, false, true, [4, 4]);
}

function __glUniform(location, count, transpose, value, _size, _integer, _vector, _matrix) {

	var current_program = cnvgl_state.current_program
	
	if (!current_program) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (location != -1 && location < 0 && location >= current_program.uniforms.length) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (count < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	var uniform_variable = current_program.uniforms[location];

	var itypes = ['int', 'ivec2', 'ivec3', 'ivec4'];
	var ftypes = ['float', 'vec2', 'vec3', 'vec4', 'mat4'];

	if (location == -1) {
		return;	
	}
	
	//@todo: check for "or an array of these"
	if ((_integer && itypes.indexOf(uniform_variable.definition.data_type) == -1) ||
		(!_integer && ftypes.indexOf(uniform_variable.definition.data_type) == -1)) {
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

	//@todo: fix this cheat!
	uniform_variable.data = value;

}

