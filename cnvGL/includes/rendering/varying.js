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
		
		this.f1 = {};
		this.f2 = {};
		this.f3 = {};

		this.area = null;
		this.varying = {};
	}

	var cnvgl_rendering_varying = jClass('cnvgl_rendering_varying', Initializer);	

	//public:

	cnvgl_rendering_varying.cnvgl_rendering_varying = function(v1, v2, v3) {

		this.v1 = [v1.sx, v1.sy, 0];
		this.v2 = [v2.sx, v2.sy, 0];
		this.v3 = [v3.sx, v3.sy, 0];

		this.area = this.getArea(this.v1, this.v2, this.v3);

		for (var i in v1.varying) {
			this.varying[i] = [0, 0, 0, 0];
			this.f1[i] = v1.varying[i];
			this.f2[i] = v2.varying[i];
			this.f3[i] = v3.varying[i];
		}
	};

	cnvgl_rendering_varying.prepare = function(fragment, p) {
		for (i in this.varying) {
			fragment.varying[i] = this.interpolate(p, this.f1[i], this.f2[i], this.f3[i]);
		}
	};

	cnvgl_rendering_varying.interpolate = function(p, f1, f2, f3) {
		var a1, a2, a3, A1, A2, A3, fp;

		A1 = this.getArea(p, this.v2, this.v3);
		A2 = this.getArea(this.v1, p, this.v3);
		A3 = this.getArea(this.v1, this.v2, p);

		a1 = A1 / this.area;
		a2 = A2 / this.area;
		a3 = A3 / this.area;

		fp = [];
		var i;
		for (i = 0; i < f1.length; i++) {
			//linear
			fp[i] = (a1*f1[i] + a2 * f2[i] + a3 * f3[i]);
			//fp[i] = 1;
			//perspective
		}
		return fp;
	};

	cnvgl_rendering_varying.getArea = function(v1, v2, v3) {
		var v12, v13, area;
		v12 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
		v13 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
		area = vec3.length(vec3.cross(v12, v13, [])) / 2;
		return area;
	};

	return cnvgl_rendering_varying.Constructor;

}());

