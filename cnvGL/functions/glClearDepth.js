
function glClearDepth(depth) {

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	cnvgl_state.clear_depth = depth > 1 ? 1 : (depth < 0 ? 0 : depth);
}

