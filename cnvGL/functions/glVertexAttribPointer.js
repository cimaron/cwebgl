
function glVertexAttribPointer(/*GLuint*/ index, /*GLint*/ size, /*GLenum*/ type, /*GLboolean*/ normalized,
							   /*GLsizei*/ stride, /*GLvoid*/ pointer) {

	if (index > GL_MAX_VERTEX_ATTRIBS) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;			
	}
	
	if (size < 1 || size > 4) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}
	
	var valid_types = [GL_BYTE, GL_UNSIGNED_BYTE, GL_SHORT, GL_UNSIGNED_SHORT, GL_INT, GL_UNSIGNED_INT, GL_FLOAT, GL_DOUBLE];
	
	if (valid_types.indexOf(type)) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;			
	}
	
	if (stride < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;			
	}

	var vertex_attribute = cvngl_state.vertex_attributes[index];
	vertex_attribute.size = size;
	vertex_attribute.type = type;
	vertex_attribute.normalized = normalized;
	vertex_attribute.stride = stride;
	vertex_attribute.pointer = pointer;

}
