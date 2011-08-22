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


function glVertexAttribPointer(index, size, type, normalized, stride, pointer) {

	var state;
	state = cnvgl_context.getCurrentContext();

	if (index > GL_MAX_VERTEX_ATTRIBS) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;			
	}

	if (size < 1 || size > 4) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}
	
	var valid_types = [GL_BYTE, GL_UNSIGNED_BYTE, GL_SHORT, GL_UNSIGNED_SHORT, GL_INT, GL_UNSIGNED_INT, GL_FLOAT, GL_DOUBLE];
	
	if (valid_types.indexOf(type) == -1) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;			
	}
	
	if (stride < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;			
	}

	var buffer, buffer_obj;
	//check for buffer
	if (buffer = state.bound_buffers[GL_ARRAY_BUFFER]) {
		buffer_obj = cnvgl_objects[buffer];
	}

	var vertex_attribute = state.vertex_attrib_arrays[index];
	vertex_attribute.size = size;
	vertex_attribute.type = type;
	vertex_attribute.normalized = normalized;
	vertex_attribute.stride = stride;
	vertex_attribute.pointer = pointer;	
	vertex_attribute.buffer_obj = buffer_obj;

}

