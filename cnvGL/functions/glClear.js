
function glClear(mask) {

	//mask = mask & (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_ACCUM_BUFFER_BIT | and GL_STENCIL_BUFFER_BIT);

	if (mask & ~(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_ACCUM_BUFFER_BIT | GL_STENCIL_BUFFER_BIT)) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}
	
	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	var buffer, clear;

	//GL_COLOR_BUFFER_BIT
	if (mask & GL_COLOR_BUFFER_BIT) {
		buffer = cnvgl_state.color_buffer;
		clear = cnvgl_state.clear_color;
		for (var i = 0, l = buffer.length; i < l; i += 4) {
			buffer[i] = clear[0];
			buffer[i + 1] = clear[1];
			buffer[i + 2] = clear[2];
			buffer[i + 3] = clear[3];
		}
	}

	//GL_DEPTH_BUFFER_BIT
	if (mask & GL_DEPTH_BUFFER_BIT) {
		buffer = cnvgl_state.depth_buffer;
		clear = cnvgl_state.clear_depth;
		for (var i = 0, l = buffer.length; i < l; i ++) {
			buffer[i] = clear[0];
		}
	}

	if (mask & ~(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT)) {
		throw new Error('glClear: todo');
	}

}

