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
	
	DriverCnvGL.Static.animationFrameQueue = [];

	DriverCnvGL.Static.animationFrameFunc = true;

	DriverCnvGL.Static.requestAnimationFrameNative = null;
	DriverCnvGL.Static.requestAnimationFrame = function(func, el) {
		DriverCnvGL.Static.animationFrameQueue.push(func);
	};
	DriverCnvGL.Static.requestAnimationFrameWrapper = function(func, el) {
		DriverCnvGL.Static.animationFrameFunc.call(window, func, el);
	};

	DriverCnvGL.Static.setupRequestAnimationFrame = function() {
		DriverCnvGL.Static.requestAnimationFrameNative =
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(func, el) {
				window.setTimeout(el, 1000 / 60);
			};

		DriverCnvGL.Static.animationFrameFunc = DriverCnvGL.Static.requestAnimationFrameNative;
		window.requestAnimationFrame = DriverCnvGL.Static.requestAnimationFrameWrapper;
	};

	DriverCnvGL.Static.frameComplete = function() {
		var list;
		list = DriverCnvGL.Static.animationFrameQueue;
		while (list.length > 0) {
			window.setTimeout(list.shift(), 0);
		}
	};

	DriverCnvGL.Static.setupRequestAnimationFrame();


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

			DriverCnvGL.Static.animationFrameFunc = DriverCnvGL.Static.requestAnimationFrame;
		}
		//need to add failure code
	};
	
	DriverCnvGL.command = function() {
		var args;
		args = [].slice.call(arguments, 0);
		args.unshift(this._context);
		this.queue.enqueue(args);
	};

	DriverCnvGL.bindTexture = function(ctx, unit, target, tex_obj) {
		this.command('uploadTexture', unit, tex_obj);
	};

	DriverCnvGL.blendFunc = function(ctx, sfactor, dfactor) {
		this.command('set', 'blendSrcA', sfactor);
		this.command('set', 'blendSrcRGB', sfactor);
		this.command('set', 'blendDestA', dfactor);
		this.command('set', 'blendDestRGB', dfactor);
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

	DriverCnvGL.compileShader = function(ctx, shader, source, type) {
		this.compileStatus = glsl.compile(source, type - cnvgl.FRAGMENT_SHADER);
		this.compileLog = glsl.errors.join("\n");

		if (this.compileStatus) {
			shader.out = glsl.output;
		}
	};

	DriverCnvGL.cullFace = function(ctx, mode) {
		this.command('set', 'cullFaceMode', mode);
	};

	DriverCnvGL.createProgram = function() {
		var program;
		program = new cWebGL.Driver.Program();
		return program;
	};

	DriverCnvGL.createShader = function(ctx, type) {
		return {};
	};

	DriverCnvGL.depthRange = function(ctx, n, f) {
		this.command('set', 'viewportN', n);
		this.command('set', 'viewportF', f);
	};

	DriverCnvGL.depthFunc = function(ctx, func) {
		this.command('set', 'depthFunc', func);
	};

	DriverCnvGL.depthMask = function(ctx, mask) {
		this.command('set', 'depthMask', mask);
	};

	DriverCnvGL.drawArrays = function(ctx, mode, first, count) {
		this.command('drawPrimitives', mode, first, count);
	};

	DriverCnvGL.drawElements = function(ctx, mode, first, count, type) {
		var buffer;
		buffer = ctx.array.elementArrayBufferObj.data;
		this.command('drawIndexedPrimitives', mode, buffer, first, count, type);
	};

	DriverCnvGL.enable = function(ctx, flag, v) {
		switch (flag) {
			case cnvgl.CULL_FACE:
				this.command('set', 'cullFlag', v);
				break;
			case cnvgl.DEPTH_TEST:
				this.command('set', 'depthTest', v);
				break;
			case cnvgl.BLEND:
				this.command('set', 'blendEnabled', v);
				break;
			default:
				console.log(flag);
		}
	};

	DriverCnvGL.enableVertexAttribArray = function(ctx, index) {

	};

	DriverCnvGL.flush = function(ctx, mode) {
	};

	DriverCnvGL.frontFace = function(ctx, mode) {
		this.command('set', 'cullFrontFace', mode);
	};

	DriverCnvGL.link = function(ctx, program, shaders) {
		var sh, i, j, unif, varying;
		
		sh = [];
		for (i = 0; i < shaders.length; i++) {
			sh[i] = shaders[i].out;	
		}

		program.GLSL = glsl.link(sh);

		for (i = 0; i < sh.length; i++) {
			if (sh[i].target == 0) {
				program.fragmentProgram = sh[i].exec;
			} else {
				program.vertexProgram = sh[i].exec;	
			}
		}

		this.linkStatus = program.GLSL.status;
		this.linkLog = glsl.errors.join("\n");

		if (this.linkStatus) {
			program.attributes = program.GLSL.attributes.active;
			program.uniforms = program.GLSL.uniforms.active;
			program.varying = program.GLSL.varying.active;

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
	};

	DriverCnvGL.present = function() {
		this._context2d.putImageData(this.colorBuffer, 0, 0);
		DriverCnvGL.Static.frameComplete();
	};

	DriverCnvGL.renderTexture = function(ctx, fb_obj, tex_obj, textarget, level, offset) {
		this.command('renderTexture', fb_obj, tex_obj, textarget, level, offset);
	};

	DriverCnvGL.uploadAttributes = function(ctx, location, size, stride, pointer, data) {
		this.command('uploadAttributes', location, size, stride, pointer, data);
	};

	DriverCnvGL.uploadUniform = function(ctx, location, data, slots, components) {
		this.command('uploadUniforms', location, data, slots, components);
	};
	
	DriverCnvGL.useProgram = function(ctx, program) {
		this.command('uploadProgram', 'fragment', program.fragmentProgram);
		this.command('uploadProgram', 'vertex', program.vertexProgram);
	};

	DriverCnvGL.texImage2D = function(ctx, target, unit, tex_obj) {
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

