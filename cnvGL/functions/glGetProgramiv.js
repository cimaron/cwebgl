
/*void*/
function glGetProgramiv(/*GLuint*/ program, /*GLenum*/ pname, /*GLint* */ params) {

	//get program
	var program_obj = cnvgl_objects[program];

	//no shader exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a program (BAD!)
	if (!program_obj.instanceOf('cnvgl_program')) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}	


	switch (pname) {

		case GL_DELETE_STATUS:
			params[0] = program_obj.deleting ? GL_TRUE : GL_FALSE;
			break;
		
		case GL_LINK_STATUS:
			params[0] = program_obj.link_status;
			break;
		
		case GL_VALIDATE_STATUS:
			params[0] = program_obj.validate_status ? GL_TRUE : GL_FALSE;
			break;
		
		case GL_INFO_LOG_LENGTH:
			params[0] = program_obj.info_log.length;
			break;

		case GL_ATTACHED_SHADERS:
			params[0] = 0;
			for (var i in program_obj.vertex_shaders) {
				params[0]++;
			}
			for (var i in program_obj.fragment_shaders) {
				params[0]++;
			}
			break;
		
		case GL_ACTIVE_ATTRIBUTES:
			params[0] = 0;
			for (var i in program_obj.attribute_locations) {
				params[0]++;
			}
			break;

		case GL_ACTIVE_ATTRIBUTE_MAX_LENGTH:
			params[0] = 0;
			for (var i in program_obj.attribute_locations) {
				if (params[0] < i.length) {
					params[0] = i.length;
				}
			}
			break;
		
		case GL_ACTIVE_UNIFORMS:
			params[0] = 0;
			for (var i in program_obj.uniform_locations) {
				params[0]++;
			}		
			break;

		case GL_ACTIVE_UNIFORM_MAX_LENGTH:
			params[0] = 0;
			for (var i in program_obj.uniform_locations) {
				if (params[0] < i.length) {
					params[0] = i.length;
				}
			}
			break;
		
		default:
			cnvgl_throw_error(GL_INVALID_ENUM);
			return;
	}
}

