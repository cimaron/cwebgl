
/*void*/
function glGetShaderiv(/*GLuint*/ shader, /*GLenum*/ pname, /*GLint* */ params) {

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

	switch (pname) {
		case GL_SHADER_TYPE:
			params[0] = shader_obj.type;
			break;
		case GL_DELETE_STATUS:
			params[0] = shader_obj.deleting ? GL_TRUE : GL_FALSE;
			break;
		case GL_COMPILE_STATUS:
			params[0] = shader_obj.compile_status ? GL_TRUE : GL_FALSE;
			break;
		case GL_INFO_LOG_LENGTH:
			params[0] = shader_obj.info_log.length;
			break;
		case GL_SHADER_SOURCE_LENGTH:
			params[0] = shader_obj.source.length;
			break;
		default:
			cnvgl_throw_error(GL_INVALID_ENUM);
			return;
	}
}

