
function glBindTexture(target, texture) {
	
	if (target != GL_TEXTURE_1D || target != GL_TEXTURE_2D
			|| target != GL_TEXTURE_3D || target != GL_TEXTURE_CUBE_MAP) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	var texture_obj = cnvgl_objects[texture];

	if (!texture_obj
		|| !texture_obj.instanceOf('cnvgl_texture')
		|| (texture_obj.target && texture_obj.target != target)) {

		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */
	texture_obj.target = target;
	
}

