
/*void*/
function glEnableVertexAttribArray(index) {

	//out of bounds
	if (index > cnvgl_device.GL_MAX_VERTEX_ATTRIBS - 1 || index < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	cnvgl_state.vertex_attributes[index] = new cnvgl_vertex_attribute();
}

function glDisableVertexAttribArray(index) {

	//out of bounds
	if (index > cnvgl_device.GL_MAX_VERTEX_ATTRIBS - 1 || index < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	cnvgl_state.vertex_attributes[index] = null;
}
