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

cnvgl_rendering_primitive_line = (function() {

	//Internal Constructor
	function Initializer() {

		//public:
		this.ctx = null;
		this.renderer = null;
		
		this.prim = null;
	}

	var cnvgl_rendering_primitive_line = jClass('cnvgl_rendering_primitive_line', Initializer);

	//public:

	cnvgl_rendering_primitive_line.cnvgl_rendering_primitive_line = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
	};

	cnvgl_rendering_primitive_line.line = function(prim) {
		var v1, v2, dx, dy, dir;
		this.prim = prim;
		v1 = prim.vertices[0];
		v2 = prim.vertices[1];
		dir = Math.abs(dx) > Math.abs(dy) ? 1 : -1; //x-major = 1 : y-major = -1

		if (dir > 0) {
			dy = this.renderer.vertex.slope(v1.yw, v1.xw, v2.yw, v2.xw);
			this.lineX(v1, v2, dy);
		} else {
			dx = this.renderer.vertex.slope(v1.xw, v1.yw, v2.xw, v2.yw);
			this.lineY(v1, v2, dx);
		}
	};

	cnvgl_rendering_primitive_line.lineX = function(v1, v2, dy) {
		var c_buffer, vw, frag, x_start, x_end, xi_start, xi_end, y, v, xi, yi, ic;

		c_buffer = this.ctx.color_buffer;
		vw = this.ctx.viewport.w;
		frag = new cnvgl_fragment();

		//make v1 left vertex
		if (v2.xw < v1.xw) {
			v = v2; v2 = v1; v1 = v;
		}

		x_start = v1.xw;
		x_end = v2.xw;
		xi_start = Math.ceil(x_start);
		xi_end = Math.floor(x_end);
		y = v1.yw + (xi_start - v1.xw) * dy;

		for (v in v1.varying) {
			frag.varying[v] = v1.varying[v];
		}
		
		for (xi = xi_start; xi <= xi_end; xi++) {

			yi = Math.floor(y);

			this.fragment.process(frag);

			ic = (vw * yi + xi) * 4;
			c_buffer[ic] = frag.r;
			c_buffer[ic + 1] = frag.g;
			c_buffer[ic + 2] = frag.b;

			y += dy;
		}
	};

	cnvgl_rendering_primitive_line.lineY = function(v1, v2, dx) {
		var c_buffer, vw, frag, y_start, y_end, yi_start, yi_end, x, v, yi, xi, ic;

		c_buffer = this.ctx.color_buffer;
		vw = this.ctx.viewport.w;
		frag = new cnvgl_fragment();

		//make v1 top vertex
		if (v2.yw < v1.yw) {
			v = v2; v2 = v1; v1 = v;
			//dy = -dy;
		}

		y_start = v1.yw;
		y_end = v2.yw;
		yi_start = Math.ceil(y_start);
		yi_end = Math.floor(y_end);
		x = v1.xw + (yi_start - v1.yw) * dx;

		for (v in v1.varying) {
			frag.varying[v] = v1.varying[v];
		}
		
		for (yi = yi_start; yi <= yi_end; yi++) {

			xi = Math.floor(x);

			this.fragment.process(frag);

			ic = (vw * yi + xi) * 4;
			c_buffer[ic] = frag.r;
			c_buffer[ic + 1] = frag.g;
			c_buffer[ic + 2] = frag.b;

			x += dx;
		}
	};
	
	return cnvgl_rendering_primitive_line.Constructor;
}());

