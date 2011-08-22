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

	if (target != GL_ARRAY_BUFFER && target != GL_ELEMENT_ARRAY_BUFFER) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	//@note: In the future, we probably should create the object here, not in glGenBuffers

	//Initialize buffer object if necessary
	/*
	if (buffer != 0) {
		var buffer_obj = cnvgl_objects[buffer];
		buffer_obj.target = target;
		buffer_obj.data = null;
		buffer_obj.usage = GL_STATIC_DRAW;
		//buffer_obj.access = GL_READ_WRITE;
	}
	*/

	cnvgl_context.getCurrentContext().bound_buffers[target] = buffer;
}

