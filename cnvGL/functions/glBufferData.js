
/*void*/
function glBufferData(/*GLenum*/ target, /*GLsizeiptr*/ size, /*const GLVoid* */ data, /*GLenum*/ usage) {

	if (target != GL_ARRAY_BUFFER &&
			target != GL_ELEMENT_ARRAY_BUFFER && 
			target != GL_PIXEL_PACK_BUFFER &&
			target != GL_PIXEL_UNPACK_BUFFER) {

		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	if (usage != GL_STREAM_DRAW &&
			usage != GL_STREAM_READ && 
			usage != GL_STREAM_COPY &&
			usage != GL_STATIC_DRAW &&
			usage != GL_STATIC_READ &&
			usage != GL_STATIC_COPY &&
			usage != GL_DYNAMIC_DRAW &&
			usage != GL_DYNAMIC_READ && 
			usage != GL_DYNAMIC_COPY) {

		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	if (size < 0) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;		
	}

	if (cnvgl_state.bound_buffers[target] == 0) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;					
	}

	//GL_OUT_OF_MEMORY is generated if the GL is unable to create a data store with the specified size.
	//@note: this is pretty unlikely, but we should probably support it by picking an arbitrarily large size and sticking to it

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	var buffer = cnvgl_state.bound_buffers[target];	
	var buffer_obj = cnvgl_objects[buffer];

	buffer_obj.target = target;
	buffer_obj.usage = usage;
	
	if (Float32Array.native) {
		var temp = new Float32Array(data);
		buffer_obj.data = new Float32Array(temp, 0, size);
	} else {
		buffer_obj.data	= new Array(size);
		for (var i = 0; i < size; i++) {
			buffer_obj.data[i] = data[i];
		}
	}
}


