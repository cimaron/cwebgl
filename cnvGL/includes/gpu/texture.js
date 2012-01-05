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

(function(GPU) {
	var teture, i, j, texUnit;

	texture = {
		MAX_TEXTURE_COORDS : 4,
		MAX_COMBINED_TEXTURE_IMAGE_UNITS : 2
	};

	texUnit = [];
	for (i = 0; i < texture.MAX_COMBINED_TEXTURE_IMAGE_UNITS; i++) {
		texUnit[i] = [];
		for (j = 0; j < 1; j++) {
			texUnit[i][j] = [];	
		}
	}

	function tex(c, sampler, s, t, target) {
		var texture, mipmap_level, img, img_w, img_h, img_d, i, u, v, u1, v1, i1;
		target = 0;
		mipmap_level = 0;

		texture = texUnit[sampler].current_texture[GL_TEXTURE_2D];
		img = texture.images[mipmap_level];

		if (!img) {
			c[0] = 0;
			c[1] = 0;
			c[2] = 0;
			c[3] = 1;
			return;
		}

		img_w = img.width;
		img_h = img.height;
		img_d = img.data;

		switch (texture.min_filter) {
			case GL_LINEAR:
				u = (s * img_w - .5)|0; //floor(s * img.width - .5)
				v = (t * img_h - .5)|0; //floor(t * img.height - .5)
				u1 = u + 1;
				v1 = v + 1;
				var a, b;
				a = (s - .5)%1; //fpart(s - .5)
				b = (t - .5)%1; //fpart(t - .5)
				
				var u0v0, u1v0, u0v1, v1v1;
				u0v0 = (1 - a) * (1 - b);
				u1v0 =      a  * (1 - b);
				u0v1 = (1 - a) *      b ;
				u1v1 =      a  *      b ;

				i = (v * img_w + u) * 4;
				i1 = i + (img_w * 4);

				c[0] = u0v0 * img_d[i    ] + u1v0 * img_d[i + 4] + u0v1 * img_d[i1    ] + u1v1 * img_d[i1 + 4];
				c[1] = u0v0 * img_d[i + 1] + u1v0 * img_d[i + 5] + u0v1 * img_d[i1 + 1] + u1v1 * img_d[i1 + 5];
				c[2] = u0v0 * img_d[i + 2] + u1v0 * img_d[i + 6] + u0v1 * img_d[i1 + 2] + u1v1 * img_d[i1 + 6];
				c[3] = u0v0 * img_d[i + 3] + u1v0 * img_d[i + 7] + u0v1 * img_d[i1 + 3] + u1v1 * img_d[i1 + 7];
				break;

			case GL_NEAREST:
			default:
				u = (s * img_w)|0; //floor(s * img.width)
				v = (t * img_h)|0; //floor(t * img.height)
				if (u == img_w) {
					u--;
				}
				if (v == img_h) {
					v--;
				}
				i = (v * img_w + u) * 4;
				c[0] = img_d[i];
				c[1] = img_d[i + 1];
				c[2] = img_d[i + 2];
				c[3] = img_d[i + 3];
		}

	}

	GPU.texture = texture;
	GPU.shader.setTexFunc(tex);

	GPU.setTextureUnit = function(unit) {
		texUnit = unit;
	};

}(GPU));

