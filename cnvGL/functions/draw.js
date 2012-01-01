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


function glDrawArrays(mode, first, count) {
	var ctx, renderer, program_obj, i, vertex, a, buffer_obj, buffer_data, attr, data, vtx_data, start, k;

	ctx = cnvgl_context.getCurrentContext();
	renderer = ctx.renderer;
	program_obj = ctx.shader.activeProgram;

	renderer.setMode(mode);

	//each vertex
	for (i = first; i < count; i++) {

		vertex = new cnvgl_vertex();

		//initialize attributes for vertex
		for (a in program_obj.attributes.active) {
			attr = program_obj.attributes.active[a];

			data = ctx.vertex_attrib_arrays[attr.location];
			//no buffer data was specified for this attribute
			if (!(buffer_obj = data.buffer_obj)) {
				continue;
			}

			buffer_data = buffer_obj.getData();
			start = (data.pointer / buffer_data.BYTES_PER_ELEMENT) + (i * data.size + data.stride);

			GPU.memcpy(vertex.attributes, attr.location * 4, buffer_data, attr.size, start);
		}

		renderer.send(vertex);
	}

	renderer.end();
}


function glDrawElements(mode, count, type, indices) {
	var ctx, renderer, program_obj, buffer_obj, elements, i, vertex, index, a, buffer, buffer_data, attr, data, vtx_data, start, k;

	ctx = cnvgl_context.getCurrentContext();
	renderer = ctx.renderer;
	program_obj = ctx.shader.activeProgram;

	renderer.setMode(mode);

	buffer_obj = ctx.array.elementArrayBufferObj;
	elements = buffer_obj.getData();

	//each vertex
	for (i = 0; i < count; i++) {

		vertex = new cnvgl_vertex();

		index = elements[i + indices];

		//initialize attributes for vertex
		for (a in program_obj.attributes.active) {
			attr = program_obj.attributes.active[a];

			data = ctx.vertex_attrib_arrays[attr.location];
			//no buffer data was specified for this attribute
			if (!(buffer_obj = data.buffer_obj)) {
				continue;
			}

			buffer_data = buffer_obj.getData(Float32Array);

			start = (data.pointer / buffer_data.BYTES_PER_ELEMENT) + (index * data.size + data.stride);

			GPU.memcpy(vertex.attributes, attr.location * 4, buffer_data, attr.size, start);
		}

		renderer.send(vertex);
	}

	renderer.end();
}

