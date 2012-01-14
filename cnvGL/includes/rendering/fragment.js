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
		
		//current state
		this.colorBuffer = null;
		this.depthBuffer = null;
		this.colorMask = null;
	}

	var cnvgl_rendering_fragment = jClass('cnvgl_rendering_fragment', Initializer);

	//public:

	cnvgl_rendering_fragment.cnvgl_rendering_fragment = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
		this.result = GPU.shader.result;
	};

	cnvgl_rendering_fragment.setCurrentState = function() {
		this.colorBuffer = this.ctx.drawBuffer.colorDrawBuffers[0].data;
		this.depthBuffer = this.ctx.drawBuffer.depthBuffer.data;
		this.colorMask = this.ctx.color.colorMask;
		this.depthMask = this.ctx.depth.mask;
	};

	cnvgl_rendering_fragment.process = function(f) {
		var color, shader_mem;
		shader_mem = GPU.memory.shader;

		GPU.executeFragment(
			shader_mem.temp.data,
			shader_mem.uniforms.data,
			null, 
			f.attributes.data,
			this.result);

		f.color = this.result.color.primary;
	};

	cnvgl_rendering_fragment.write = function(i, frag) {
		var c_buffer, d_buffer, c, c_mask;

		c_buffer = this.colorBuffer;
		d_buffer = this.depthBuffer;

		c = frag.color;
		c_mask = this.colorMask;

		if (this.depthMask) {
			d_buffer[i] = frag.gl_FragDepth;
		}

		i <<= 2;
		
		c[0] *= 255;
		c[1] *= 255;
		c[2] *= 255;
		c[3] *= 255;

		if (this.ctx.color.blendEnabled == GL_TRUE) {
			this.blend(c, c[0], c[1], c[2], c[3], c_buffer[i], c_buffer[i + 1], c_buffer[i + 2], c_buffer[i + 3]);
		}

		c_buffer[i    ] = c_mask[0] & (c[0] + .5)|0; //round(frag.r)
		c_buffer[i + 1] = c_mask[1] & (c[1] + .5)|0; //round(frag.g)
		c_buffer[i + 2] = c_mask[2] & (c[2] + .5)|0; //round(frag.b)
		c_buffer[i + 3] = c_mask[3] & (c[3] + .5)|0; //round(frag.a)		
	};
	
	cnvgl_rendering_fragment.blend = function(color, sr, sg, sb, sa, dr, dg, db, da) {
		var state, a_sr, a_sg, a_sb, a_sa, a_dr, a_dg, a_db, a_da;
		
		state = this.ctx.color;

		switch (state.blendSrcA) {
			case GL_ONE:
				a_sr = a_sg = a_sb = a_sa = (1);
				break;
			case GL_ZERO:
				a_sr = a_sg = a_sb = a_sa = (0);
				break;
			case GL_SRC_ALPHA:
				a_sr = a_sg = a_sb = a_sa = (sa / 255);
				break;
			case GL_ONE_MINUS_SRC_ALPHA:
				a_sr = a_sg = a_sb = a_sa = (1 - (sa / 255));
				break;
			case GL_DST_ALPHA:
				a_sr = a_sg = a_sb = a_sa = (da / 255);
				break;
			case GL_ONE_MINUS_DST_ALPHA:
				a_sr = a_sg = a_sb = a_sa = (1 - (da / 255));
				break;
			default:
				throw new Error('Blend source ' + state.blendSrcA + ' not implemented');
		}

		switch (state.blendDestA) {
			case GL_ONE:
				a_dr = a_dg = a_db = a_da = (1);
				break;
			case GL_ZERO:
				a_dr = a_dg = a_db = a_da = (0);
				break;
			case GL_SRC_ALPHA:
				a_dr = a_dg = a_db = a_da = (sa / 255);
				break;
			case GL_ONE_MINUS_SRC_ALPHA:
				a_dr = a_dg = a_db = a_da = (1 - (sa / 255));
				break;
			case GL_DST_ALPHA:
				a_dr = a_dg = a_db = a_da = (da / 255);
				break;
			case GL_ONE_MINUS_DST_ALPHA:
				a_dr = a_dg = a_db = a_da = (1 - (da / 255));
				break;
			default:
				throw new Error('Blend source ' + state.blendSrcD + ' not implemented');					
		}

		switch (state.blendEquationRGB) {
			case GL_FUNC_ADD:
				color[0] = (a_sr * sr) + (a_dr * dr);
				color[1] = (a_sg * sg) + (a_dg * dg);
				color[2] = (a_sb * sb) + (a_db * db);
				break;
			default:
				throw new Error('Blend function ' + state.blendEquationRGB + ' not implemented');									
		}

		switch (state.blendEquationA) {
			case GL_FUNC_ADD:
				color[3] = (a_sa * sa) + (a_da * da);
				break;
			default:
				throw new Error('Blend function ' + state.blendEquationRGB + ' not implemented');									
		}
		
		if (color[0] > 255) { color[0] = 255; }
		if (color[1] > 255) { color[1] = 255; }
		if (color[2] > 255) { color[2] = 255; }
		if (color[3] > 255) { color[3] = 255; }
		
	};

	return cnvgl_rendering_fragment.Constructor;

}());

