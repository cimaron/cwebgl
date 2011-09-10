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

cnvgl_rendering_fragment = (function() {

	//Internal Constructor
	function Initializer() {
		//public:
		this.ctx = null;
		this.renderer = null;

		this.program = null;
		this.data = null;
	}

	var cnvgl_rendering_fragment = jClass('cnvgl_rendering_fragment', Initializer);

	//public:

	cnvgl_rendering_fragment.cnvgl_rendering_fragment = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
		
		//build environment for fragment executable
		this.data = new cnvgl_rendering_program(ctx, renderer);
	};

	cnvgl_rendering_fragment.setProgram = function(program) {
		this.program = program.fragment_program;
		this.data._uniforms = program.active_uniforms_values;
	};

	cnvgl_rendering_fragment.prepareContext = function() {
		//this.data.prepareContext();
	};
	
	cnvgl_rendering_fragment.process = function(fragment) {

		this.data.fragment = fragment;
		this.program.apply(this.data);

		fragment.r = Math.round(fragment.gl_FragColor[0] * 255);
		fragment.g = Math.round(fragment.gl_FragColor[1] * 255);
		fragment.b = Math.round(fragment.gl_FragColor[2] * 255);
		fragment.a = Math.round(fragment.gl_FragColor[3] * 255);		
	};

	return cnvgl_rendering_fragment.Constructor;

}());

