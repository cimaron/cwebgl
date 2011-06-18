
function glGenTextures(n, buffers) {

	if (n < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	var list = [], buffer, ref;

	for (var i = 0; i < n; i++) {
		texture = new cnvgl_texture();
		cnvgl_objects.push(texture);
		ref = cnvgl_objects.length - 1;
		list.push(ref);
	}

	buffers[0] = list;
}

