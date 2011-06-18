
function glClearColor(r, g, b, a) {
	var c = cnvgl_state.clear_color;
	c[0] = r > 1 ? 1 : (r < 0 ? 0 : r);
	c[1] = g > 1 ? 1 : (g < 0 ? 0 : g);
	c[2] = b > 1 ? 1 : (b < 0 ? 0 : b);
	c[3] = a > 1 ? 1 : (a < 0 ? 0 : a);
}

