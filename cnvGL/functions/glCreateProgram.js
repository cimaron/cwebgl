
/*GLuint*/
function glCreateProgram() {

	//if error occurs creating program
	//	return 0;

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	var program = new cnvgl_program();

	cnvgl_objects.push(program);
	var ref = cnvgl_objects.length - 1;
	return ref;
}

