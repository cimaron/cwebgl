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

cnvgl_rendering_interpolate = (function() {

	function Initializer() {

		this.ctx = null;
		this.renderer = null;		
		
		this.v1 = null;
		this.v2 = null;
		this.v3 = null;

		this.a = null;
		this.b = null;
		this.c = null;
		this.wa = null;
		this.wb = null;
		this.wc = null;
		this.t = {};

		this.attributes = null;
		this.varying = null;
	}

	var cnvgl_rendering_interpolate = jClass('cnvgl_rendering_interpolate', Initializer);	

	//public:

	cnvgl_rendering_interpolate.cnvgl_rendering_interpolate = function(renderer) {
		this.renderer = renderer;
	};

	cnvgl_rendering_interpolate.setVertices = function(v1, v2, v3) {

		//this.varying = this.ctx.shader.activeProgram.varying.names;
		//this.attributes = this.ctx.shader.activeProgram.attributes.names;

		this.v1 = [v1.xw, v1.yw, v1.zw, v1.w];
		this.v2 = [v2.xw, v2.yw, v2.zw, v2.w];
		if (v3) {
			this.v3 = [v3.xw, v3.yw, v3.zw, v3.w];
		} else {
			this.v3 = null;	
		}
		this.precompute();
	};

	cnvgl_rendering_interpolate.interpolateAttributes = function(v1, v2, v3, dest) {
		var attribute, vi, vl, vs;
		for (v in this.attribute) {
			attribute = this.attribute[v];
			vl = attribute.location;
			vs = attribute.size;
			for (vi = 0; vi < attribute.slots; vi++) {
				this.interpolateTriangleVector(v1.attributes.data[vl], v2.attributes.data[vl], v3.attributes.data[vl], dest[vl], vs);
				vs -= 4;
			}
		}
	};

	cnvgl_rendering_interpolate.interpolateVarying = function(state, v1, v2, v3, dest) {
		var i;
		for (i = 0; i < state.activeVarying.length; i++) {
			if (state.activeVarying[i]) {
				this.interpolateTriangleVector(v1.varying.data[i], v2.varying.data[i], v3.varying.data[i], dest[i], state.activeVarying[i]);
			}
		}
	};

	cnvgl_rendering_interpolate.precompute = function() {
		var x1, x2, x3, y1, y2, y3, t;

		x1 = this.v1[0];
		x2 = this.v2[0];
		y1 = this.v1[1];
		y2 = this.v2[1];

		t = {};

		if (this.v3) {
			x3 = this.v3[0];		
			y3 = this.v3[1];

			t.a = (x2 - x1);
			t.b = (x3 - x1);
			t.c = (y2 - y1);
			t.d = (y3 - y1);
			t.e = (t.c / t.a);
			t.f = (t.d + t.e * t.b);
			t.g = 1 / (t.a * t.d - t.b * t.c);  

			this.wa = 1 / this.v1[3];
			this.wb = 1 / this.v2[3];
			this.wc = 1 / this.v3[3];
		
		} else {
			t.a = (x2 - x1);
			t.b = (y2 - y1);
			t.c = Math.sqrt(t.a * t.a + t.b * t.b);
		}

		this.t = t;
	};

	cnvgl_rendering_interpolate.setPoint = function(p) {
		var  x1, y1, x, y;

		x = p[0];
		y = p[1];
		x1 = this.v1[0];
		y1 = this.v1[1];

		if (this.v3) {

			this.b = (this.t.b * (y1 - y) + this.t.d * (x - x1)) * this.t.g;
			this.c = (this.t.a * (y - y1) - this.t.c * (x - x1)) * this.t.g;
			this.a = 1 - this.b - this.c;

			this.a *= this.wa;
			this.b *= this.wb;
			this.c *= this.wc;

			this.t.p = 1 / (this.a + this.b + this.c);
		
		} else {

			x = (x - x1);
			y = (y - y1);
			this.a = Math.sqrt(x * x + y * y);
			this.a = this.a / this.t.c;
			this.b = 1 - this.a;
		}
	};

	cnvgl_rendering_interpolate.interpolateLine = function(f1, f2) {
		var i, v;

		//todo: do a check that we need to interpolate at all
		if (typeof f1 == 'object') {
			v = [];
			for (i = 0; i < f1.length; i++) {
				v[i] = ((this.a * f1[i]) + (this.b * f2[i])) /* * this.t.p*/;
			}
		} else {
			v = ((this.a * f1) + (this.b * f2)) /* * this.t.p*/;
		}
		return v;				
	};

	cnvgl_rendering_interpolate.interpolateTriangle = function(f1, f2, f3) {
		var v;
		v = ((this.a * f1) + (this.b * f2) + (this.c * f3)) * this.t.p;
		return v;
	};

	cnvgl_rendering_interpolate.interpolateTriangleVector = function(f1, f2, f3, dest, size) {
		var i;
		//todo: do a check that we need to interpolate at all
		for (i = 0; i < size; i++) {
			dest[i] = ((this.a * f1[i]) + (this.b * f2[i]) + (this.c * f3[i])) * this.t.p;
		}
	};

	return cnvgl_rendering_interpolate.Constructor;

}());

