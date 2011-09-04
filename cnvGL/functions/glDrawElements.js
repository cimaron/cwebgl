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
	var ctx, renderer, program, elements, vtas, active_attrs, attr_buffers, prgm_attr_loc, i;

	ctx = cnvgl_context.getCurrentContext();
	renderer = ctx.renderer;
	program = ctx.current_program;

	renderer.setMode(mode);

	elements = cnvgl_objects[ctx.bound_buffers[GL_ELEMENT_ARRAY_BUFFER]];

	//gather vertex attributes

	vtas = ctx.vertex_attrib_arrays;

	active_attrs = [];
	attr_buffers = [];
	for (i = 0; i < program.active_attributes_count; i++) {
		
		prgm_attr_loc = program.active_attributes[i].location;

		active_attrs[prgm_attr_loc] = vtas[i];
		if (vtas[i].buffer_obj) {
			attr_buffers[prgm_attr_loc] = vtas[i].buffer_obj.data;
		}
	}

	//generate primitive/vertices
	var vertex, attr_data, vtx_attr_data, attr, start, stride, size, index, j, k;
	
	//each vertex
	for (i = 0; i < count; i++) {

		vertex = new cnvgl_vertex();

		index = elements.data[i];

		//build attribute set and initialize
		for (j = 0; j < active_attrs.length; j++) {

			//no buffer data was specified for this attribute
			if (!(attr_data = attr_buffers[j])) {
				continue;
			}

			attr = active_attrs[j];

			vtx_attr_data = [];
			vertex.attributes[j] = vtx_attr_data;

			stride = attr.stride;
			size = attr.size;
			start = attr.pointer + (index * size + stride);

			//can replace the following with TypedArray view
			for (k = 0; k < size; k++) {
				vtx_attr_data[k] = attr_data[k + start];
			}
		}

		renderer.send(vertex);
	}

	renderer.end();
}

