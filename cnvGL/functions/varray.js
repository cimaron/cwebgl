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


	function cnvgl_vertexAttrib(index, v) {
		var ctx, buffer_obj, vtx_attrib_obj;
	
		ctx = cnvgl_context.getCurrentContext();
	
		if (index > GL_MAX_VERTEX_ATTRIBS) {
			cnvgl_throw_error(GL_INVALID_VALUE);
			return;			
		}
	
		vtx_attrib_obj = ctx.array.arrayObj.vertexAttrib[index];
		vtx_attrib_obj.size = v.length;
		vtx_attrib_obj.type = GL_FLOAT;
		vtx_attrib_obj.normalized = false;
		vtx_attrib_obj.stride = 0;
		vtx_attrib_obj.pointer = 0;	
		vtx_attrib_obj.buffer_obj = false;
		vtx_attrib_obj.value = v;
	}


	/**
	 * glEnableVertexAttribArray — Enable or disable a generic vertex attribute array
	 *
	 * @var GLuint  index  Specifies the index of the generic vertex attribute to be enabled or disabled.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glEnableVertexAttribArray.xml
	 */
	cnvgl.enableVertexAttribArray = function(index) {
		var ctx;

		ctx = cnvgl_context.getCurrentContext();
	
		//out of bounds
		if (index >= ctx.const.maxVertexAttribs || index < 0) {
			cnvgl_throw_error(GL_INVALID_VALUE);
			return;
		}

		ctx.array.arrayObj.vertexAttrib[index].enabled = GL_TRUE;	
	};


	/**
	 * glDisableVertexAttribArray — Enable or disable a generic vertex attribute array
	 *
	 * @var GLuint  index  Specifies the index of the generic vertex attribute to be enabled or disabled.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glEnableVertexAttribArray.xml
	 */
	cnvgl.disableVertexAttribArray = function(index) {
		var ctx;
		
		ctx = cnvgl_context.getCurrentContext();
	
		//out of bounds
		if (index >= GPU.shader.MAX_VERTEX_ATTRIBS || index < 0) {
			cnvgl_throw_error(GL_INVALID_VALUE);
			return;
		}
	
		ctx.array.arrayObj.vertexAttrib[index].enabled = GL_FALSE;
	};


	/**
	 * glVertexAttrib1d — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint    index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLdouble  v0     Specifies the new values to be used for the specified vertex attribute.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib1d = function(index, v0) {
		cnvgl_vertexAttrib(index, [v0]);
	};


	/**
	 * glVertexAttrib1f — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint   index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLfloat  v0     Specifies the new values to be used for the specified vertex attribute.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib1f = function(index, v0) {
		cnvgl_vertexAttrib(index, [v0]);
	};


	/**
	 * glVertexAttrib1s — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint   index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLshort  v0     Specifies the new values to be used for the specified vertex attribute.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib1s = function(index, v0) {
		cnvgl_vertexAttrib(index, [v0]);
	};


	/**
	 * glVertexAttrib2d — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint    index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLdouble  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLdouble  v1
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib2d = function(index, v0, v1) {
		cnvgl_vertexAttrib(index, [v0, v1]);
	};


	/**
	 * glVertexAttrib2f — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint   index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLfloat  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLfloat  v1
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib2f = function(index, v0, v1) {
		cnvgl_vertexAttrib(index, [v0, v1]);
	};


	/**
	 * glVertexAttrib2s — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint   index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLshort  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLshort  v1
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib2s = function(index, v0, v1) {
		cnvgl_vertexAttrib(index, [v0, v1]);
	};


	/**
	 * glVertexAttrib3d — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint    index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLdouble  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLdouble  v1
	 * @var GLdouble  v2
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib3d = function(index, v0, v1, v2) {
		cnvgl_vertexAttrib(index, [v0, v1, v2]);
	};


	/**
	 * glVertexAttrib3f — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint   index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLfloat  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLfloat  v1
	 * @var GLfloat  v2
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib3f = function(index, v0, v1, v2) {
		cnvgl_vertexAttrib(index, [v0, v1, v2]);
	};


	/**
	 * glVertexAttrib3s — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint   index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLshort  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLshort  v1
	 * @var GLshort  v2
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib3s = function(index, v0, v1, v2) {
		cnvgl_vertexAttrib(index, [v0, v1, v2]);
	};


	/**
	 * glVertexAttrib4d — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint    index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLdouble  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLdouble  v1
	 * @var GLdouble  v2
	 * @var GLdouble  v3
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib4d = function(index, v0, v1, v2, v3) {
		cnvgl_vertexAttrib(index, [v0, v1, v2, v3]);
	};


	/**
	 * glVertexAttrib4f — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint   index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLfloat  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLfloat  v1
	 * @var GLfloat  v2
	 * @var GLfloat  v3
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib4f = function(index, v0, v1, v2, v3) {
		cnvgl_vertexAttrib(index, [v0, v1, v2, v3]);
	};


	/**
	 * glVertexAttrib4s — Specifies the value of a generic vertex attribute
	 *
	 * @var GLuint   index  Specifies the index of the generic vertex attribute to be modified.
	 * @var GLshort  v0     Specifies the new values to be used for the specified vertex attribute.
	 * @var GLshort  v1
	 * @var GLshort  v2
	 * @var GLshort  v3
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttrib.xml
	 */
	cnvgl.vertexAttrib4s = function(index, v0, v1, v2, v3) {
		cnvgl_vertexAttrib(index, [v0, v1, v2, v3]);
	};



	/**
	 * glVertexAttribPointer — define an array of generic vertex attribute data
	 *
	 * @var GLuint     index       Specifies the index of the generic vertex attribute to be modified.
	 * @var GLint      size        Specifies the number of components per generic vertex attribute.
	 * @var GLenum     type        Specifies the data type of each component in the array.
	 * @var GLboolean  normalized  Specifies whether fixed-point data values should be normalized (GL_TRUE) or converted directly as fixed-point values (GL_FALSE) when they are accessed.
	 * @var GLsizei    stride      Specifies the byte offset between consecutive generic vertex attributes.
	 * @var [GLvoid]   pointer     Specifies a pointer to the first component of the first generic vertex attribute in the array.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glVertexAttribPointer.xml
	 */
	function glVertexAttribPointer(index, size, type, normalized, stride, pointer) {
		var ctx, buffer_obj, vtx_attrib_obj;
	
		ctx = cnvgl_context.getCurrentContext();
	
		if (index > GL_MAX_VERTEX_ATTRIBS) {
			cnvgl_throw_error(GL_INVALID_VALUE);
			return;			
		}
	
		if (size < 1 || size > 4) {
			cnvgl_throw_error(GL_INVALID_VALUE);
			return;
		}
		
	
		if ([GL_BYTE, GL_UNSIGNED_BYTE, GL_SHORT, GL_UNSIGNED_SHORT, GL_INT, GL_UNSIGNED_INT, GL_FLOAT, GL_DOUBLE].indexOf(type) == -1) {
			cnvgl_throw_error(GL_INVALID_ENUM);
			return;			
		}
	
		if (stride < 0) {
			cnvgl_throw_error(GL_INVALID_VALUE);
			return;			
		}

		//check for buffer
		buffer_obj = ctx.array.arrayBufferObj;
	
		vtx_attrib_obj = ctx.array.arrayObj.vertexAttrib[index];
		vtx_attrib_obj.size = size;
		vtx_attrib_obj.type = type;
		vtx_attrib_obj.normalized = normalized;
		vtx_attrib_obj.stride = stride;
		vtx_attrib_obj.pointer = pointer;	
		vtx_attrib_obj.buffer_obj = buffer_obj;
	};


}(cnvgl));

