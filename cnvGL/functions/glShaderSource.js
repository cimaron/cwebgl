
/*void*/
function glShaderSource(/*GLuint*/ shader, count, string, length) {

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
	if (!shader_obj.instanceOf('cnvgl_shader')) {
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

	shader_obj.source = string.join();
}

