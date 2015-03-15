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


/**
 * CnvGL Driver Class
 */
function DriverCnvGL(canvas, config) {
	cWebGL.Driver.Initializer.apply(this);
	
	this.Driver(canvas, config);

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
		this._context = GPU.createContext();

		this.command('set', 'colorBuffer', this.colorBuffer);
		this.command('set', 'depthBuffer', this.depthBuffer);
		this.command('set', 'stencilBuffer', this.stencilBuffer);

		DriverCnvGL.animationFrameFunc = DriverCnvGL.requestAnimationFrame;
	}
	//need to add failure code
}

util.inherits(DriverCnvGL, cWebGL.Driver);

cWebGL.drivers.cnvGL = DriverCnvGL;


//static:

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


var proto = DriverCnvGL.prototype;

//public:

proto.command = function() {
	var args;
	args = [].slice.call(arguments, 0);
	args.unshift(this._context);
	this.queue.enqueue(args);
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

	var options, state;
	
	options = {};

	switch (type) {
		case cnvgl.FRAGMENT_SHADER:
			options.target = glsl.target.fragment;
			break;
		case cnvgl.VERTEX_SHADER:
			options.target = glsl.target.vertex;
			break;
	}

	state = glsl.compile(source, options);

	this.compileStatus = state.status;
	this.compileLog = state.errors.join("\n");

	if (this.compileStatus) {
		shader.out = state;
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

/**
 * Set depth function
 *
 * @param   object   ctx   GPU context
 * @param   int      f     Function enum
 */
proto.depthFunc = function(ctx, f) {
	var func, fns;

	fns = GPU.constants.fragment;

	switch (f) {

		case cnvgl.NEVER:
			func = fns.depthFunc_never;
			break;

		case cnvgl.ALWAYS:
			func = fns.depthFunc_always;
			break;

		case cnvgl.LESS:
			func = fns.depthFunc_less;
			break;
		
		case cnvgl.LEQUAL:
			func = fns.depthFunc_ltEqual;
			break;
		
		case cnvgl.EQUAL:
			func = fns.depthFunc_equal;
			break;
		
		case cnvgl.GREATER:
			func = fns.depthFunc_greater;
			break;

		case cnvgl.GEQUAL:
			func = fns.depthFunc_gtEqual;
			break;
		
		case cnvgl.NOTEQUAL:
			func = fns.depthFunc_nEqual;
			break;

		default:
			return;
	}		

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

	var i, code, prgm;
	
	prgm = glsl.createProgram('js');

	for (i = 0; i < shaders.length; i++) {
		code = shaders[i].out.getIR();
		prgm.addObjectCode(code, shaders[i].out.options.target);
	}

	if (prgm.errors.length) {
		this.linkStatus = false;
		this.linkLog = prgm.errors.join("\n");
		return;
	}

	this.linkStatus = true;
	this.linkLog = "";

	prgm.setTexFunction(GPU.getTexFunction());		
	prgm.build();

	/*
	var sh, j, unif, varying;
	*/

	program.exec = prgm;

	program.attributes = prgm.symbols.attribute;
	program.uniforms = prgm.symbols.uniform;
	program.varying = prgm.symbols.varying;

	var varying;
	varying = new Array(GPU.constants.program.max_varying_vectors);

	for (i in program.varying) {
		for (j = 0; j < program.varying[i].slots; j++) {
			varying[program.varying[i].pos + j] = program.varying[i].components;
		}
	}

	for (i = 0; i < varying.length; i++) {
		this.command('setArray', 'activeVarying', i, varying[i] || 0);
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
	this.command('uploadProgram', program.exec);
};


proto.viewport = function(ctx, x, y, w, h) {
	this.command('set', 'viewportX', x);
	this.command('set', 'viewportY', y);
	this.command('set', 'viewportW', w);
	this.command('set', 'viewportH', h);
};


include('external/jsgpu/gpu.js');

