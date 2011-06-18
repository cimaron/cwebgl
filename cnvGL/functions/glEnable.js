

function glEnable(cap) {
	switch (cap) {
		case GL_DEPTH_TEST:
			cnvgl_state[cap] = GL_TRUE;
			return;
		default:
			throw new Error('');
	}
}

