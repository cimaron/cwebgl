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
		this.v1 = null;
		this.v2 = null;
		this.v3 = null;

		this.a = null;
		this.b = null;
		this.c = null;
		this.t = {};
	}

	var cnvgl_rendering_interpolate = jClass('cnvgl_rendering_interpolate', Initializer);	

	//public:

	cnvgl_rendering_interpolate.cnvgl_rendering_interpolate = function() {
	};
	
	cnvgl_rendering_interpolate.setVertices = function(v1, v2, v3) {

		this.v1 = [v1.xw, v1.yw, v1.zw];
		this.v2 = [v2.xw, v2.yw, v2.zw];
		this.v3 = [v3.xw, v3.yw, v3.zw];

		this.precompute();
	};

	cnvgl_rendering_interpolate.precompute = function() {

		var x1, x2, x3, y1, y2, y3, t;
		x1 = this.v1[0];
		x2 = this.v2[0];
		x3 = this.v3[0];		
		y1 = this.v1[1];
		y2 = this.v2[1];
		y3 = this.v3[1];

		t = this.t;

		t.a = (x2 - x1);
		t.b = (x3 - x1);
		t.c = (y2 - y1);
		t.d = (y3 - y1);
		t.e = (this.t.c / this.t.a);
		t.f = (this.t.d + this.t.e * this.t.b);
		t.g = 1 / (this.t.a * this.t.d - this.t.b * this.t.c);   

		/*
		t.y2_y3 = (y2 - y3);
		t.x3_x2 = (x3 - x2);
		t.x1_x3 = (x1 - x3);
		t.y1_y3 = (y1 - y3);
		t.y3_y1 = (y3 - y1);
		t.det = (t.y2_y3 * t.x1_x3) + (t.x3_x2 * t.y1_y3);
		*/
	};

	cnvgl_rendering_interpolate.setPoint = function(p) {

		var  t, x1, y1, x, y;

		t = this.t;

		x = p[0];
		y = p[1];
		x1 = this.v1[0];
		y1 = this.v1[1];


		this.b = (this.t.b * (y1 - y) + this.t.d * (x - x1)) * this.t.g;
		this.c = (this.t.a * (y - y1) - this.t.c * (x - x1)) * this.t.g;
		this.a = 1 - this.b - this.c;


		/*
		x3 = this.v3[0];
		y3 = this.v3[1];
		
		x_x3 = x - x3;
		y_y3 = y - y3;

		this.a = (t.y2_y3 * x_x3) + (t.x3_x2 * y_y3) / t.det;
		this.b = (t.y3_y1 * x_x3) + (t.x1_x3 * y_y3) / t.det;
		this.c = 1 - this.a - this.b;
		*/
		
		
	};

	cnvgl_rendering_interpolate.interpolate = function(f1, f2, f3) {

		//todo: do a check that we need to interpolate at all
		var i, v;
		if (typeof f1 == 'object') {
			v = [];
			for (i = 0; i < f1.length; i++) {
				v[i] = (this.a * f1[i]) + (this.b * f2[i]) + (this.c * f3[i]);
			}
		} else {
			v = (this.a * f1) + (this.b * f2) + (this.c * f3);
		}
		return v;
	};

	return cnvgl_rendering_interpolate.Constructor;

}());

