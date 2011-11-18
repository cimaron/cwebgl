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

cnvgl_rendering_primitive_triangle = (function() {

	//Internal Constructor
	function Initializer() {
		//public:
		this.ctx = null;
		this.renderer = null;
		
		this.prim = null;
		this.frag = null;
		this.v1 = null;
		this.v2 = null;
		this.v3 = null;
	}

	var cnvgl_rendering_primitive_triangle = jClass('cnvgl_rendering_primitive_triangle', Initializer);

	//public:

	cnvgl_rendering_primitive_triangle.cnvgl_rendering_primitive_triangle = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
		this.frag = new cnvgl_fragment();
	};

	cnvgl_rendering_primitive_triangle.render = function(prim) {
		var clipped, num, i;

		if (this.renderer.culling.checkCull(prim)) {
			return;
		}

		//clipping may split triangle into 0-5 new triangles
		clipped = [];
		num = this.renderer.clipping.clipTriangle(prim, clipped);

		for (i = 0; i < num; i++) {
			this.renderClipped(clipped[i]);
		}
	};

	cnvgl_rendering_primitive_triangle.renderClipped = function(prim) {
		var dir, t;

		this.prim = prim;

		//prepare (sort) vertices
		this.renderer.vertex.sortVertices(prim);
		dir = prim.getDirection();

		if (dir >= 0) {
			t = prim.vertices[2];
			prim.vertices[2] = prim.vertices[1];
			prim.vertices[1] = t;
		}
		
		this.rasterize(prim);		
	};

	cnvgl_rendering_primitive_triangle.rasterize = function(prim) {
		var v1, v2, v3, dx1, dx2, dx3, yi_start, yi_end, yi, x_start, x_end, vpass;

		v1 = this.v1 = prim.vertices[0];
		v2 = this.v2 = prim.vertices[1];
		v3 = this.v3 = prim.vertices[2];

		this.renderer.interpolate.setVertices(this.v1, this.v2, this.v3);

		dx1 = this.renderer.vertex.slope(v1.xw, v1.yw, v2.xw, v2.yw);
		dx2 = this.renderer.vertex.slope(v1.xw, v1.yw, v3.xw, v3.yw);
		dx3 = this.renderer.vertex.slope(v2.xw, v2.yw, v3.xw, v3.yw);

		//top and bottom bounds
		yi_start = (v1.yw|0) + .5; //floor(v1.yw) + .5
		if (yi_start < v1.yw) {
			yi_start++;
		}
		if (v3.yw > v2.yw) {
			yi = v3.yw;
		} else {
			yi = v2.yw;
		}
		yi_end = Math.ceil(yi) - .5;
		if (yi_end >= yi) {
			yi_end--;
		}

		x_start = v1.xw + (yi_start - v1.yw) * dx1;
		x_end = v1.xw + (yi_start - v1.yw) * dx2;
		vpass = false;

		//for each horizontal scanline
		for (yi = yi_start; yi < yi_end; yi++) {

			//next vertex (v1, v2) -> (v2, v3)
			if (!vpass && yi > v2.yw) {
				x_start = v3.xw + (yi - v3.yw) * dx3;
				dx1 = dx3;
				vpass = true;
			}

			//next vertex (v1, v3) -> (v2, v3)
			if (!vpass && yi > v3.yw) {
				x_end = v3.xw + (yi - v3.yw) * dx3;
				dx2 = dx3;
				vpass = true;
			}

			this.rasterizeScanline(yi, x_start, x_end);

			x_start += dx1;
			x_end += dx2;
		}
	};

	cnvgl_rendering_primitive_triangle.rasterizeScanline = function(yi, x_start, x_end) {
		var c_buffer, d_buffer, vw, int, p, xi_start, xi_end, xi, i;

		vw = this.ctx.viewport.w;
		int = this.renderer.interpolate;
		p = [0, yi, 0, 1];

		//left and right bounds
		xi_start = (x_start|0) + .5; //floor(x_start) + .5
		if (xi_start < x_start) {
			xi_start++;	
		}
		xi_end = /*ceil*/((x_end + 1-1e-10)|0) - .5;
		if (xi_end >= x_end) {
			xi_end--;	
		}

		i = vw * (yi - .5) + (xi_start - .5);

		for (xi = xi_start; xi <= xi_end; xi++) {

			p[0] = xi;
			int.setPoint(p);

			//Early depth test
			//Need to add check for shader writing to depth value.
			//If so, this needs to run after processing the fragment
			if (this.ctx.depth.test == GL_TRUE) {
				this.frag.gl_FragDepth = int.interpolateTriangle(this.v1.zw, this.v2.zw, this.v3.zw);
				if (!this.renderer.checkDepth(i, this.frag.gl_FragDepth)) {
					i++;
					continue;
				}
			}

			//interpolate varying
			for (v in this.v1.varying) {
				this.frag.varying[v] = int.interpolateTriangle(this.v1.varying[v], this.v2.varying[v], this.v3.varying[v]);
			}

			this.renderer.fragment.process(this.frag);
			this.renderer.fragment.write(i, this.frag);

			i++;
		}		
	};

	return cnvgl_rendering_primitive_triangle.Constructor;
}());

