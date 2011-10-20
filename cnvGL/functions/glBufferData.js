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
	var ctx, buffer_obj, data_type, view, temp, i;

	ctx = cnvgl_context.getCurrentContext();

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
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	switch (target) {
		case GL_ARRAY_BUFFER:
			buffer_obj = ctx.array.arrayBufferObj;
			break;
		case GL_ELEMENT_ARRAY_BUFFER:
			buffer_obj = ctx.array.elementArrayBufferObj;
			break;
		default:
			cnvgl_throw_error(GL_INVALID_ENUM);
			return;
	}
	
	if (!buffer_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	buffer_obj.target = target;
	buffer_obj.usage = usage;
	buffer_obj.size = size;

	data_type = TypedArray.getType(data);
	view = ArrayBuffer(size);
	if (data) {
		size /= data_type.BYTES_PER_ELEMENT;
		if (ArrayBuffer.native) {
			temp = data_type(view);
		} else {
			temp = view;	
		}
		for (i = 0; i < size; i++) {
			temp[i] = data[i];
		}
	}

	if (data_type != ArrayBuffer) {
		buffer_obj.data_type = data_type;
	}
	buffer_obj.data = view;
}


