
/*void*/
function glGetUniformLocation(/*GLuint*/ program, name) {

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	//get program
	var program_obj = cnvgl_objects[program];

	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a program (BAD!)
	if (!program_obj.instanceOf('cnvgl_program')) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}	

	if (!program_obj.link_status) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (typeof program_obj.uniform_locations[name] == 'undefined' || name.indexOf('gl_') === 0) {
		return -1;
	}
	
	return program_obj.uniform_locations[name];
}

