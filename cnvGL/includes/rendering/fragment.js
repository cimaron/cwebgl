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

	cnvgl_rendering_fragment.write = function(buffer, i, frag) {
		var r, g, b, a, c, mask;
		
		r = frag.r;
		g = frag.g;
		b = frag.b;
		a = frag.a;
		mask = this.ctx.color.colorMask;

		if (this.ctx.color.blendEnabled == GL_TRUE) {
			c = this.blend(r, g, b, a, buffer[i] / 255, buffer[i + 1] / 255, buffer[i + 2] / 255, buffer[i + 3] / 255);
			r = c[0];
			g = c[1];
			b = c[2];
			a = c[3];
		}

		buffer[i    ] = mask[0] & (r * 255 + .5)|0; //round(frag.r * 255)
		buffer[i + 1] = mask[1] & (g * 255 + .5)|0; //round(frag.g * 255)
		buffer[i + 2] = mask[2] & (b * 255 + .5)|0; //round(frag.b * 255)
		buffer[i + 3] = mask[3] & (a * 255 + .5)|0; //round(frag.a * 255)

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

