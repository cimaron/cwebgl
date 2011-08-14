
/*void*/
function glCompileShader(/*GLuint*/ shader) {

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

