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

cnvgl_rendering_primitive = (function() {

	//Internal Constructor
	function Initializer() {

		//public:
		this.renderer = null;

		this.line = null;
		this.point = null;
		this.triangle = null;
		
		this.vertices = [];
	}

	var cnvgl_rendering_primitive = jClass('cnvgl_rendering_primitive', Initializer);

	cnvgl_rendering_primitive.cnvgl_rendering_primitive = function(renderer) {
		this.renderer = renderer;
		this.line = new cnvgl_rendering_primitive_line(renderer);
		this.point = new cnvgl_rendering_primitive_point(renderer);
		this.triangle = new cnvgl_rendering_primitive_triangle(renderer);
	};

	cnvgl_rendering_primitive.send = function(state, mode, vertex) {
		this.vertices.push(vertex);
		switch (mode) {
			case cnvgl.POINTS:
				this.points(state);
				break;
			case cnvgl.LINES:
				this.lines(state);
				break;
			case cnvgl.LINE_STRIP:
				this.lineStrip(state);
				break;
			case cnvgl.LINE_LOOP:
				this.lineLoop(state);
				break;
			case cnvgl.TRIANGLES:
				this.triangles(state);
				break;
			case cnvgl.TRIANGLE_STRIP:
				this.triangleStrip(state);
				break;
		}
	};

	cnvgl_rendering_primitive.end = function(state, mode) {
		switch (mode) {
			case cnvgl.LINE_LOOP:
				//swap vertices
				this.vertices.push(this.vertices.shift());
				this.lines(state);
				break;
		}
		this.vertices = [];
	};

	cnvgl_rendering_primitive.points = function(state) {
		var prim;
		prim = new cnvgl.primitive();
		prim.vertices.push(this.vertices.shift());
		this.point.render(state, prim);
	};

	cnvgl_rendering_primitive.lines = function(state) {
		var prim;
		if (this.vertices.length > 1) {
			prim = new cnvgl.primitive();
			prim.vertices.push(this.vertices.shift());
			prim.vertices.push(this.vertices.shift());
			this.line.render(state, prim);
		}
	};

	cnvgl_rendering_primitive.lineStrip = function(state) {
		var prim;
		if (this.vertices.length > 1) {
			prim = new cnvgl.primitive();
			prim.vertices.push(this.vertices.shift());
			prim.vertices.push(this.vertices[0]);
			this.line.render(state, prim);
		}
	};

	cnvgl_rendering_primitive.lineLoop = function(state) {
		var prim, v0;
		if (this.vertices.length < 2) {
			return;
		}
		prim = new cnvgl.primitive();
		if (this.vertices.length > 2) {
			v0 = this.vertices.shift();
			prim.vertices.push(this.vertices.shift());
			prim.vertices.push(this.vertices[0]);
			this.vertices.unshift(v0);
		} else {
			prim.vertices.push(this.vertices[0]);
			prim.vertices.push(this.vertices[1]);
		}
		this.line.render(state, prim);
	};

	cnvgl_rendering_primitive.triangles = function(state) {
		var prim;
		if (this.vertices.length > 2) {
			prim = new cnvgl.primitive();
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices.shift());
			this.triangle.render(state, prim);
		}
	};

	cnvgl_rendering_primitive.triangleStrip = function(state) {
		var prim;
		if (this.vertices.length > 2) {
			prim = new cnvgl.primitive();
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices[0]);
			prim.vertices.push(this.vertices[1]);
			this.triangle.render(state, prim);
		}
	};

	return cnvgl_rendering_primitive.Constructor;

}());