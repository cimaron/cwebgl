
function glGenBuffers(n, buffers) {

	var list = [], buffer, ref;
	
	for (var i = 0; i < n; i++) {
		buffer = new cnvgl_buffer();
		cnvgl_objects.push(buffer);
		ref = cnvgl_objects.length - 1;
		list.push(ref);
	}

	buffers[0] = list;
}

