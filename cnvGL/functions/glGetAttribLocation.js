
/*void*/
function glGetAttribLocation(/*GLuint*/ program, name) {

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	//get program
	var program_obj = cnvgl_objects[program];

	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
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

	var t = program_obj.active_attributes;
	for (var i = 0; i < program_obj.active_attributes_count; i++) {
		if (t[i].name == name) {
			return t[i].location;
		}
	}

	return -1;
}

