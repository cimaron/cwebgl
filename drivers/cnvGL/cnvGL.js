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

	function DriverCnvGL(canvas, config) {

		cWebGLDriver.call(this, canvas, config);

		if (this._context2d = canvas.getContext('2d', null, true)) {

			this.ready = true;
			this.width = canvas.width;
			this.height = canvas.height;

			this.colorBuffer = this._context2d.createImageData(this.width, this.height);
			this.depthBuffer = cnvgl.malloc(this.width * this.height, 1, Float32Array);
			this.stencilBuffer = cnvgl.malloc(this.width * this.height, 1, Uint8Array);

			if (!GPU.renderer) {
				GPU.renderer = new cnvgl_renderer();
			}
			this.queue = new GPU.CommandQueue(this);
			this._context = new GPU.Context();

			this.command('set', 'colorBuffer', this.colorBuffer);
			this.command('set', 'depthBuffer', this.depthBuffer);
			this.command('set', 'stencilBuffer', this.stencilBuffer);

			DriverCnvGL.animationFrameFunc = DriverCnvGL.requestAnimationFrame;
		}
		//need to add failure code
	}
	
	util.inherits(DriverCnvGL, cWebGLDriver);
	var proto = DriverCnvGL.prototype;

	DriverCnvGL.test = function() {
		return true;
	};
	
	DriverCnvGL.animationFrameQueue = [];

	DriverCnvGL.animationFrameFunc = true;

	DriverCnvGL.requestAnimationFrameNative = null;
	DriverCnvGL.requestAnimationFrame = function(func, el) {
		DriverCnvGL.animationFrameQueue.push(func);
	};
	DriverCnvGL.requestAnimationFrameWrapper = function(func, el) {
		DriverCnvGL.animationFrameFunc.call(window, func, el);
	};

	DriverCnvGL.setupRequestAnimationFrame = function() {
		DriverCnvGL.requestAnimationFrameNative =
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(func, el) {
				window.setTimeout(el, 1000 / 60);
			};

		DriverCnvGL.animationFrameFunc = DriverCnvGL.requestAnimationFrameNative;
		window.requestAnimationFrame = DriverCnvGL.requestAnimationFrameWrapper;
	};

	DriverCnvGL.frameComplete = function() {
		var list;
		list = DriverCnvGL.animationFrameQueue;
		while (list.length > 0) {
			window.setTimeout(list.shift(), 0);
		}
	};

	DriverCnvGL.setupRequestAnimationFrame();


	
	proto.command = function() {
		var args;
		args = [].slice.call(arguments, 0);
		args.unshift(this._context);
		this.queue.enqueue(args);
	};

	proto.bindTexture = function(ctx, unit, target, tex_obj) {
		this.command('uploadTexture', unit, tex_obj);
	};

	proto.blendColor = function(ctx, r, g, b, a) {
		this.command('set', 'blendColor', [r, g, b, a]);
	};

	proto.blendFunc = function(ctx, sfactor, dfactor) {
		this.command('set', 'blendSrcA', sfactor);
		this.command('set', 'blendSrcRGB', sfactor);
		this.command('set', 'blendDestA', dfactor);
		this.command('set', 'blendDestRGB', dfactor);
	};

	proto.clear = function(ctx, color, depth, stencil, mask) {
		if (mask && cnvgl.COLOR_BUFFER_BIT) {
			this.command('set', 'clearColor', color);
		}
		if (mask && cnvgl.DEPTH_BUFFER_BIT) {
			this.command('set', 'clearDepth', depth);
		}
		if (mask && cnvgl.STENCIL_BUFFER_BIT) {
			this.command('set', 'clearStencil', stencil);
		}
		this.command('clear', mask);
	};

	proto.colorMask = function(ctx, r, g, b, a) {
		this.command('set', 'colorMask', [r, g, b, a]);
	};

	proto.compileShader = function(ctx, shader, source, type) {
		this.compileStatus = glsl.compile(source, type - cnvgl.FRAGMENT_SHADER);
		this.compileLog = glsl.errors.join("\n");

		if (this.compileStatus) {
			shader.out = glsl.output;
		}
	};

	proto.cullFace = function(ctx, mode) {
		this.command('set', 'cullFaceMode', mode);
	};

	proto.createProgram = function() {
		var program;
		program = new cWebGL.Driver.Program();
		return program;
	};

	proto.createShader = function(ctx, type) {
		return {};
	};

	proto.depthRange = function(ctx, n, f) {
		this.command('set', 'viewportN', n);
		this.command('set', 'viewportF', f);
	};

	proto.depthFunc = function(ctx, func) {
		this.command('set', 'depthFunc', func);
	};

	proto.depthMask = function(ctx, mask) {
		this.command('set', 'depthMask', mask);
	};

	proto.disableVertexAttribArray = function(ctx, index) {

	};

	proto.drawArrays = function(ctx, mode, first, count) {
		this.command('drawPrimitives', mode, first, count);
	};

	proto.drawElements = function(ctx, mode, first, count, type) {
		var buffer;
		buffer = ctx.array.elementArrayBufferObj.data;
		this.command('drawIndexedPrimitives', mode, buffer, first, count, type);
	};

	proto.enable = function(ctx, flag, v) {
		switch (flag) {
			case cnvgl.BLEND:
				this.command('set', 'blendEnabled', v);
				break;
			case cnvgl.CULL_FACE:
				this.command('set', 'cullFlag', v);
				break;
			case cnvgl.DEPTH_TEST:
				this.command('set', 'depthTest', v);
				break;
			case cnvgl.DITHER:
				break;
			case cnvgl.SCISSOR_TEST:
				this.command('set', 'scissorTest', v);
				break;
			default:
				console.log(flag);
		}
	};

	proto.enableVertexAttribArray = function(ctx, index) {

	};

	proto.flush = function(ctx, mode) {
	};

	proto.frontFace = function(ctx, mode) {
		this.command('set', 'cullFrontFace', mode);
	};

	proto.link = function(ctx, program, shaders) {
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

	proto.polygonOffset = function(ctx, factor, units) {
		this.command('set', 'polygonOffsetFactor', factor);
		this.command('set', 'polygonOffsetUnits', units);
	};

	proto.present = function() {
		this._context2d.putImageData(this.colorBuffer, 0, 0);
		DriverCnvGL.frameComplete();
	};

	proto.renderTexture = function(ctx, fb_obj, tex_obj, textarget, level, offset) {
		this.command('renderTexture', fb_obj, tex_obj, textarget, level, offset);
	};

	proto.sampleCoverage = function(ctx, value, invert) {
		this.command('set', 'mulitsampleCoverageValue', value);
		this.command('set', 'mulitsampleCoverageInvert', invert);
	};

	proto.stencilFunc = function(ctx, func, ref, mask) {
		this.command('set', 'stencilFuncFront', func);
		this.command('set', 'stencilFuncBack', func);
		this.command('set', 'stencilRefFront', ref);
		this.command('set', 'stencilRefBack', ref);
		this.command('set', 'stencilValueMaskFront', mask);
		this.command('set', 'stencilValueMaskBack', mask);
	};

	proto.stencilOp = function(ctx, sfail, dpfail, dppass) {
		this.command('set', 'stencilFailFuncBack', sfail);
		this.command('set', 'stencilFailFuncFront', sfail);
		this.command('set', 'stencilZFailFuncBack', dpfail);
		this.command('set', 'stencilZFailFuncFront', dpfail);
		this.command('set', 'stencilZPassFuncBack', dppass);
		this.command('set', 'stencilZPassFuncFront', dppass);
	};

	proto.stencilMask = function(ctx, mask) {
		this.command('set', 'stencilWriteMaskFront', mask);
		this.command('set', 'stencilWriteMaskBack', mask);
	};

	proto.scissor = function(ctx, x, y, width, height) {
		this.command('set', 'scissorX', x);
		this.command('set', 'scissorY', y);
		this.command('set', 'scissorWidth', width);
		this.command('set', 'scissorHeight', height);
	};

	proto.uploadAttributes = function(ctx, location, size, stride, pointer, data) {
		this.command('uploadAttributes', location, size, stride, pointer, data);
	};

	proto.uploadUniform = function(ctx, location, data, slots, components) {
		this.command('uploadUniforms', location, data, slots, components);
	};

	proto.useProgram = function(ctx, program) {
		this.command('uploadProgram', 'fragment', program.fragmentProgram);
		this.command('uploadProgram', 'vertex', program.vertexProgram);
	};

	proto.texImage2D = function(ctx, target, unit, tex_obj) {
	};

	proto.viewport = function(ctx, x, y, w, h) {
		this.command('set', 'viewportX', x);
		this.command('set', 'viewportY', y);
		this.command('set', 'viewportW', w);
		this.command('set', 'viewportH', h);
	};

	return DriverCnvGL;

}());


//include('drivers/cnvGL/gpu/gpu.js');

