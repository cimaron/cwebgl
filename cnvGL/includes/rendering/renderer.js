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

cnvgl_renderer = (function() {

	//Internal Constructor
	function Initializer() {
		//public:
		this.state = null;
		this.program = null;
		this.vertex = null;
		this.fragment = null;
		this.clipping = null;

		//renderers
		this.Point = null;
		this.Triangle = null;
		
		//current rendering state		
		this.t = {};
		
		//simple
		this.mode = null;
	}

	var cnvgl_renderer = jClass('cnvgl_renderer', Initializer);

	//public:

	cnvgl_renderer.cnvgl_renderer = function() {
		this.vertex = new cnvgl_rendering_vertex(this);
		this.fragment = new cnvgl_rendering_fragment(this);
		this.clipping = new cnvgl_rendering_clipping(this);

		this.Point = new cnvgl_renderer_point();
		this.Triangle = new cnvgl_renderer_triangle();
	};

	cnvgl_renderer.setProgram = function(program) {
		this.program = program;	
		this.vertex.setProgram(program.vertex_program);
		this.fragment.setProgram(program.fragment_program);
	};
	
	cnvgl_renderer.setMode = function(mode) {
		this.mode = mode;
	};

	cnvgl_renderer.send = function(prim) {
		var i;
		for (i = 0; i < prim.vertices.length; i++) {
			this.vertex.process(prim.vertices[i]);
		}
		this.render(prim);
	};

	cnvgl_renderer.render = function(prim) {
		switch (this.mode) {
			case GL_POINTS:
				this.Point.points.call(this, prim.vertices);
				break;
			case GL_LINE_LOOP:
				this.renderLineLoop(prim.vertices);
				break;
			case GL_TRIANGLES:
				this.Triangle.triangles.call(this, prim.vertices);
				break;
			case GL_TRIANGLE_STRIP:
				this.Triangle.triangleStrip.call(this, prim.vertices);
				break;
		}
	};

	cnvgl_renderer.getPolygonFaceDir = function(prim) {
		var dir;
		dir = prim.getDirection();
		if (this.state.polygon.frontFace) {
			dir = -dir;	
		}
		return dir;
	};

	cnvgl_renderer.checkCull = function(prim) {
		var dir;
		if (this.state.polygon.cullFlag) {
			dir = this.getPolygonFaceDir(prim);
			if (!(
				(dir > 0 && (this.state.polygon.cullFlag == GL_FALSE || this.state.polygon.cullFace == GL_FRONT)) ||
				(dir < 0 && (this.state.polygon.cullFlag == GL_FALSE || this.state.polygon.cullFace == GL_BACK)))) {
				return true;
			}
		}
		return false;
	};

	return cnvgl_renderer.Constructor;

}());

