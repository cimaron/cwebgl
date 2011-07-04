
function glDrawArrays(/*GLenum*/ mode, /*GLint*/ first, /*GLsizei*/ count) {

	var buffer = cnvgl_state.bound_buffers[GL_ARRAY_BUFFER];
	var buffer_object = cnvgl_objects[buffer];
	var data = buffer_object.data;

	var processor = cnvgl_state.vertex_processor;
	processor.mode = mode;

	//gather vertex attributes
	
	var program = cnvgl_state.current_program;
	var vtas = cnvgl_state.vertex_attrib_arrays;
	var attr_buffers = [];

	var attrs = {};
	for (var a = 0; a < program.active_attributes_count; a++) {
		var attr = program.active_attributes[a];
		attrs[attr.name] = vtas[a];
		if (vtas[a].buffer_obj) {
			attr_buffers[attr.name] = vtas[a].buffer_obj;	
		}
	}

	processor.setMode(mode);

	//each vertex
	for (var i = first; i < count; i++) {

		//build attribute set and initialize
		var vertex_attr = {};
		for (var j in attrs) {

			var attr = attrs[j];
			var buffer_obj = attr_buffers[j];

			if (buffer_obj) {
				var buffer = buffer_obj.data;
				var stride = attr.stride;
				var size = attr.size;
				
				var start = attr.pointer + (i * size + stride);
				
				//allocation space for data in attributes
				var new_buffer = [];				
				vertex_attr[j] = new_buffer;

				//copy data
				for (var k = 0; k < size; k++) {
					new_buffer[k] = buffer[k + start];
				}
			}
		}

		//get info on how to interpret attribute data
		processor.sendVertex(vertex_attr);
	}

}
