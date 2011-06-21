
function glClearColor(r, g, b, a) {

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	var c = cnvgl_state.clear_color;
	
	c[0] = Math.round(255 * (r > 1 ? 1 : (r < 0 ? 0 : r)), 0);
	c[1] = Math.round(255 * (g > 1 ? 1 : (g < 0 ? 0 : g)), 0);
	c[2] = Math.round(255 * (b > 1 ? 1 : (b < 0 ? 0 : b)), 0);
	c[3] = Math.round(255 * (a > 1 ? 1 : (a < 0 ? 0 : a)), 0);	
}

