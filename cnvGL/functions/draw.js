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

	function uploadAttributes(ctx) {
		var program_obj, array_objs, array_obj, a, attrib_objs, attrib_obj, data, buffer_obj, data;

		program_obj = ctx.shader.activeProgram;
		array_objs = ctx.array.arrayObj.vertexAttrib;
		attrib_objs = program_obj.attributes.active;

		//initialize attributes for vertex
		for (a = 0; a < program_obj.attributes.active.length; a++) {

			attrib_obj = attrib_objs[a];
			array_obj = array_objs[attrib_obj.location];

			ctx.driver.uploadAttributes(ctx,
										attrib_obj.location,
										array_obj.size,
										array_obj.stride,
										array_obj.pointer,
										array_obj.buffer_obj.data);
		}		
	}

	/**
	 * glDrawArrays — render primitives from array data
	 *
	 * @var GLenum   mode   Specifies what kind of primitives to render.
	 * @var GLint    first  Specifies the starting index in the enabled arrays.
	 * @var GLsizei  count  Specifies the number of indices to be rendered.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glDrawArrays.xml
	 */
	cnvgl.drawArrays = function(mode, first, count) {
		var ctx;
		ctx = cnvgl.getCurrentContext();
		uploadAttributes(ctx);
		ctx.driver.drawArrays(ctx, mode, first, count);
	};

	/**
	 * glDrawElements — render primitives from array data
	 *
	 * @var GLenum    mode     Specifies what kind of primitives to render.
	 * @var GLsizei   count    Specifies the number of elements to be rendered.
	 * @var GLenum    type     Specifies the type of the values in indices.
	 * @var [GLvoid]  indices  Specifies a pointer to the location where the indices are stored.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glDrawElements.xml
	 */
	cnvgl.drawElements = function(mode, count, type, indices) {
		var ctx;
		ctx = cnvgl.getCurrentContext();
		uploadAttributes(ctx);
		ctx.driver.drawElements(ctx, mode, indices, count, type);
	};
		
}(cnvgl));

