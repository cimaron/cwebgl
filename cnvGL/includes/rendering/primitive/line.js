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
		this.frag = null;
	}

	var cnvgl_rendering_primitive_line = jClass('cnvgl_rendering_primitive_line', Initializer);

	//public:

	cnvgl_rendering_primitive_line.cnvgl_rendering_primitive_line = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
		this.frag = new cnvgl_fragment();
	};

	cnvgl_rendering_primitive_line.render = function(prim) {
		var v1, v2, dx, dy, dir;
		this.prim = prim;
		v1 = prim.vertices[0];
		v2 = prim.vertices[1];
		
		dx = this.renderer.vertex.slope(v1.xw, v1.yw, v2.xw, v2.yw);
		dy = this.renderer.vertex.slope(v1.yw, v1.xw, v2.yw, v2.xw);		
		dir = Math.abs(dx) > Math.abs(dy) ? 1 : -1; //x-major = 1 : y-major = -1

		if (dir > 0) {
			this.lineX(v1, v2, dy);
		} else {
			this.lineY(v1, v2, dx);
		}
	};

	cnvgl_rendering_primitive_line.lineX = function(v1, v2, dy) {
		var c_buffer, vw, frag, x_start, x_end, xi_start, xi_end, y, v, xi, yi, p, ic;

		c_buffer = this.ctx.color_buffer;
		vw = this.ctx.viewport.w;

		//make v1 left vertex
		if (v2.xw < v1.xw) {
			v = v2; v2 = v1; v1 = v;
		}

		this.renderer.interpolate.setVertices(v2, v1);

		x_start = v1.xw;
		x_end = v2.xw;
		xi_start = Math.ceil(x_start);
		xi_end = Math.floor(x_end);
		y = v1.yw + (xi_start - v1.xw) * dy;

		for (xi = xi_start; xi <= xi_end; xi++) {

			yi = (y|0); //floor(y)
			p = [xi, yi, 0, 1];
			this.renderer.interpolate.setPoint(p);
			for (v in v1.varying) {
				this.frag.varying[v] = this.renderer.interpolate.interpolateLine(v1.varying[v], v2.varying[v]);
			}

			this.renderer.fragment.process(this.frag);

			ic = (vw * yi + xi) * 4;
			c_buffer[ic] = this.frag.r;
			c_buffer[ic + 1] = this.frag.g;
			c_buffer[ic + 2] = this.frag.b;

			y += dy;
		}
	};

	cnvgl_rendering_primitive_line.lineY = function(v1, v2, dx) {
		var c_buffer, vw, frag, y_start, y_end, yi_start, yi_end, x, v, yi, xi, p, ic;

		c_buffer = this.ctx.color_buffer;
		vw = this.ctx.viewport.w;

		//make v1 top vertex
		if (v2.yw < v1.yw) {
			v = v2; v2 = v1; v1 = v;
			//dy = -dy;
		}

		this.renderer.interpolate.setVertices(v2, v1);

		y_start = v1.yw;
		y_end = v2.yw;
		yi_start = Math.ceil(y_start);
		yi_end = (y_end)|0; //floor(y_end)
		x = v1.xw + (yi_start - v1.yw) * dx;

		for (yi = yi_start; yi <= yi_end; yi++) {

			xi = (x|0); //floor(x)
			p = [xi, yi, 0, 1];
			this.renderer.interpolate.setPoint(p);

			for (v in v1.varying) {
				this.frag.varying[v] = this.renderer.interpolate.interpolateLine(v1.varying[v], v2.varying[v]);
			}

			this.renderer.fragment.process(this.frag);

			ic = (vw * yi + xi) * 4;
			c_buffer[ic] = this.frag.r;
			c_buffer[ic + 1] = this.frag.g;
			c_buffer[ic + 2] = this. frag.b;

			x += dx;
		}
	};
	
	return cnvgl_rendering_primitive_line.Constructor;
}());

