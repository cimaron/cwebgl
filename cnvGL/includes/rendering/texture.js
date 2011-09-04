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

cnvgl_rendering_texture = (function() {

	//Internal Constructor
	function Initializer() {

		//public:
		this.ctx = null;
		this.renderer = null;
	}

	var cnvgl_rendering_texture = jClass('cnvgl_rendering_texture', Initializer);

	//public:
	cnvgl_rendering_texture.cnvgl_rendering_texture = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
	};

	//Note: all the following functions will be executed in the 'this' context of cnvgl_rendering_data

	cnvgl_rendering_texture.texture2D = function(sampler, coord, bias) {
		var texture_obj, mipmap_level, img, u, v, s, t, c, i;

		texture_obj = this._ctx.texture.unit[sampler].current_texture[GL_TEXTURE_2D];

		//todo: mipmap 
		mipmap_level = 0;
		img = texture_obj.images[mipmap_level];

		s = coord[0];
		t = coord[1];
		c = [];

		//how to determine if using mag or min?

		switch (texture_obj.min_filter) {
			case GL_NEAREST:
			default:
				u = Math.floor(s * img.width);
				v = Math.floor(t * img.height);
				if (u == img.width) {
					u--;
				}
				if (v == img.height) {
					v--;	
				}
				i = (v * img.width + u) * 4;
				c[0] = img.data[i];
				c[1] = img.data[i + 1];
				c[2] = img.data[i + 2];
				c[3] = img.data[i + 3];
		}

		c[0] /= 255;
		c[1] /= 255;
		c[2] /= 255;
		c[3] /= 255;

		return c;
	};

	return cnvgl_rendering_texture.Constructor;

}());

