
function glBindBuffer(target, buffer) {

	if (target != GL_ARRAY_BUFFER && target != GL_ELEMENT_ARRAY_BUFFER) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	//@note: In the future, we probably should create the object here, not in glGenBuffers

	//Initialize buffer object if necessary
	if (buffer != 0) {
		var buffer_obj = cnvgl_objects[buffer];
		buffer_obj.target = target;
		buffer_obj.data = null;
		buffer_obj.usage = GL_STATIC_DRAW;
		//buffer_obj.access = GL_READ_WRITE;
	}	

	//Unbind old buffer
	var old_buffer = cnvgl_state.bound_buffers[target];
	if (old_buffer != 0) {
		var old_buffer_object = cnvgl_objects[old_buffer];
		old_buffer_object.target = null;
		old_buffer_object.data = null;
	}

	cnvgl_state.bound_buffers[target] = buffer;
}

