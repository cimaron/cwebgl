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


cWebGL.drivers.WebGL = (function() {

	function Initializer() {
		cWebGL.Driver.Initializer.apply(this);
	}

	var DriverWebGL = jClass('DriverWebGL', Initializer, cWebGL.Driver);

	//static:

	DriverWebGL.Static.test = function() {
		return cWebGL.native;
	};

	//public:

	DriverWebGL.DriverWebGL = function(canvas, config) {
		this.Driver(canvas, config);
		this._context = canvas.getContext('experimental-webgl', config, true);
		if (this._context) {
			this.ready = true;
		}
	};

	DriverWebGL.clearColorBuffer = function(buffer, color) {
		this._context.clearColor(color[0], color[1], color[2], color[3]);
		this._context.clear(this._context.COLOR_BUFFER_BIT);
	};

	DriverWebGL.clearDepthBuffer = function(buffer, depth) {
		this._context.clearDepth(depth);
		this._context.clear(this._context.DEPTH_BUFFER_BIT);
	};

	DriverWebGL.compileShader = function(source, type) {
		var shader;
		shader = this._context.createShader(type);
		this._context.shaderSource(shader, source);
		this._context.compileShader(shader);
		this.compileStatus = this._context.getShaderParameter(shader, this._context.COMPILE_STATUS);
		this.compileErrors = this._context.getShaderInfoLog(shader);
		return shader;
	};

	DriverWebGL.getColorBuffer = function(obj, width, height) {
		if (obj === 0) {
			return 0;
		}
		throw new Error('not implemented');
	};

	DriverWebGL.getDepthBuffer = function(obj, width, height) {
		if (obj === 0) {
			return 0;
		}
		throw new Error('not implemented');
	};

	DriverWebGL.link = function(shaders) {
		var i, program;
		program = this._context.createProgram();

		for (i = 0; i < shaders.length; i++) {
			this._context.attachShader(program, shaders[i]);
		}

		this._context.linkProgram(program);
		this.linkStatus = this._context.getProgramParameter(program, this._context.LINK_STATUS)
		this.linkErrors = this._context.getProgramInfoLog(program);
		return program;
	};

	return DriverWebGL.Constructor;
	
}());

