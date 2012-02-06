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
		var ctx, unit, texture_unit, texture_obj, texture_img, size, a, n, s, k, size, group, j, src, dest;
	
		if (target != cnvgl.TEXTURE_1D
			&& target != cnvgl.TEXTURE_2D
			&& target != cnvgl.TEXTURE_3D
			&& target != cnvgl.TEXTURE_CUBE_MAP) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}
	
		ctx = cnvgl.getCurrentContext();
		unit = ctx.texture.currentUnit;
		texture_unit = ctx.texture.unit[unit];
		texture_obj = texture_unit.current_texture[target];
	
		texture_img = new cnvgl.texture_image(texture_obj);
	
		texture_img.width = width;
		texture_img.height = height;
		texture_img.internalFormat = internalFormat;
		
		texture_obj.images.push(texture_img);
	
		//get bytes per group
		switch (format) {
			case cnvgl.RGB:
				n = 3;
				s = 3;
				break;
			case cnvgl.RGBA:
				n = 4;
				s = 4;
				break;
			case cnvgl.COLOR_INDEX:
			case cnvgl.RED:
			case cnvgl.GREEN:
			case cnvgl.BLUE:
			case cnvgl.ALPHA:
			case cnvgl.INTENSITY:
			case cnvgl.BGR:
			case cnvgl.BGRA:
			case cnvgl.LUMINANCE:
			case cnvgl.LUMINANCE_ALPHA:
			case cnvgl.DEPTH_COMPONENT:
				throw new Error('glTextImage2D format not implemented');
			default:		
		}
	
		a = ctx.unpack.alignment;
		if (s < a) {
			k = a / s * Math.ceil(s * n * width / a);	
		} else {
			k = n * width;	
		}
		size = width * height * 4;
	
		texture_img.data = cnvgl.malloc(size, 1, Float32Array);

		group = [0, 0, 0, 1];
		dest = 0;
		for (i = 0; i < height; i++) {
			for (j = 0; j < width; j++) {
				src = (i * k) + (j * s);
				switch (format) {
					case cnvgl.RGB:
						group[0] = data[src    ] / 255;
						group[1] = data[src + 1] / 255;
						group[2] = data[src + 2] / 255;
						break;
					case cnvgl.RGBA:
						group[0] = data[src    ] / 255;
						group[1] = data[src + 1] / 255;
						group[2] = data[src + 2] / 255;
						group[3] = data[src + 3] / 255;
						break;
				}
				texture_img.data[dest++] = group[0];
				texture_img.data[dest++] = group[1];
				texture_img.data[dest++] = group[2];
				texture_img.data[dest++] = group[3];
			}
		}

		ctx.driver.texImage2D(ctx, target, unit, texture_img);
	};


}(cnvgl));

