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

cnvgl_renderer_triangle = function() {

	//Internal Constructor
	function Initializer() {
	}

	var cnvgl_renderer_triangle = jClass('cnvgl_renderer_triangle', Initializer);

	//static:

	cnvgl_renderer_triangle.Constructor.triangles = function(vertices) {
		var i, prim;
		
		for (i = 0; i < vertices.length - 2; i+=3) {

			prim = new cnvgl_primitive();
			prim.vertices[0] = vertices[i];
			prim.vertices[1] = vertices[i + 1];
			prim.vertices[2] = vertices[i + 2];

			this.clipping.clip(prim);

			this.Triangle.triangle.call(this, prim);
		}
	};

	cnvgl_renderer_triangle.Constructor.triangleStrip = function(vertices) {
		var i, prim;
		for (i = 0; i < vertices.length - 2; i++) {

			prim = new cnvgl_primitive();
			prim.vertices[0] = vertices[i];
			prim.vertices[1] = vertices[i + 1];
			prim.vertices[2] = vertices[i + 2];

			this.clipping.clip(prim);

			this.Triangle.triangle.call(this, prim);
		}
	};

	cnvgl_renderer_triangle.Constructor.triangle = function(prim) {

		var v1, v2, v3, dir;
		var lsteps, rsteps, ysteps;
		var frag, varying;

		if (this.state.polygon.cullFlag) {
			dir = this.getPolygonFaceDir(prim.vertices);
			if (!(
				(dir > 0 && (this.state.polygon.cullFlag == GL_FALSE || this.state.polygon.cullFace == GL_FRONT)) ||
				(dir < 0 && (this.state.polygon.cullFlag == GL_FALSE || this.state.polygon.cullFace == GL_BACK)))) {
				return;	
			}
		}

		//prepare (sort) vertices
		this.vertex.sortVertices(prim);
		if (!prim.direction) {
			prim.direction = this.vertex.getDirection(prim.vertices);
		}

		dir = prim.direction;
		v1 = prim.vertices[0];
		if (dir > 0) {
			v2 = prim.vertices[1];
			v3 = prim.vertices[2];
		} else {
			v2 = prim.vertices[2];
			v3 = prim.vertices[1];				
		}

		/*
		console.log(Math.round(v1.sx), Math.round(v1.sy));
		console.log(Math.round(v2.sx), Math.round(v2.sy));
		console.log(Math.round(v3.sx), Math.round(v3.sy));
		console.log('----');
		*/

		frag = new cnvgl_fragment();
		varying = new cnvgl_rendering_varying(v1, v2, v3);

		lsteps = this.vertex.slope(v1.sx, v1.sy, v3.sx, v3.sy);
		rsteps = this.vertex.slope(v1.sx, v1.sy, v2.sx, v2.sy);

		var yi_start, yi_end, yi, yp = false, x_start, x_end;

		//top and bottom
		yi_start = Math.ceil(v1.sy - 0.5) + 1;
		yi_end = Math.ceil((v2.sy > v3.sy ? v2.sy : v3.sy) + 0.5) - 1;
		x_start = v1.sx;
		x_end = v1.sx;

		//top line is horizontal, "fix" x_end
		if (v1.sy == v2.sy) {
			x_end = v2.sx;
		}

		//for each horizontal scanline
		for (yi = yi_start; yi < yi_end; yi++) {

			//next vertex (v1, v2) -> (v2, v3)
			if (!yp && yi > v2.sy) {
				lsteps = this.vertex.slope(v2.sx, v2.sy, v3.sx, v3.sy);
				if (v1.sy != v2.sy) {
					lsteps.x = -lsteps.x;
				}
				yp = true;
			}

			//next vertex (v1, v3) -> (v2, v3)
			if (!yp && yi > v3.sy) {
				rsteps = this.vertex.slope(v2.sx, v2.sy, v3.sx, v3.sy);
				if (v1.sy != v2.sy) {
					rsteps.x = -rsteps.x;
				}
				yp = true;
			}

			x_start += lsteps.x;
			x_end += rsteps.x;

			this.Triangle.scanline.call(this, yi, x_start, x_end, frag, varying, [v1, v2, v3]);
		}
	};

	cnvgl_renderer_triangle.Constructor.scanline = function(yi, x_start, x_end, frag, varying, verts) {
		var buffer, vw, xi, id, ib, v, p;

		buffer = this.state.color_buffer;
		depth = this.state.depth_buffer;

		vw = this.state.viewport_w;

		x_start = Math.floor(x_start);
		id = (vw * yi + x_start);
		ib = id * 4;

		for (xi = x_start; xi < x_end; xi++) {

			p = [xi, yi, 0, 1];
			varying.prepare(frag, p);

			if (this.state.depth.test) {
				frag.gl_FragDepth = varying.interpolate(verts[0].z, verts[1].z, verts[2].z);
				if (frag.gl_FragDepth < depth[id]) {
					continue;
				}
				depth[id] = frag.gl_FragDepth;
				id++;
			}

			//interpolate varying
			for (v in varying.varying) {
				frag.varying[v] = varying.interpolate(varying.f1[v], varying.f2[v], varying.f3[v]);
			}

			this.fragment.process(frag);

			buffer[ib] = frag.r;
			buffer[ib + 1] = frag.g;
			buffer[ib + 2] = frag.b;
			ib+=4;

			//if (alpha, do calculation next)
		}		
	};

	//public:
	cnvgl_renderer_triangle.cnvgl_renderer_triangle = function() {
	};

	return cnvgl_renderer_triangle.Constructor;
};

