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

cnvgl_rendering_varying = (function() {

	function Initializer() {
		this.v1 = null;
		this.v2 = null;
		this.v3 = null;
		this.varying = {};
		this.f1 = {};
		this.f2 = {};
		this.f3 = {};
		
		this.t = {};
		
	}

	var cnvgl_rendering_varying = jClass('cnvgl_rendering_varying', Initializer);	

	//public:

	cnvgl_rendering_varying.cnvgl_rendering_varying = function(v1, v2, v3) {

		this.v1 = [v1.sx, v1.sy, 0];
		this.v2 = [v2.sx, v2.sy, 0];
		this.v3 = [v3.sx, v3.sy, 0];

		for (var i in v1.varying) {
			this.varying[i] = null;
			this.f1[i] = v1.varying[i];
			this.f2[i] = v2.varying[i];
			this.f3[i] = v3.varying[i];
		}
		
		this.precompute();
	};

	cnvgl_rendering_varying.precompute = function() {
		var x0, x1, x2, y0, y1, y2;
		x0 = this.v1[0];
		x1 = this.v2[0];
		x2 = this.v3[0];		
		y0 = this.v1[1];
		y1 = this.v2[1];
		y2 = this.v3[1];

		this.t.a = (x1 - x0);
		this.t.b = (x2 - x0);
		this.t.c = (y1 - y0);
		this.t.d = (y2 - y0);
		this.t.e = (this.t.c / this.t.a);
		this.t.f = (this.t.d + this.t.e * this.t.b);
		this.t.g = 1 / (this.t.a * this.t.d - this.t.b * this.t.c);		
	};

	cnvgl_rendering_varying.prepare = function(fragment, p) {
		for (i in this.varying) {
			fragment.varying[i] = this.interpolate(p, this.f1[i], this.f2[i], this.f3[i]);
		}
	};

	cnvgl_rendering_varying.interpolate = function(p, f1, f2, f3) {

		var xp, yp;
		var x0 = this.v1[0];
		var y0 = this.v1[1];
		xp = p[0];
		yp = p[1];

		var u = (this.t.a * (yp - y0) - this.t.c * (xp - x0)) * this.t.g;
		var t = (this.t.b * (y0 - yp) + this.t.d * (xp - x0)) * this.t.g;

		var v = [];
		for (var i in f1) {
			v[i] = f1[i] + t * (f2[i] - f1[i]) + u * (f3[i] - f1[i]);
		}

		return v;
	};

	return cnvgl_rendering_varying.Constructor;

}());

