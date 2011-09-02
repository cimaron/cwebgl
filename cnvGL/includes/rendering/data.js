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

cnvgl_rendering_data = (function() {

	function Initializer() {
		this._renderer = null;
		this._out = null;
		this._varying = null;
		this.vertex = null;
		this.fragment = null;
	}

	var cnvgl_rendering_data = jClass('cnvgl_rendering_data', Initializer);	

	cnvgl_rendering_data.cnvgl_rendering_data = function(renderer) {
		this._renderer = renderer;
		this._texture_unit = renderer.ctx.texture.unit;
		this.texture2D = texture2D;
	};

	function texture2D(sampler, coord, bias) {
		var texture_unit, texture_obj, img, i, j, c;

		texture_unit = this._texture_unit[sampler];
		texture_obj = texture_unit.current_texture[GL_TEXTURE_2D];
		img = texture_obj.images[0];

		i = Math.round((coord[0] * (img.width - 1)) % img.width);
		j = Math.round((coord[1] * (img.height - 1)) % img.height);

		i = (j * img.width + i) * 4;

		c = [];
		c[0] = img.data[i] / 255;
		c[1] = img.data[i + 1] / 255;
		c[2] = img.data[i + 2] / 255;
		c[3] = img.data[i + 3] / 255;

		return c;
	}


	return cnvgl_rendering_data.Constructor;

}());

