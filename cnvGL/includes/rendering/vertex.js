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
	
	cnvgl_rendering_vertex.slopeX = function(x1, y1, x2, y2) {
		x1 = x2 - x1;
		y1 = y2 - y1;
		//divide by zero should return Nan
		return (x1 / y1);
	};

	return cnvgl_rendering_vertex.Constructor;

}());

