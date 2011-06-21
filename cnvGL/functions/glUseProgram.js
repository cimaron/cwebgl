
/*void*/
function glUseProgram(/*GLuint*/ program) {

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	if (program == 0) {
		cnvgl_state.vertex_executable = null;
		cnvgl_state.fragment_executable = null;
		return;
	}

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

	if (program_obj.vertex_object_code) {
		program_obj.vertex_executable = eval("function(m) { "+program_obj.vertex_object_code+" ;main();}");
	}

	if (program_obj.vertex_object_code) {
		program_obj.vertex_executable = eval("function(m) { "+program_obj.fragment_object_code+" ;main();}");
	}
	
	cnvgl_state.current_program = program_obj;
	
}

