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

cnvgl_rendering_vertex = (function() {

	//Internal Constructor
	function Initializer() {
		//public:
		this.renderer = null;
		this.program = null;
		this.state = null;
		this.data = null;
	}

	var cnvgl_rendering_vertex = jClass('cnvgl_rendering_vertex', Initializer);

	//public:
	cnvgl_rendering_vertex.cnvgl_rendering_vertex = function(renderer) {
		this.renderer = renderer;
		//build data heap for vertex executable
		this.data = new cnvgl_rendering_data();
	};

	cnvgl_rendering_vertex.setProgram = function(vertex_program) {
		this.program = vertex_program;
	};

	cnvgl_rendering_vertex.setMode = function(mode) {
		this.mode = mode;
	};

	cnvgl_rendering_vertex.process = function(v) {
		debugger;
		this.data.vertex = v;
		this.program.apply(this.data);

		v.x = v.gl_Position[0];
		v.y = v.gl_Position[1];
		v.z = v.gl_Position[2];
		v.w = v.gl_Position[3];

		this.setNormalizedCoordinates(v);
		this.setWindowCoordinates(v);
	};

	cnvgl_rendering_vertex.setNormalizedCoordinates = function(v) {
		if (v.w) {
			v.xd = v.x / v.w;
			v.yd = v.y / v.w;
			v.zd = v.z / v.w;
		}
	};

	cnvgl_rendering_vertex.setWindowCoordinates = function(v) {		
		var vp;
		vp = this.renderer.state.viewport;
		v.xw = (vp.x + vp.w / 2) + (vp.w / 2 * v.xd);
		v.yw = (vp.y + vp.h / 2) - (vp.h / 2 * v.yd);
		v.zw = ((vp.far - vp.near) / 2) * v.zd + ((vp.near + vp.far) / 2);
	};

	cnvgl_rendering_vertex.sortVertices = function(prim) {

		if (prim.sorted) {
			return;
		}

		var ymin = 99999, yminx = 9999, yi, i, vs, vertices= [];
		vs = prim.vertices;

		//nothing to sort
		if (vs.length < 2) {
			return;
		}

		//find top vertex
		for (i = 0; i < vs.length; i++) {
			if (vs[i].yw < ymin || (vs[i].yw == ymin && vs[i].xw < yminx)) {
				ymin = vs[i].yw;
				yminx = vs[i].xw;
				yi = i;
			}
		}

		//reorder vertices
		for (i = 0; i < vs.length; i++) {
			vertices[i] = vs[yi];
			yi++;
			if (yi >= vs.length) {
				yi = 0;
			}
		}

		prim.vertices = vertices;
		prim.sorted = true;
	};
	
	cnvgl_rendering_vertex.slope = function(x1, y1, x2, y2) {
		x1 = x2 - x1;
		y1 = y2 - y1;
		//divide by zero should return Nan
		return (x1 / y1);
	};

	return cnvgl_rendering_vertex.Constructor;

}());

