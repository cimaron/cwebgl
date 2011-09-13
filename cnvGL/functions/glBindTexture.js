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


function glBindTexture(target, texture) {
	var ctx, unit, texture_unit, texture_obj;

	if (target != GL_TEXTURE_1D &&
		target != GL_TEXTURE_2D &&
		target != GL_TEXTURE_3D &&
		target != GL_TEXTURE_CUBE_MAP
		) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	ctx = cnvgl_context.getCurrentContext();
	unit = ctx.texture.currentUnit;
	texture_unit = ctx.texture.unit[unit - GL_TEXTURE0];

	if (texture == 0) {
		texture_obj = ctx.shared.default_texture_objects[GL_TEXTURE_2D];
	} else {
		texture_obj = ctx.shared.texture_objects[texture];
		if (texture_obj) {
			if (texture_obj.target != 0 && texture_obj.target != target) {
				cnvgl_throw_error(GL_INVALID_OPERATION);	
				return;
			}
		} else {
			texture_obj = new cnvgl_texture_object(texture);
			ctx.shared.texture_objects[texture] = texture_obj;
		}
	}

	texture_unit.current_texture[target] = texture_obj;
}

