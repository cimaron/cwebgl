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


function glDrawElements(mode, count, type, indices) {
	var ctx, renderer, program, attr_data, i, loc, vertex, index, j, buffer, attr, vtx_data, stride, size, start, k;

	ctx = cnvgl_context.getCurrentContext();
	renderer = ctx.renderer;
	program = ctx.current_program;

	renderer.setMode(mode);

	elements = cnvgl_objects[ctx.bound_buffers[GL_ELEMENT_ARRAY_BUFFER]];

	//gather vertex attribute buffers
	attr_data = [];
	for (i in program.active_attributes) {
		loc = program.active_attributes[i].location;
		attr_data[loc] = ctx.vertex_attrib_arrays[loc];
	}

	//each vertex
	for (i = 0; i < count; i++) {

		vertex = new cnvgl_vertex();

		index = elements.data[i];

		//build attribute set and initialize
		for (j = 0; j < attr_data.length; j++) {

			vtx_data = [];
			vertex.attributes[j] = vtx_data;

			//no buffer data was specified for this attribute
			if (!(buffer = attr_data[j].buffer_obj)) {
				continue;
			}

			attr = attr_data[j];
			stride = attr.stride;
			size = attr.size;
			start = attr.pointer + (index * size + stride);

			//can replace the following with TypedArray view
			for (k = 0; k < size; k++) {
				vtx_data[k] = buffer.data[k + start];
			}
		}

		renderer.send(vertex);
	}

	renderer.end();
}

