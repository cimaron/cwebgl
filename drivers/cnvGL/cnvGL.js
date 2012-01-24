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


cWebGL.drivers.cnvGL = (function() {

	function Initializer() {
		cWebGL.Driver.Initializer.apply(this);
		
		this.queue = null;

		this.colorBuffer = null;
		this.depthBuffer = null;

		this.width = null;
		this.height = null;
		
		this._context = null;
		this._context2d = null;
	}

	var DriverCnvGL = jClass('DriverCnvGL', Initializer, cWebGL.Driver);

	//static:

	DriverCnvGL.Static.test = function() {
		return true;
	};

	//public:

	DriverCnvGL.DriverCnvGL = function(canvas, config) {
		this.Driver(canvas, config);

		if (this._context2d = canvas.getContext('2d', null, true)) {

			this.ready = true;
			this.width = canvas.width;
			this.height = canvas.height;

			this.colorBuffer = this._context2d.createImageData(this.width, this.height);
			this.depthBuffer = cnvgl.malloc(this.width * this.height, 1, Float32Array);

			if (!GPU.renderer) {
				GPU.renderer = new cnvgl_renderer();
			}
			this.queue = new GPU.CommandQueue(this);
			this._context = new GPU.Context();

			this.command('set', 'colorBuffer', this.colorBuffer);
			this.command('set', 'depthBuffer', this.depthBuffer);
		}
		//need to add failure code
	};

	DriverCnvGL.clear = function(ctx, color, depth, mask) {
		if (mask && cnvgl.COLOR_BUFFER_BIT) {
			this.command('set', 'clearColor', color);
		}
		if (mask && cnvgl.DEPTH_BUFFER_BIT) {
			this.command('set', 'clearDepth', depth);
		}
		this.command('clear', mask);
	};

	DriverCnvGL.colorMask = function(ctx, r, g, b, a) {
		this.command('set', 'colorMask', [r, g, b, a]);
	};

	DriverCnvGL.command = function() {
		var args;
		args = [].slice.call(arguments, 0);
		args.unshift(this._context);
		this.queue.enqueue(args);
	};

	DriverCnvGL.compileShader = function(source, type) {
		var shaderObj;

		this.compileStatus = glsl.compile(source, type == cnvgl.VERTEX_SHADER ? glsl.mode.vertex : glsl.mode.fragment);
		this.compileLog = glsl.errors.join("\n");

		if (this.compileStatus) {
			shaderObj = glsl.output;
		}

		return shaderObj;
	};

	DriverCnvGL.cullFace = function(ctx, mode) {
		this.command('set', 'cullFaceMode', mode);
	};

	DriverCnvGL.depthRange = function(ctx, n, f) {
		this.command('set', 'viewportN', n);
		this.command('set', 'viewportF', f);		
	};

	DriverCnvGL.drawArrays = function(ctx, mode, first, count) {
		var shaders;
		shaders = ctx.shader.activeProgram.attached_shaders;
		this.command('uploadProgram', 'fragment', shaders[1].object_code.exec);
		this.command('uploadProgram', 'vertex', shaders[0].object_code.exec);
		this.command('drawPrimitives', mode, first, count);
	};

	DriverCnvGL.drawElements = function(ctx, mode, first, count, indices) {
		var shaders;
		shaders = ctx.shader.activeProgram.attached_shaders;
		this.command('uploadProgram', 'fragment', shaders[1].object_code.exec);
		this.command('uploadProgram', 'vertex', shaders[0].object_code.exec);
		this.command('drawIndexedPrimitives', mode, first, count, indices);
	};

	DriverCnvGL.enable = function(ctx, flag, v) {
		switch (flag) {
			case cnvgl.CULL_FACE:
				this.command('set', 'cullFlag', v);
				break;
			case cnvgl.DEPTH_TEST:
				this.command('set', 'depthTest', v);
				break;
		}
	};

	DriverCnvGL.frontFace = function(ctx, mode) {
		this.command('set', 'cullFrontFace', mode);
	};

	DriverCnvGL.link = function(shaders) {
		var program, i, j, unif, varying;

		program = new cWebGL.Driver.Program();
		program.programObj = glsl.link(shaders);

		this.linkStatus = program.programObj.status;
		this.linkLog = glsl.errors.join("\n");

		if (this.linkStatus) {
			program.attributes = program.programObj.attributes.active;
			program.uniforms = program.programObj.uniforms.active;
			program.varying = program.programObj.varying.active;

			varying = new Array(GPU.shader.MAX_VARYING_VECTORS);
			for (i = 0; i < program.varying.length; i++) {
				for (j = 0; j < program.varying[i].slots; j++) {
					varying[program.varying[i].location + j] = program.varying[i].components;
				}
			}
			for (i = 0; i < varying.length; i++) {
				this.command('setArray', 'activeVarying', i, varying[i] || 0);
			}
		}

		return program;
	};

	DriverCnvGL.present = function() {
		this._context2d.putImageData(this.colorBuffer, 0, 0);
		cWebGL.frameComplete();
	};

	DriverCnvGL.uploadAttributes = function(ctx, location, size, stride, pointer, data) {
		this.command('uploadAttributes', location, size, stride, pointer, data);
	};

	DriverCnvGL.uploadUniform = function(ctx, location, data, slots, components) {
		this.command('uploadUniforms', location, data, slots, components);
	};

	DriverCnvGL.viewport = function(ctx, x, y, w, h) {
		this.command('set', 'viewportX', x);
		this.command('set', 'viewportY', y);
		this.command('set', 'viewportW', w);
		this.command('set', 'viewportH', h);
	};

	return DriverCnvGL.Constructor;

}());


include('drivers/cnvGL/gpu/gpu.js');

