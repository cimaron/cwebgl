
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

	//get source
	var shader_source = shader_obj.source;
	
	var compiler = new ShaderCompiler(shader_obj.type);
	compiler.compile(shader_source, shader_obj);
}

