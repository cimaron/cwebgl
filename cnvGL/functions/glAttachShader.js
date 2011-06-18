
/*void*/
function glAttachShader(/*GLuint*/ program, /*GLuint*/ shader) {

	/*if (shader compiler not supported) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
	} */

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	//get objects
	var shader_obj = cnvgl_objects[shader];
	var program_obj = cnvgl_objects[program];

	//program or shader does not exist
	if (!program_obj || !shader_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//objects are not what they should be
	if (!program_obj.instanceOf('cnvgl_program') || !shader_obj.instanceOf('cnvgl_shader')) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	var attach;
	if (shader_obj.type == GL_FRAGMENT_SHADER) {
		attach = program_obj.fragment_shaders;
	} else {
		attach = program_obj.vertex_shaders;
	}
	
	if (attach[shader]) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;			
	}
	
	//be careful with garbage collection (circular reference, need to clean up on destruct)
	attach[shader] = shader_obj;
	shader_obj.programs[program] = program_obj;
}

