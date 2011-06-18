
function glBindBuffer(target, buffer) {
	
	if (target != GL_ARRAY_BUFFER || target != GL_ELEMENT_ARRAY_BUFFER) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	
	
}

