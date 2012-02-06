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
		this.locationMap = [];
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

	DriverWebGL.bindTexture = function(ctx, unit, target, tex_obj) {
		this._context.bindTexture(target, texture);
		this._context.texParameteri(target, this._context.TEXTURE_MAG_FILTER, tex_obj.mag_filter);
		this._context.texParameteri(target, this._context.TEXTURE_MIN_FILTER, tex_obj.min_filter);
	};

	DriverWebGL.clear = function(ctx, color, depth, mask) {
		this._context.clearColor(color[0], color[1], color[2], color[3]);
		this._context.clearDepth(depth);
		this._context.clear(mask);
	};
	
	DriverWebGL.createProgram = function() {
		program = new cWebGL.Driver.Program();
		program.WebGL = this._context.createProgram();
		return program;
	};

	DriverWebGL.createShader = function(ctx, type) {
		return this._context.createShader(type);
	};

	DriverWebGL.compileShader = function(ctx, shader, source, type) {
		var shader, symbols;

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
		this._context.drawArrays(mode, first, count);
	};

	DriverWebGL.drawElements = function(ctx, mode, first, count, type) {
		this._context.drawElements(mode, count, type, first);
	};

	DriverWebGL.enable = function(ctx, cap, v) {
		if (v) {
			this._context.enable(cap);
		} else {
			this._context.disable(cap);			
		}
	};

	DriverWebGL.enableVertexAttribArray = function(ctx, index) {
		this._context.enableVertexAttribArray(index);
	};

	DriverWebGL.frontFace = function(ctx, mode) {
		this._context.frontFace(mode);
	};

	DriverWebGL.link = function(ctx, program, shaders) {
		var i, j, program, symbols, symbol, attr, unif;

		for (i = 0; i < shaders.length; i++) {
			this._context.attachShader(program.WebGL, shaders[i]);
		}

		this._context.linkProgram(program.WebGL);
		this.linkStatus = this._context.getProgramParameter(program.WebGL, this._context.LINK_STATUS)
		this.linkErrors = this._context.getProgramInfoLog(program.WebGL);

		if (this.linkStatus) {
			this.locationMap = [];
			for (i = 0; i < this.symbols.length; i++) {
				symbols = this.symbols[i];
				for (j = 0; j < symbols.attributes.length; j++) {
					symbol = symbols.attributes[j];
					symbol.location = this._context.getAttribLocation(program.WebGL, symbol.name);
					program.attributes.push(symbol);
				}
				for (j = 0; j < symbols.uniforms.length; j++) {
					symbol = symbols.uniforms[j];
					this.locationMap.push(this._context.getUniformLocation(program.WebGL, symbol.name));
					symbol.location = this.locationMap.length - 1;
					program.uniforms.push(symbol);
				}
			}
			this.symbols = [];
		}
	};
	
	DriverWebGL.texImage2D = function(ctx, target, unit, data) {
		debugger;
		//this._context.texImage2D(target, unit, this._context.RGBA, this._context.RGBA, gl.UNSIGNED_BYTE, texture.image);	
	};

	DriverWebGL.uploadAttributes = function(ctx, location, size, stride, offset, data) {
		var _ctx, buffer;
		_ctx = this._context;
		buffer = _ctx.createBuffer();
		_ctx.bindBuffer(_ctx.ARRAY_BUFFER, buffer);
        _ctx.bufferData(_ctx.ARRAY_BUFFER, new Float32Array(data), _ctx.STATIC_DRAW);
		_ctx.vertexAttribPointer(location, size, _ctx.FLOAT, false, stride, offset);
		_ctx.enableVertexAttribArray(location);
	};

	DriverWebGL.uploadUniform = function(ctx, location, data, slots, components) {
		var _ctx, loc;
		_ctx = this._context;
		loc = this.locationMap[location];
		switch (slots * components) {
			case 16:
				_ctx.uniformMatrix4fv(loc, false, new Float32Array(data));
				break;
			default:
				console.log(slots, components);
		}
	};

	DriverWebGL.useProgram = function(ctx, program) {
		this._context.useProgram(program.WebGL);
	};

	DriverWebGL.viewport = function(ctx, x, y, width, height) {		
		this._context.viewport(x, y, width, height);
	};

	return DriverWebGL.Constructor;
	
}());

