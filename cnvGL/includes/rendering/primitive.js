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
		this.ctx = null;
		this.renderer = null;

		this.line = null;
		this.point = null;
		this.triangle = null;
		
		this.mode = null;
		this.vertices = [];
	}

	var cnvgl_rendering_primitive = jClass('cnvgl_rendering_primitive', Initializer);

	cnvgl_rendering_primitive.cnvgl_rendering_primitive = function(ctx, renderer) {

		this.ctx = ctx;
		this.renderer = renderer;

		this.line = new cnvgl_rendering_primitive_line(ctx, renderer);
		this.point = new cnvgl_rendering_primitive_point(ctx, renderer);
		this.triangle = new cnvgl_rendering_primitive_triangle(ctx, renderer);
	};

	cnvgl_rendering_primitive.setMode = function(mode) {
		this.mode = mode;
	};
	
	cnvgl_rendering_primitive.send = function(vertex) {
		this.vertices.push(vertex);
		switch (this.mode) {
			case GL_POINTS:
				this.points();
				break;
			case GL_LINES:
				this.lines();
				break;
			case GL_LINE_STRIP:
				this.lineStrip();
				break;
			case GL_LINE_LOOP:
				this.lineLoop();
				break;
			case GL_TRIANGLES:
				this.triangles();
				break;
			case GL_TRIANGLE_STRIP:
				this.triangleStrip();
				break;
		}
	};

	cnvgl_rendering_primitive.end = function() {
		switch (this.mode) {
			case GL_LINE_LOOP:
				this.lines();
				break;
		}
		this.vertices = [];
	};

	cnvgl_rendering_primitive.points = function(vertices) {
		var prim;
		prim = new cnvgl_primitive();
		prim.mode = this.mode;
		prim.vertices.push(this.vertices.shift());
		this.point.render(prim);		
	};

	cnvgl_rendering_primitive.lines = function() {
		var prim;
		if (this.vertices.length > 1) {
			prim = new cnvgl_primitive();
			prim.mode = this.mode;
			prim.vertices.push(this.vertices.shift());
			prim.vertices.push(this.vertices.shift());
			this.line.render(prim);
		}
	};

	cnvgl_rendering_primitive.lineStrip = function() {
		var prim;
		if (this.vertices.length > 1) {
			prim = new cnvgl_primitive();
			prim.mode = this.mode;
			prim.vertices.push(this.vertices.shift());
			prim.vertices.push(this.vertices[0]);
			this.line.render(prim);
		}
	};

	cnvgl_rendering_primitive_line.lineLoop = function() {
		var prim, v0;
		if (this.vertices.length < 2) {
			return;	
		}
		prim = new cnvgl_primitive();
		prim.mode = this.mode;			
		if (vertices.length > 2) {
			v0 = this.vertices.shift();
		}
		prim.vertices.push(this.vertices.shift());
		prim.vertices.push(this.vertices[0]);
		if (v0) {
			prim.vertices.unshift(v0);
		}
		this.line.render(prim);
	};

	cnvgl_rendering_primitive.triangles = function() {
		var prim;
		if (this.vertices.length > 2) {
			prim = new cnvgl_primitive();
			prim.mode = this.mode;
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices.shift());	
			this.triangle.render(prim);
		}
	};

	cnvgl_rendering_primitive.triangleStrip = function() {
		var prim;
		if (this.vertices.length > 2) {
			prim = new cnvgl_primitive();
			prim.mode = this.mode;
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices[0]);
			prim.vertices.push(this.vertices[1]);
			this.triangle.render(prim);
		}
	};

	return cnvgl_rendering_primitive.Constructor;

}());