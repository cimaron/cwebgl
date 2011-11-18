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
		this.frag = new cnvgl_fragment();
	};

	cnvgl_rendering_primitive_point.render = function(prim) {
		var num;
		
		num = this.renderer.clipping.clipLine(prim);		

		if (num) {
			this.renderClipped(prim);
		}

	};

	cnvgl_rendering_primitive_point.renderClipped = function(prim) {
		var c_buffer, d_buffer, vw, v, x, y, frag, i;

		this.prim = prim;

		v = prim.vertices[0];
		x = Math.round(v.xw);
		y = Math.round(v.yw);

		vw = this.ctx.viewport.w;

		for (i in v.varying) {
			this.frag.varying[i] = v.varying[i];	
		}

		i = (vw * y + x);

		this.renderer.fragment.process(this.frag);
		this.renderer.fragment.write(i, this.frag);
	};

	return cnvgl_rendering_primitive_point.Constructor;
}());

