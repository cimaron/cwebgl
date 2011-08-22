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


function glBufferData(target, size, data, usage) {

	var state, i;
	state = cnvgl_context.getCurrentContext();

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

	if (state.bound_buffers[target] == 0) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;					
	}

	//GL_OUT_OF_MEMORY is generated if the GL is unable to create a data store with the specified size.
	//@note: this is pretty unlikely, but we should probably support it by picking an arbitrarily large size and sticking to it

	/*if (between glBegin and glEnd) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return 0;
	} */

	var buffer = state.bound_buffers[target];	
	var buffer_obj = cnvgl_objects[buffer];

	buffer_obj.target = target;
	buffer_obj.usage = usage;
	
	if (Float32Array.native) {
		var temp = new Float32Array(data);
		buffer_obj.data = new Float32Array(temp, 0, size);
	} else {
		buffer_obj.data	= new Array(size);
		for (i = 0; i < size; i++) {
			buffer_obj.data[i] = data[i];
		}
	}
}


