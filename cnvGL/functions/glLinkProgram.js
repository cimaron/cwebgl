
/*void*/
function glLinkProgram(/*GLuint*/ program) {

	//if (not supported) then
	//	cnvgl_throw_error(GL_INVALID_OPERATION);
	//endif
	
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

	//link error conditions:
	//The number of active attribute variables supported by the implementation has been exceeded.

	var linker = new ShaderLinker(program_obj);
	linker.link(program_obj.vertex_shaders);
	linker.link(program_obj.fragment_shaders);
}

