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

	cnvgl_rendering_vertex.process = function(vertex) {
		
		this.data.vertex = vertex;
		this.program.apply(this.data);
		
		vertex.x = vertex.gl_Position[0];
		vertex.y = vertex.gl_Position[1];
		vertex.z = vertex.gl_Position[2];
		vertex.w = vertex.gl_Position[3];

		this.normalize(vertex);
		this.transformScreen(vertex);
	};

	cnvgl_rendering_vertex.normalize = function(vertex) {
		if (vertex.w) {
			vertex.x /= vertex.w;
			vertex.y /= vertex.w;
			vertex.z /= vertex.w;
		} else {
			if (typeof vertex.z == 'undefined') {
				vertex.z = 0;
			}
		}
	};

	cnvgl_rendering_vertex.transformScreen = function(vertex) {		
		var w = this.renderer.state.viewport_w;
		var h = this.renderer.state.viewport_h;
		vertex.sx = (vertex.x + 1) * (w / 2);
		vertex.sy = (1 - vertex.y) * (h / 2);
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
			if (vs[i].sy < ymin || (vs[i].sy == ymin && vs[i].sx < yminx)) {
				ymin = vs[i].sy;
				yminx = vs[i].sx;
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

	cnvgl_rendering_vertex.getDirection = function(vs) {

		var v1, v2, v3, dir;
		if (vs.length < 3) {
			return;
		}

		v1 = vs[0];
		v2 = vs[1];
		v3 = vs[vs.length - 1];

		//determine direction (cw vs ccw)

		//(v1, v2) is horizontal, can get direction directly from x values
		if (v1.sy == v2.sy) {
			dir = (v1.sx < v2.sx) ? 1 : -1;
			return dir;
		}

		//(v1, vlast) is horizontal, can get direction directly from x values
		if (v1.sy == v3.sy) {
			dir = (v1.sx < v3.sx) ? -1 : 1;
			return dir;
		}

		//pick a y value (v1 is top, so v2.sy > v1.sy and vlast.sy > v1.sy)
		var v2ya, v3ya, yi, dxl, dxr, xl, xr;

		v2ya = (v1.sy + v2.sy / 2) - v1.sy;
		v3ya = (v1.sy + v3.sy / 2) - v1.sy;

		//lower one should fall on both edges 
		yi = Math.min(v2ya, v3ya);

		//compute x value on both edges
		dxl = (v2.sx - v1.sx) / (v2.sy - v1.sy);
		dxr = (v3.sx - v1.sx) / (v3.sy - v1.sy);

		dir = (dxl < dxr) ? -1 : 1;

		return dir;
	};

	cnvgl_rendering_vertex.slope = function(x1, y1, x2, y2) {
		var i, slope = {};
		var x, y;
		x = x1 - x2;
		y = y1 - y2;

		//need to do check for zero?
		slope.x = y != 0 ? x / y : 0;
		slope.y = x != 0 ? y / x : 0;
		return slope;
	};


	return cnvgl_rendering_vertex.Constructor;

}());

