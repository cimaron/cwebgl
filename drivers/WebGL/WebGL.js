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

		this.symbols = [];
		this.attributes = [];
		this.uniforms = [];
	}

	var DriverWebGL = jClass('DriverWebGL', Initializer, cWebGL.Driver);

	//static:

	DriverWebGL.Static.test = function() {
		return cWebGL.native;
	};

	//public:

	DriverWebGL.DriverWebGL = function(canvas, config) {
		this.Driver(canvas, config);
		this._context = WebGLDebugUtils.makeDebugContext(canvas.getContext('experimental-webgl', config, true));
		if (this._context) {
			this.ready = true;
		}
	};

	DriverWebGL.clear = function(ctx, color, depth, mask) {
		this._context.clearColor(color[0], color[1], color[2], color[3]);
		this._context.clearDepth(depth);
		this._context.clear(mask);
	};

	DriverWebGL.compileShader = function(source, type) {
		var shader, symbols;

		shader = this._context.createShader(type);
		this._context.shaderSource(shader, source);
		this._context.compileShader(shader);
		this.compileStatus = this._context.getShaderParameter(shader, this._context.COMPILE_STATUS);
		this.compileErrors = this._context.getShaderInfoLog(shader);

		if (this.compileStatus) {
			symbols = glsl.getSymbols(source, type - this._context.FRAGMENT_SHADER);
			this.symbols.push(symbols);
		}

		return shader;
	};

	DriverWebGL.cullFace = function(ctx, mode) {
		this._context.cullFace(mode);
	};

	DriverWebGL.depthRange = function(ctx, n, f) {
		this._context.depthRange(n, f);
	};

	DriverWebGL.drawArrays = function(ctx, mode, first, count) {
		this._context.enable(this._context.DEPTH_TEST);
		this._context.useProgram(ctx.shader.activeProgram.program.programObj);
		this._context.drawArrays(mode, first, count);
	};

	DriverWebGL.enable = function(ctx, cap, v) {
		if (v) {
			this._context.enable(cap);
		} else {
			this._context.disable(cap);			
		}
	};

	DriverWebGL.frontFace = function(ctx, mode) {
		this._context.frontFace(mode);
	};

	DriverWebGL.link = function(shaders) {
		var i, j, program, symbols, symbol, attr, unif;
		program = new cWebGL.Driver.Program();
		program.programObj = this._context.createProgram();

		for (i = 0; i < shaders.length; i++) {
			this._context.attachShader(program.programObj, shaders[i]);
		}

		this._context.linkProgram(program.programObj);
		this.linkStatus = this._context.getProgramParameter(program.programObj, this._context.LINK_STATUS)
		this.linkErrors = this._context.getProgramInfoLog(program.programObj);

		if (this.linkStatus) {
			for (i = 0; i < this.symbols.length; i++) {
				symbols = this.symbols[i];
				for (j = 0; j < symbols.attributes.length; j++) {
					symbol = symbols.attributes[j];
					symbol.location = this._context.getAttribLocation(program.programObj, symbol.name);
					program.attributes.push(symbol);
				}
				for (j = 0; j < symbols.uniforms.length; j++) {
					symbol = symbols.uniforms[j];
					symbol.location = this._context.getUniformLocation(program.programObj, symbol.name);
					program.uniforms.push(symbol);
				}
			}
			this.symbols = [];
		}

		return program;
	};

	DriverWebGL.uploadAttributes = function(ctx, location, size, stride, offset, data) {
		var _ctx, buffer;
		_ctx = this._context;
		_ctx.useProgram(ctx.shader.activeProgram.program.programObj);
		buffer = _ctx.createBuffer();
		_ctx.bindBuffer(_ctx.ARRAY_BUFFER, buffer);
        _ctx.bufferData(_ctx.ARRAY_BUFFER, new Float32Array(data), _ctx.STATIC_DRAW);
		_ctx.vertexAttribPointer(location, size, _ctx.FLOAT, false, stride, offset);
		_ctx.enableVertexAttribArray(location);
	};

	DriverWebGL.uploadUniform = function(ctx, location, data, slots, components) {
		var _ctx;
		_ctx = this._context;
		_ctx.useProgram(ctx.shader.activeProgram.program.programObj);
		switch (slots * components) {
			case 16:
				_ctx.uniformMatrix4fv(location, false, new Float32Array(data));
				break;
		}
	};

	DriverWebGL.viewport = function(ctx, x, y, width, height) {		
		this._context.viewport(x, y, width, height);
	};

	return DriverWebGL.Constructor;
	
}());

