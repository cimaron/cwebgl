
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

	program_obj.attached_shaders.push(shader);	
	program_obj.attached_shaders_count++;
	
}

