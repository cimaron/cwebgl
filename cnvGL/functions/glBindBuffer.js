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


function glBindBuffer(target, buffer) {
	var ctx, buffer_obj;

	ctx = cnvgl_context.getCurrentContext();
	
	if (buffer != 0) {
	
		buffer_obj = cnvgl_objects[buffer];
	
		//buffer does not exist
		if (!buffer_obj) {
			cnvgl_throw_error(GL_INVALID_VALUE);
			return;
		}
	
		//not a buffer object
		if (!buffer_obj instanceof cnvgl_buffer) {
			cnvgl_throw_error(GL_INVALID_OPERATION);
			return;
		}

		buffer_obj.access = GL_READ_WRITE;
		buffer_obj.usage = GL_STATIC_DRAW;

	} else {
		buffer_obj = null;	
	}

	switch (target) {
		case GL_ARRAY_BUFFER:
			ctx.array.arrayBufferObj = buffer_obj;
			break;
		case GL_ELEMENT_ARRAY_BUFFER:
			ctx.array.elementArrayBufferObj = buffer_obj;
			break;
		default:
			cnvgl_throw_error(GL_INVALID_ENUM);
	}
}

