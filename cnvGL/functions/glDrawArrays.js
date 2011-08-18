/*
Copyright (c) 2011 Cimaron Shanahan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


function glDrawArrays(/*GLenum*/ mode, /*GLint*/ first, /*GLsizei*/ count) {

	var buffer = cnvgl_state.bound_buffers[GL_ARRAY_BUFFER];
	var buffer_object = cnvgl_objects[buffer];
	var data = buffer_object.data;

	var processor = cnvgl_state.vertex_processor;

	//gather vertex attributes

	var program = cnvgl_state.current_program;
	var vtas = cnvgl_state.vertex_attrib_arrays;
	var attr_buffers = [];

	var attrs = [];
	for (var a = 0; a < program.active_attributes_count; a++) {
		var attr = program.active_attributes[a];
		attrs[attr.location] = vtas[a];
		if (vtas[a].buffer_obj) {
			attr_buffers[attr.location] = vtas[a].buffer_obj;	
		}
	}

	processor.setMode(mode);

	//each vertex
	for (var i = first; i < count; i++) {

		//build attribute set and initialize
		var vertex_attr = [];
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
		processor.access.gl_PerVertex = vertex_attr;
		processor.sendVertex();
	}
}

