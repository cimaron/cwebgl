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
	 * glBindTexture — bind a named texture to a texturing target
	 *
	 * @var GLenum  target   Specifies the target to which the texture is bound.
	 * @var GLuint  texture  Specifies the name of a texture.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glBindTexture.xml
	 */
	cnvgl.bindTexture = function(target, texture) {
		var ctx, unit, texture_unit, texture_obj;
	
		if (target != cnvgl.TEXTURE_1D &&
			target != cnvgl.TEXTURE_2D &&
			target != cnvgl.TEXTURE_3D &&
			target != cnvgl.TEXTURE_CUBE_MAP
			) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}
	
		ctx = cnvgl.getCurrentContext();
		unit = ctx.texture.currentUnit;
		texture_unit = ctx.texture.unit[unit];
	
		if (texture == 0) {
			texture_obj = ctx.shared.default_texture_objects[cnvgl.TEXTURE_2D];
		} else {
			texture_obj = ctx.shared.texture_objects[texture];
			if (texture_obj) {
				if (texture_obj.target != 0 && texture_obj.target != target) {
					cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);	
					return;
				}
				texture_obj.target = target;
			} else {
				texture_obj = new cnvgl.texture_object(texture, target);
				ctx.shared.texture_objects[texture] = texture_obj;
			}
		}
	
		texture_unit.current_texture[target] = texture_obj;

		ctx.driver.bindTexture(ctx, unit, target, texture_obj);
	};
	
	
	/**
	 * glGenTextures — generate texture names
	 *
	 * @var GLsizei   n         Specifies the number of texture names to be generated.
	 * @var [GLuint]  textures  Specifies an array in which the generated texture names are stored.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGenTextures.xml
	 */
	cnvgl.genTextures = function(n, textures) {
	
		var current, list, i, t, texture_obj;
	
		if (n < 0) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		current = cnvgl.getCurrentContext().shared.texture_objects;
	
		list = [];
		for (i = 0; i < n; i++) {
			t = current.indexOf(null);
			if (t == -1) {
				t = current.length;
			}
			texture_obj = new cnvgl.texture_object(t, 0);
			current[t] = texture_obj;
			list[i] = t;
		}
	
		textures[0] = list;
	};
	
	
}(cnvgl));

