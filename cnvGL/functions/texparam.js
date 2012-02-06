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

	
	function cnvgl_texParameter(target, pname, param) {
		var ctx, unit, texture_unit, texture_obj;
		
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
	
		switch (pname) {

			case cnvgl.TEXTURE_MIN_FILTER:
				texture_obj.min_filter = param;
				break;

			case cnvgl.TEXTURE_MAG_FILTER:
				texture_obj.min_filter = param;
				break;
		}		
	}


	/**
	 * glTexParameteri — set texture parameters
	 *
	 * @var GLenum   target  Specifies the target texture, which must be either GL_TEXTURE_1D, GL_TEXTURE_2D, GL_TEXTURE_3D, GL_TEXTURE_1D_ARRAY, GL_TEXTURE_2D_ARRAY, GL_TEXTURE_RECTANGLE, or GL_TEXTURE_CUBE_MAP.
	 * @var GLenum   pname   Specifies the symbolic name of a single-valued texture parameter.
	 * @var GLfloat  param   Specifies the value of pname.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glTexParameter.xml
	 */
	cnvgl.texParameterf = function(target, pname, param) {
		cnvgl_texParameter(target, pname, param);
	};


	/**
	 * glTexParameteri — set texture parameters
	 *
	 * @var GLenum  target  Specifies the target texture, which must be either GL_TEXTURE_1D, GL_TEXTURE_2D, GL_TEXTURE_3D, GL_TEXTURE_1D_ARRAY, GL_TEXTURE_2D_ARRAY, GL_TEXTURE_RECTANGLE, or GL_TEXTURE_CUBE_MAP.
	 * @var GLenum  pname   Specifies the symbolic name of a single-valued texture parameter.
	 * @var GLint   param   Specifies the value of pname.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glTexParameter.xml
	 */
	cnvgl.texParameteri = function(target, pname, param) {
		cnvgl_texParameter(target, pname, param);
	};
	

}(cnvgl));

