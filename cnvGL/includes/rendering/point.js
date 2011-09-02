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

cnvgl_renderer_point = function() {

	//Internal Constructor
	function Initializer() {
	}

	var cnvgl_renderer_point = jClass('cnvgl_renderer_point', Initializer);

	//static:

	cnvgl_renderer_point.Constructor.points = function(vertices) {
		var i;
		for (i = 0; i < vertices.length; i++) {
			this.Point.point.call(this, vertices[i]);
		}
	};

	cnvgl_renderer_point.Constructor.point = function(v) {

		var buffer, i, x, y, vw, ib, p, varying, frag;

		buffer = this.ctx.color_buffer;
		vw = this.ctx.viewport.w;
		x = Math.round(v.xw);
		y = Math.round(v.yw);

		p = [x, y, 0, 1];

		frag = new cnvgl_fragment();
		for (i in v.varying) {
			frag.varying[i] = v.varying[i];	
		}

		this.fragment.process(frag);

		ib = (vw * y + x) * 4;
		buffer[ib] = frag.r;
		buffer[ib + 1] = frag.g;
		buffer[ib + 2] = frag.b;
	};

	//public:
	cnvgl_renderer_point.cnvgl_renderer_point = function() {
	};

	return cnvgl_renderer_point.Constructor;
};

