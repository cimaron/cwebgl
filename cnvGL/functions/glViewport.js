

function glViewport(x, y, width, height) {

	if (width < 0 || height < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	cnvgl_state.viewport_x = x;
	cnvgl_state.viewport_y = y;
	cnvgl_state.viewport_w = width;
	cnvgl_state.viewport_h = height;
}

