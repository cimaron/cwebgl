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
	var ctx, renderer, program, buffer_obj, elements, i, vertex, index, name, buffer, buffer_data, attr, data, vtx_data, start, k;

	ctx = cnvgl_context.getCurrentContext();
	renderer = ctx.renderer;
	program = ctx.current_program;

	renderer.setMode(mode);

	buffer_obj = ctx.array.elementArrayBufferObj;
	elements = buffer_obj.getData();

	//each vertex
	for (i = 0; i < count; i++) {

		vertex = new cnvgl_vertex();

		index = elements[i + indices];

		//initialize attributes for vertex
		for (name in program.active_attributes) {
			
			attr = program.active_attributes[name];

			vtx_data = [];
			vertex.attributes[attr.location] = vtx_data;
			//initialize

			data = ctx.vertex_attrib_arrays[attr.location];

			//no buffer data was specified for this attribute
			if (!(buffer = data.buffer_obj)) {
				continue;
			}
			
			buffer_data = buffer.getData(Float32Array);

			start = (data.pointer / buffer_data.BYTES_PER_ELEMENT) + (index * data.size + data.stride);

			for (k = 0; k < attr.size; k++) {
				if (k < data.size) {
					vtx_data[k] = buffer_data[k + start];
				} else {
					vtx_data[k] = 0;
				}
			}
			if (attr.size == 1) {
				vertex.attributes[attr.location] = vtx_data[0];
			}
		}

		renderer.send(vertex);
	}

	renderer.end();
}

