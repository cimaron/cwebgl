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
		  

	function cnvgl_pixelStore(pname, param) {
		var ctx;

		ctx = cnvgl.getCurrentContext();

		switch (pname) {

			case cnvgl.PACK_ALIGNMENT:
				param = Math.round(param);
				if ([1, 2, 4, 8].indexOf(param) == -1) {
					cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
					return;
				}
				ctx.pack.alignment = param;
				break;

			case cnvgl.UNPACK_ALIGNMENT:
				param = Math.round(param);
				if ([1, 2, 4, 8].indexOf(param) == -1) {
					cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
					return;
				}
				ctx.unpack.alignment = param;
				break;

			default:
				cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
				return;
		}
	}


	/**
	 * glPixelStoref — set pixel storage modes
	 *
	 * @var GLenum   pname   Specifies the symbolic name of the parameter to be set.
	 * @var GLfloat  param   Specifies the value that pname is set to.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glPixelStore.xml
	 */
	cnvgl.pixelStoref = function(pname, param) {
		cnvgl_pixelStore(pname, param);
	};  


	/**
	 * glPixelStorei — set pixel storage modes
	 *
	 * @var GLenum  pname   Specifies the symbolic name of the parameter to be set.
	 * @var GLint   param   Specifies the value that pname is set to.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glPixelStore.xml
	 */
	cnvgl.pixelStorei = function(pname, param) {
		cnvgl_pixelStore(pname, param);
	};


}(cnvgl));

