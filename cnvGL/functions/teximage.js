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
	 * glTexImage2D — specify a two-dimensional texture image
	 *
	 * @var GLenum    target          Specifies the target texture.
	 * @var GLint     level           Specifies the level-of-detail number.
	 * @var GLint     internalFormat  Specifies the number of color components in the texture.
	 * @var GLsizei   width           Specifies the width of the texture image.
	 * @var GLsizei   height          Specifies the height of the texture image, or the number of layers in a texture array, in the case of the GL_TEXTURE_1D_ARRAY and GL_PROXY_TEXTURE_1D_ARRAY targets.
	 * @var GLint     border          This value must be 0.
	 * @var GLenum    format          Specifies the format of the pixel data.
	 * @var GLenum    type            Specifies the data type of the pixel data.
	 * @var [GLvoid]  data            Specifies a pointer to the image data in memory.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glTexImage2D.xml
	 */
	cnvgl.texImage2D = function(target, level, internalFormat, width, height, border, format, type, data) {
		var ctx;

		ctx = cnvgl.getCurrentContext();

		teximage(ctx, 2, target, level, internalFormat, width, height, 1, border, format, type, data);
	};




	function teximage(ctx, dims, target, level, internalFormat, width, height, depth, border, format, type, data) {

		var unit, texture_unit, texture_obj, texture_img, size, a, n, s, k, size, group, j, src, dest;
	
		if (target != cnvgl.TEXTURE_1D
			&& target != cnvgl.TEXTURE_2D
			&& target != cnvgl.TEXTURE_3D
			&& target != cnvgl.TEXTURE_CUBE_MAP) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}

		unit = ctx.texture.currentUnit;
		texture_unit = ctx.texture.unit[unit];
		texture_obj = texture_unit.current_texture[target];

		texture_img = new cnvgl.texture_image();

		texture_img.width = width;
		texture_img.height = height;
		texture_img.internalFormat = internalFormat;
		texture_obj.images[level] = texture_img;

		ctx.driver.texImage2D(ctx, target, level, internalFormat, width, height, depth, border, format, type, data, ctx.Unpack, texture_obj, texture_img);	
	}

}(cnvgl));

