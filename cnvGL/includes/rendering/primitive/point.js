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

cnvgl_rendering_primitive_point = (function() {

	//Internal Constructor
	function Initializer() {

		//public:
		this.ctx = null;
		this.renderer = null;

		this.prim = null;
	}

	var cnvgl_rendering_primitive_point = jClass('cnvgl_rendering_primitive_point', Initializer);

	//public:

	cnvgl_rendering_primitive_point.cnvgl_rendering_primitive_point = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
	};

	cnvgl_rendering_primitive_point.render = function(prim) {
		var c_buffer, vw, v, x, y, p, frag, i;

		this.prim = prim;
		c_buffer = this.ctx.color_buffer;
		vw = this.ctx.viewport.w;
		frag = new cnvgl_fragment();
		
		v = prim.vertices[0];
		x = Math.round(v.xw);
		y = Math.round(v.yw);
		p = [x, y, 0, v.w];

		for (i in v.varying) {
			frag.varying[i] = v.varying[i];	
		}

		this.renderer.fragment.process(frag);

		ic = (vw * y + x) * 4;
		c_buffer[ic] = frag.r;
		c_buffer[ic + 1] = frag.g;
		c_buffer[ic + 2] = frag.b;
	};

	return cnvgl_rendering_primitive_point.Constructor;
}());

