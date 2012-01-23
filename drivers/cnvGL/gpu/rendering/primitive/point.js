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

cnvgl_rendering_primitive_point = (function() {

	//Internal Constructor
	function Initializer() {
		//public:
		this.renderer = null;

		this.prim = null;
	}

	var cnvgl_rendering_primitive_point = jClass('cnvgl_rendering_primitive_point', Initializer);

	//public:

	cnvgl_rendering_primitive_point.cnvgl_rendering_primitive_point = function(renderer) {
		this.renderer = renderer;
		this.frag = new cnvgl.fragment();
	};

	cnvgl_rendering_primitive_point.render = function(state, prim) {
		var num;

		num = this.renderer.clipping.clipPoint(prim);

		if (num) {
			this.renderClipped(state, prim);
		}

	};

	cnvgl_rendering_primitive_point.renderClipped = function(state, prim) {
		var vw, v, x, y, i;

		this.prim = prim;

		v = prim.vertices[0];
		x = Math.round(v.xw);
		y = Math.round(v.yw);

		vw = state.viewportW;

		/*
		for (i in v.varying) {
			this.frag.varying[i] = v.varying[i];
		}
		*/

		i = (vw * y + x);

		this.renderer.fragment.process(state, this.frag);
		this.renderer.fragment.write(state, i, this.frag);
	};

	return cnvgl_rendering_primitive_point.Constructor;
}());

