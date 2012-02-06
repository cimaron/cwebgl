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
	 * glActiveTexture — select active texture unit
	 *
	 * @var GLenum   texture  Specifies which texture unit to make active.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glActiveTexture.xml
	 */
	cnvgl.activeTexture = function(texture) {
		var ctx, i;

		ctx = cnvgl.getCurrentContext();
		i = texture - cnvgl.TEXTURE0;

		if (i < 0 || i > (cnvgl.constants.maxTextureUnits - 1)) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}

		ctx.texture.currentUnit = i;
		if (!ctx.texture.unit[i]) {
			ctx.texture.unit[i] = new cnvgl.texture_unit(texture);	
		}
	}


}(cnvgl));

