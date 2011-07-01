
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
	
	var compiler = new ShaderCompiler();
	var object_code = compiler.compile(shader_string);

	if (object_code) {
		shader_obj.compile_status = GL_TRUE;
		shader_obj.object_code = object_code;
	} else {
		shader_obj.information_log = compiler.getErrors();
		shader_obj.information_log_length = shader_obj.information_log.length;
	}

}

