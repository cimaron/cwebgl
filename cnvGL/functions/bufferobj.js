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


(function(cnvgl) {


	/**
	 * glBindBuffer — bind a named buffer object
	 *
	 * @var GLenum  target  Specifies the target to which the buffer object is bound.
	 * @var GLuint  buffer  Specifies the name of a buffer object.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glBindBuffer.xml
	 */
	cnvgl.bindBuffer = function(target, buffer) {
		var ctx, buffer_obj;

		ctx = cnvgl.getCurrentContext();

		if (buffer != 0) {

			buffer_obj = ctx.shared.bufferObjects[buffer];

			//buffer does not exist
			if (!buffer_obj) {
				cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
				return;
			}

			//not a buffer object
			if (!buffer_obj instanceof cnvgl.buffer) {
				cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
				return;
			}

			buffer_obj.access = cnvgl.READ_WRITE;
			buffer_obj.usage = cnvgl.STATIC_DRAW;
	
		} else {
			buffer_obj = null;	
		}
	
		switch (target) {
			case cnvgl.ARRAY_BUFFER:
				ctx.array.arrayBufferObj = buffer_obj;
				break;
			case cnvgl.ELEMENT_ARRAY_BUFFER:
				ctx.array.elementArrayBufferObj = buffer_obj;
				break;
			default:
				cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
		}
	};


	/**
	 * glBufferData — creates and initializes a buffer object's data store
	 *
	 * @var GLenum      target  Specifies the target buffer object.
	 * @var GLsizeiptr  size    Specifies the size in bytes of the buffer object's new data store.
	 * @var [GLvoid?]   data    Specifies a pointer to data that will be copied into the data store for initialization, or NULL if no data is to be copied.
	 * @var GLenum      usage   Specifies the expected usage pattern of the data store.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glBufferData.xml
	 */
	cnvgl.bufferData = function(target, size, data, usage) {
		var ctx, buffer_obj, data_type, view, temp, i;

		ctx = cnvgl.getCurrentContext();
	
		if (usage != cnvgl.STREAM_DRAW &&
				usage != cnvgl.STREAM_READ && 
				usage != cnvgl.STREAM_COPY &&
				usage != cnvgl.STATIC_DRAW &&
				usage != cnvgl.STATIC_READ &&
				usage != cnvgl.STATIC_COPY &&
				usage != cnvgl.DYNAMIC_DRAW &&
				usage != cnvgl.DYNAMIC_READ && 
				usage != cnvgl.DYNAMIC_COPY) {
	
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}
	
		if (size < 0) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		switch (target) {
			case cnvgl.ARRAY_BUFFER:
				buffer_obj = ctx.array.arrayBufferObj;
				break;
			case cnvgl.ELEMENT_ARRAY_BUFFER:
				buffer_obj = ctx.array.elementArrayBufferObj;
				break;
			default:
				cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
				return;
		}
		
		if (!buffer_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}

		buffer_obj.target = target;
		buffer_obj.usage = usage;
		buffer_obj.size = size;

		if (data) {
			buffer_obj.bpe = data.BYTES_PER_ELEMENT;
			size /= buffer_obj.bpe;
			buffer_obj.data = cnvgl.malloc(size);
			cnvgl.memcpy(buffer_obj.data, 0, data, size, 0);
		}
	};


	/**
	 * glBufferSubData — updates a subset of a buffer object's data store
	 *
	 * @var GLenum      target  Specifies the target buffer object.
	 * @var GLintptr    offset  Specifies the offset into the buffer object's data store where data replacement will begin, measured in bytes.
	 * @var GLsizeiptr  size    Specifies the size in bytes of the data store region being replaced.
	 * @var [GLvoid]    data    Specifies a pointer to the new data that will be copied into the data store.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glBufferSubData.xml
	 */
	cnvgl.bufferSubData = function(target, offset, size, data) {
		var ctx, buffer_obj, i;

		ctx = cnvgl.getCurrentContext();

		switch (target) {
			case cnvgl.ARRAY_BUFFER:
				buffer_obj = ctx.array.arrayBufferObj;
				break;
			case cnvgl.ELEMENT_ARRAY_BUFFER:
				bufer_obj = ctx.array.elementArrayBufferObj;
				break;
			default:
				cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
				return;
		}

		if (!buffer_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}

		if (offset < 0 || size < 0 || offset + size > buffer_obj.size) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}

		if (!buffer_obj.data) {
			//this won't work 100% of the time (if we bufferSubData with a different type)
			buffer_obj.bpe = data.BYTES_PER_ELEMENT;
			buffer_obj.data = cnvgl.malloc(buffer_obj.size / buffer_obj.bpe);
		}

		size /= buffer_obj.bpe;
		offset /= buffer_obj.bpe;

		for (i = 0; i < size; i++) {
			buffer_obj.data[offset + i] = data[i];
		}
	};


	/**
	 * glGenBuffers — generate buffer object names
	 *
	 * @var GLsizei   n        Specifies the number of buffer object names to be generated.
	 * @var [GLuint]  buffers  Specifies an array in which the generated buffer object names are stored.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGenBuffers.xml
	 */
	cnvgl.genBuffers = function(n, buffers) {
		var ctx, list, buffer_obj, name, i;

		ctx = cnvgl.getCurrentContext();
		list = [];

		for (i = 0; i < n; i++) {
			buffer_obj = new cnvgl.buffer();
			name = cnvgl.context.findFreeName(ctx.shared.bufferObjects);
			ctx.shared.bufferObjects[name] = buffer_obj;			
			list.push(name);
		}

		buffers[0] = list;
	}


}(cnvgl));

