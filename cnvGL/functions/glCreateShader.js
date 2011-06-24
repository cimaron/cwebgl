
/*GLuint*/
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

