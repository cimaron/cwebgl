
/*void*/
function glGetShaderInfoLog(/*GLuint*/ shader, /*GLsizei*/ maxLength, /*GLsizei*/ length, /*GLchar*/ infoLog) {

	//get shader
	var shader_obj = cnvgl_objects[shader];

	//no shader exists
	if (!shader_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a shader (BAD!)
	if (!shader_obj.instanceOf('cnvgl_shader')) {
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

	var log = shader_obj.info_log;
	
	if (maxLength && maxLength < log.length) {
		log = log.substring(0, maxLength);
	}

	length[0] = log.length;
	infoLog[0] = log;

}

