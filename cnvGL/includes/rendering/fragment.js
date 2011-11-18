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

cnvgl_rendering_fragment = (function() {

	//Internal Constructor
	function Initializer() {
		//public:
		this.ctx = null;
		this.renderer = null;

		this.program = null;
		this.data = null;
	}

	var cnvgl_rendering_fragment = jClass('cnvgl_rendering_fragment', Initializer);

	//public:

	cnvgl_rendering_fragment.cnvgl_rendering_fragment = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
		
		//build environment for fragment executable
		this.data = new cnvgl_rendering_program(ctx, renderer);
		this.setProgram(null);
	};

	cnvgl_rendering_fragment.setProgram = function(program) {
		if (program) {
			this.program = this.data.setProgram(program.fragment_program);
			this.data._uniforms = program.active_uniforms_values;
		} else {
			this.program = this.defaultProgram;	
		}
	};

	cnvgl_rendering_fragment.defaultProgram = function() {
	};

	cnvgl_rendering_fragment.process = function(fragment) {

		this.data.fragment = fragment;
		this.program.apply(this.data);

		fragment.r = fragment.gl_FragColor[0];
		fragment.g = fragment.gl_FragColor[1];
		fragment.b = fragment.gl_FragColor[2];
		fragment.a = fragment.gl_FragColor[3];
	};

	cnvgl_rendering_fragment.write = function(i, frag) {
		var c_buffer, d_buffer, c, c_mask;

		c_buffer = this.ctx.color_buffer;
		d_buffer = this.ctx.depth_buffer;

		c = [frag.r, frag.g, frag.b, frag.a];
		c_mask = this.ctx.color.colorMask;

		if (this.ctx.depth.mask) {
			d_buffer[i] = frag.gl_FragDepth;
		}

		i <<= 2;
		if (this.ctx.color.blendEnabled == GL_TRUE) {
			c = this.blend(c[0], c[1], c[2], c[3], c_buffer[i] / 255, c_buffer[i + 1] / 255, c_buffer[i + 2] / 255, c_buffer[i + 3] / 255);
		}

		c_buffer[i    ] = c_mask[0] & (c[0] * 255 + .5)|0; //round(frag.r * 255)
		c_buffer[i + 1] = c_mask[1] & (c[1] * 255 + .5)|0; //round(frag.g * 255)
		c_buffer[i + 2] = c_mask[2] & (c[2] * 255 + .5)|0; //round(frag.b * 255)
		c_buffer[i + 3] = c_mask[3] & (c[3] * 255 + .5)|0; //round(frag.a * 255)
	};
	
	cnvgl_rendering_fragment.blend = function(rs, gs, bs, as, rd, gd, bd, ad) {
		var state, sr, sg, sb, sa, dr, dg, db, da, f, c;
		
		state = this.ctx.color;

		switch (state.blendSrcA) {
			case GL_ONE:
				sr = sg = sb = sa = 1;
				break;
			case GL_ZERO:
				sr = sg = sb = sa = 0;
				break;
			case GL_SRC_ALPHA:
				sr = sg = sb = sa = as;
				break;
			case GL_ONE_MINUS_SRC_ALPHA:
				sr = sg = sb = sa = 1 - as;
				break;
			case GL_DST_ALPHA:
				sr = sg = sb = sa = ad;
				break;
			case GL_ONE_MINUS_DST_ALPHA:
				sr = sg = sb = sa = 1 - ad;
				break;
			default:
				throw new Error('Blend source ' + state.blendSrcA + ' not implemented');
		}

		switch (state.blendDestA) {
			case GL_ONE:
				dr = dg = db = da = 1;
				break;
			case GL_ZERO:
				dr = dg = db = da = 0;
				break;
			case GL_SRC_ALPHA:
				dr = dg = db = da = as;
				break;
			case GL_ONE_MINUS_SRC_ALPHA:
				dr = dg = db = da = 1 - as;
				break;
			case GL_DST_ALPHA:
				dr = dg = db = da = ad;
				break;
			case GL_ONE_MINUS_DST_ALPHA:
				dr = dg = db = da = 1 - ad;
				break;
			default:
				throw new Error('Blend source ' + state.blendSrcD + ' not implemented');					
		}

		f = sr + dr;
		rd = (sr * rs) + (dr * rd) / f;
		gd = (sg * gs) + (dg * gd) / f;
		bd = (sb * bs) + (db * bd) / f;
		ad = (sa * as) + (da * ad) / f;
		
		c = [rd, gd, bd, ad];

		return c;
	};

	return cnvgl_rendering_fragment.Constructor;

}());

