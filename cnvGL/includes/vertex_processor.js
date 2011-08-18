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

cnvgl_vertex_processor = (function() {

	//External Constructor
	function Constructor() {
		processor.apply(this);
		this.processor();
	}

	//Internal Constructor
	function processor() {
		//public:
		this.mode = null;
		this.buffer = null;
		this.program = null;

		this.access = {
			_in : {
				gl_VertexID : 0,
				gl_InstanceID : 0
			},
			_out : {
				gl_Position : [0,0,0,0]
			},
			_inout : {},
			gl_PerVertex : {}
		};
	}

	//Class Inheritance
	Constructor.prototype = processor;

	//public:

	processor.processor = function() {
		//build data heap for vertex executable
		this.buffer = [];
	}
	
	processor.setProgram = function(program) {
		this.program = program;
	}

	processor.setMode = function(mode) {
		this.mode = mode;
	}

	processor.sendVertex = function() {

		var out = this.access._out;

		this.program.vertex_program.apply(this.access);

		//console.log('vertex out', out.gl_Position);

		var vertex = new cnvgl_vertex(out.gl_Position[0], out.gl_Position[1], out.gl_Position[2], out.gl_Position[3]);

		//@todo: clip line and split if necessary
		this.processVertex(vertex);
	
		this.buffer.push(vertex);

		if (this.mode == GL_TRIANGLES && this.buffer.length >= 3) {
			this.processTriangle();
			this.buffer = [];
		}
		
		if (this.mode == GL_TRIANGLE_STRIP && this.buffer.length >= 3) {
			this.processTriangle();
			this.buffer = [this.buffer[1], this.buffer[2]];
		}
	
		//@todo: finish the rest of the modes
	}
	
	processor.processVertex = function(v) {
		v.x = v.x / v.w;
		v.y = v.y / v.w;
		v.z = v.z / v.w;
	
		var buffer = cnvgl_state.color_buffer;
	
		var w = cnvgl_state.viewport_w;
		var h = cnvgl_state.viewport_h;
	
		v.sx = (v.x + 1) * (w / 2);
		v.sy = (1 - v.y) * (h / 2);
	}

	processor.processTriangle = function() {
		var v1 = this.buffer[0];
		var v2 = this.buffer[1];
		var v3 = this.buffer[2];
	
		//@todo: check directionality for backface culling here
	
		cnvgl_state.fragment_processor.processTriangle(v1, v2, v3);		
	}

	processor.processLine = function() {
		cnvgl_state.fragment_processor.processLine(this.buffer[0], this.buffer[1]);
	}

	return Constructor;

})();

