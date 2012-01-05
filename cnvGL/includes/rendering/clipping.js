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

cnvgl_rendering_clipping = (function() {

	function Initializer() {
		//public:
		this.ctx = null;
		this.renderer = null;

		this.v1 = null;
		this.v2 = null;
		this.v3 = null;

		this.planes = [];
	}

	var cnvgl_rendering_clipping = jClass('cnvgl_rendering_clipping', Initializer);	

	cnvgl_rendering_clipping.cnvgl_rendering_clipping = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
		this.planes = [[ 1,  0,  0],
					  [-1,  0,  0],
					  [ 0,  1,  0],
					  [ 0, -1,  0],
					  [ 0,  0,  1],
					  [ 0,  0, -1]];
	};

	cnvgl_rendering_clipping.clipPoint = function(prim) {
		var p;

		p = prim.vertices[0];

		if (p.xd < -1 || p.xd > 1 ||
			p.yd < -1 || p.yd > 1 ||
			p.zd < -1 || p.zd > 1) {
			return 0;
		}

		return 1;
	};

	cnvgl_rendering_clipping.clipLine = function(prim) {
		clipped.push(prim);
		return 1;
	};

	cnvgl_rendering_clipping.clipTriangle = function(prim, clipped) {
		var i, p, nprim;

		//store for interpolation
		this.v1 = prim.vertices[0];
		this.v2 = prim.vertices[1];
		this.v3 = prim.vertices[2];

		this.renderer.interpolate.setVertices(this.v1, this.v2, this.v3);

		for (i = 0; i < this.planes.length; i++) {
			p = this.planes[i];
			if (!this.clipTriangleToPlane(prim, p[0], p[1], p[2], 1)) {
				return 0;
			}
		}

		//prim is now clipped, and may have extra vertices
		
		for (i = 0; i < prim.vertices.length; i+=3) {
			nprim = new cnvgl_primitive();
			nprim.vertices.push(prim.vertices[i]);
			nprim.vertices.push(prim.vertices[i + 1]);
			nprim.vertices.push(prim.vertices[i + 2]);
			clipped.push(nprim);
		}

		return clipped.length;
	};

	cnvgl_rendering_clipping.interpolate = function(v1, v2, amt) {
		var int, xw, yw, vr, namt, v;

		int = this.renderer.interpolate;

		namt = 1 - amt;

		xw = v1.xw * namt + v2.xw * amt;
		yw = v1.yw * namt + v2.yw * amt;

		int.setPoint([xw, yw]);

		vr = new cnvgl_vertex();

		//we don't need to interpolate all values, only those used in the rest of the rendering pipeline
		vr.xw = v1.xw * namt + v2.xw * amt;
		vr.yw = v1.yw * namt + v2.yw * amt;
		vr.zw = v1.zw * namt + v2.zw * amt;

		vr.w = v1.w * namt + v2.w * amt;

		//interpolate
		//int.interpolateAttributes(this.v1, this.v2, this.v3, vr);
		int.interpolateVarying(this.v1, this.v2, this.v3, vr.varying.data);

		return vr;
	};

	cnvgl_rendering_clipping.clipTriangleToPlane = function(prim, px, py, pz, pd) {
		var v1, v2, v3, d1, d2, d3, cx, n, l;

		n = 0;
		l = prim.vertices.length;

		while (n < l) {

			v1 = prim.vertices[n];
			v2 = prim.vertices[n + 1];
			v3 = prim.vertices[n + 2];

			d1 = (v1.xd * px + v1.yd * py + v1.zd * pz);
			d2 = (v2.xd * px + v2.yd * py + v2.zd * pz);
			d3 = (v3.xd * px + v3.yd * py + v3.zd * pz);

			cx = (d1 <= pd ? 1 : 0) + (d2 <= pd ? 1 : 0) + (d3 <= pd ? 1 : 0);

			if (cx == 0) {

				if (n == 0 && prim.vertices.length == 3) {
					// totally clipped
					return false;
				}

				prim.vertices.splice(n, 3); // remove 3 elements
				l -= 3; // update length
				n -= 3; // update counter so next time around we're ok

			} else if (cx == 1) { // only one point unclipped, create one tri (reuse this)

				if (d1 <= pd) { // v1 is fine
					prim.vertices[n + 1] = this.interpolate(v1, v2, (pd -d1)/(d2-d1));
					prim.vertices[n + 2] = this.interpolate(v1, v3, (pd-d1)/(d3-d1));
				} else if (d2 <= pd) { // v2
					prim.vertices[n + 0] = this.interpolate(v2, v1, (pd-d2)/(d1-d2));
					prim.vertices[n + 2] = this.interpolate(v2, v3, (pd-d2)/(d3-d2));
				} else { // v3
					prim.vertices[n + 0] = this.interpolate(v3, v1, (pd-d3)/(d1-d3));
					prim.vertices[n + 1] = this.interpolate(v3, v2, (pd-d3)/(d2-d3));
				}

			} else if (cx == 2) { // two points unclipped, must make a quad (reuse this, + add one tri)
				// note that we don't increase l here, as we don't need to check this new tri
				if (d1 > pd) { // v1 is Clipped
					prim.vertices[n + 0] = this.interpolate(v2, v1, (pd-d2)/(d1-d2));
					prim.vertices.push(prim.vertices[n], prim.vertices[n + 2], this.interpolate(v3, v1, (pd-d3)/(d1-d3)));
				} else if (d2 > pd) { // v2 is Clipped
					prim.vertices[n + 1] = this.interpolate(v3, v2, (pd-d3)/(d2-d3));
					prim.vertices.push(prim.vertices[n], this.interpolate(v1, v2, (pd-d1)/(d2-d1)), prim.vertices[n + 1]);
				} else { // v3
					prim.vertices[n + 2] = this.interpolate(v1, v3, (pd-d1)/(d3-d1));
					prim.vertices.push(this.interpolate(v2, v3, (pd-d2)/(d3-d2)), prim.vertices[n + 2], prim.vertices[n + 1]);
				}
			} // otherwise 3 = unclipped

			n += 3;
		}

		return prim.vertices.length > 0;
	};


	return cnvgl_rendering_clipping.Constructor;

}());

