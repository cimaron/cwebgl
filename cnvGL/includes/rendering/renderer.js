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
		this.ctx = null;
		this.program = null;
		this.vertex = null;
		this.fragment = null;
		this.clipping = null;
		this.interpolate = null;

		//renderers
		this.Point = null;
		this.Triangle = null;
		this.Line = null;

		//simple
		this.mode = null;
	}

	var cnvgl_renderer = jClass('cnvgl_renderer', Initializer);

	//public:

	cnvgl_renderer.cnvgl_renderer = function(ctx) {
		this.ctx = ctx;
		this.vertex = new cnvgl_rendering_vertex(this);
		this.fragment = new cnvgl_rendering_fragment(this);
		this.clipping = new cnvgl_rendering_clipping(this);
		this.interpolate = new cnvgl_rendering_interpolate(this);

		this.Point = new cnvgl_renderer_point();
		this.Triangle = new cnvgl_renderer_triangle();
		this.Line = new cnvgl_renderer_line();
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
		
		this.vertex.prepareContext();
		this.fragment.prepareContext();		
		
		switch (this.mode) {
			case GL_POINTS:
				this.Point.points.call(this, prim.vertices);
				break;
			case GL_LINES:
				this.Line.lines.call(this, prim.vertices);
				break;
			case GL_LINE_STRIP:
				this.Line.lineStrip.call(this, prim.vertices);
				break;
			case GL_LINE_LOOP:
				this.Line.lineLoop.call(this, prim.vertices);
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
		if (this.ctx.polygon.frontFace) {
			dir = -dir;	
		}
		return dir;
	};

	cnvgl_renderer.checkCull = function(prim) {
		var dir;
		if (this.ctx.polygon.cullFlag) {
			dir = this.getPolygonFaceDir(prim);
			if (!(
				(dir > 0 && (this.ctx.polygon.cullFlag == GL_FALSE || this.ctx.polygon.cullFace == GL_FRONT)) ||
				(dir < 0 && (this.ctx.polygon.cullFlag == GL_FALSE || this.ctx.polygon.cullFace == GL_BACK)))) {
				return true;
			}
		}
		return false;
	};

	cnvgl_renderer.checkDepth = function(i, z) {
		var mode, depth_buffer, pass;
		mode = this.ctx.depth.func;
		depth_buffer = this.ctx.depth_buffer;
		switch (mode) {
			case GL_NEVER:
				pass = false;
				break;
			case GL_ALWAYS:
				pass = true;
				break;
			case GL_LESS:
				pass = z < depth_buffer[i];
				break;
			case GL_LEQUAL:
				pass = z < depth_buffer[i];
				break;
			case GL_EQUAL:
				pass = z == depth_buffer[i];
				break;
			case GL_GREATER:
				pass = z > depth_buffer[i];
				break;
			case GL_GEQUAL:
				pass = z >= depth_buffer[i];
				break;
			case GL_NOTEQUAL:
				pass = z != depth_buffer[i];
				break;
			default:
				pass = true;
		}		
		return pass;
	};

	return cnvgl_renderer.Constructor;

}());

