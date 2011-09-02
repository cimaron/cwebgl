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

cnvgl_renderer_line = function() {

	//Internal Constructor
	function Initializer() {
	}

	var cnvgl_renderer_line = jClass('cnvgl_renderer_line', Initializer);

	//static:

	cnvgl_renderer_line.Constructor.lines = function(vertices) {
		var i;
		for (i = 0; i < vertices.length; i+=2) {
			this.Line.line.call(this, vertices[i], vertices[i + 1]);
		}
	};

	cnvgl_renderer_line.Constructor.lineStrip = function(vertices) {
		var i;
		for (i = 0; i < vertices.length - 1; i++) {
			this.Line.line.call(this, vertices[i], vertices[i + 1]);
		}
	};

	cnvgl_renderer_line.Constructor.lineLoop = function(vertices) {
		var i;
		for (i = 0; i < vertices.length - 1; i++) {
			this.Line.line.call(this, vertices[i], vertices[i + 1]);
		}
		this.Line.line.call(this, vertices[i], vertices[0]);
	};

	cnvgl_renderer_line.Constructor.line = function(v1, v2) {
		var dx, dy, dir;
		dx = this.vertex.slope(v1.xw, v1.yw, v2.xw, v2.yw);
		dy = this.vertex.slope(v1.yw, v1.xw, v2.yw, v2.xw);
		dir = Math.abs(dx) > Math.abs(dy) ? 1 : -1; //x-major = 1 : y-major = -1

		if (dir > 0) {
			this.Line.lineX.call(this, v1, v2, dy);
		} else {
			this.Line.lineY.call(this, v1, v2, dx);
		}
	};

	cnvgl_renderer_line.Constructor.lineX = function(v1, v2, dy) {
		var color_buffer, view_width, frag;
		var x_start, x_end, y;
		var xi_start, xi_end, xi, yi;
		var ib, v;

		//make v1 left vertex
		if (v2.xw < v1.xw) {
			v = v2; v2 = v1; v1 = v;
			//dy = -dy;
		}

		x_start = v1.xw;
		x_end = v2.xw;
		xi_start = Math.ceil(x_start);
		xi_end = Math.floor(x_end);

		y = v1.yw + (xi_start - v1.xw) * dy;

		color_buffer = this.ctx.color_buffer;
		view_width = this.ctx.viewport.w;
		frag = new cnvgl_fragment();
		for (v in v1.varying) {
			frag.varying[v] = v1.varying[v];
		}
		
		for (xi = xi_start; xi <= xi_end; xi++) {

			yi = Math.floor(y);

			this.fragment.process(frag);

			ib = (view_width * yi + xi) * 4;
			color_buffer[ib] = frag.r;
			color_buffer[ib + 1] = frag.g;
			color_buffer[ib + 2] = frag.b;

			y += dy;
		}
	};

	cnvgl_renderer_line.Constructor.lineY = function(v1, v2, dx) {
		var color_buffer, view_width, frag;
		var y_start, y_end, x;
		var yi_start, yi_end, yi, xi;
		var ib, v;

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

		color_buffer = this.ctx.color_buffer;
		view_width = this.ctx.viewport.w;
		frag = new cnvgl_fragment();
		for (v in v1.varying) {
			frag.varying[v] = v1.varying[v];
		}
		
		for (yi = yi_start; yi <= yi_end; yi++) {

			xi = Math.floor(x);

			this.fragment.process(frag);

			ib = (view_width * yi + xi) * 4;
			color_buffer[ib] = frag.r;
			color_buffer[ib + 1] = frag.g;
			color_buffer[ib + 2] = frag.b;

			x += dx;
		}
	};
	
	//public:
	cnvgl_renderer_line.cnvgl_renderer_line = function() {
	};

	return cnvgl_renderer_line.Constructor;
};

