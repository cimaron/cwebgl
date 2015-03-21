/*
Copyright (c) 2014 Cimaron Shanahan

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
 * Interface WebGLRenderingContextBase
 */
function cWebGLRenderingContextBase() {
}

var proto = cWebGLRenderingContextBase.prototype;

/**
 * activeTexture
 */
proto.activeTexture = function(texture) {
	cnvgl.setContext(this._context);
	cnvgl.activeTexture(texture);
};

/**
 * attachShader
 */
proto.attachShader = function(program, shader) {
	cnvgl.setContext(this._context);
	cnvgl.attachShader(program.object(), shader.object());
};

/**
 * bindAttribLocation
 */
proto.bindAttribLocation = function(program, index, name) {
	cnvgl.setContext(this._context);
	cnvgl.bindAttribLocation(program.object(), index, name);
};

/**
 * bindBuffer
 */
proto.bindBuffer = function(target, buffer) {
	
	if (buffer && buffer.target && buffer.target != target) {
		this.addError(this.INVALID_OPERATION);
		return;
	}
	if (target != this.ARRAY_BUFFER && target != this.ELEMENT_ARRAY_BUFFER) {
		this.addError(this.INVALID_OPERATION);
		return;
	}

	cnvgl.setContext(this._context);
	cnvgl.bindBuffer(target, buffer ? buffer.object() : 0);

	if (buffer) {
		buffer.target = target;
	}
};

/**
 * bindFramebuffer
 */
proto.bindFramebuffer = function(target, framebuffer) {		
	var _framebuffer = (framebuffer && framebuffer.object) ? framebuffer.object() : framebuffer;
	cnvgl.setContext(this._context);
	cnvgl.bindFramebuffer(target, _framebuffer);
};

/**
 * bindRenderbuffer
 */
proto.bindRenderbuffer = function(target, renderbuffer) {
	var _renderbuffer = (renderbuffer && renderbuffer.object) ? renderbuffer.object() : renderbuffer;	
	cnvgl.setContext(this._context);
	cnvgl.bindRenderbuffer(target, _renderbuffer);
};

/**
 * bindTexture
 */
proto.bindTexture = function(target, texture) {
	var _texture = (texture && texture.object) ? texture.object() : texture;
	cnvgl.setContext(this._context);
	cnvgl.bindTexture(target, _texture);
};

/**
 * blendColor
 */
proto.blendColor = function(red, green, blue, alpha) {
	cnvgl.setContext(this._context);
	cnvgl.blendColor(red, green, blue, alpha);
};

/**
 * blendEquation
 */
proto.blendEquation = function(mode) {
	cnvgl.setContext(this._context);
	cnvgl.blendEquation(mode);
};

/**
 * blendEquationSeparate
 */
proto.blendEquationSeparate = function(modeRGB, modeAlpha) {
	cnvgl.setContext(this._context);
	cnvgl.blendEquationSeparate(modeRGB, modeAlpha);
};

/**
 * blendFunc
 */
proto.blendFunc = function(sfactor, dfactor) {
	cnvgl.setContext(this._context);
	cnvgl.blendFunc(sfactor, dfactor);
};

/**
 * bufferData
 */
proto.bufferData = function(target, data, usage) {
	var size;
	if (typeof data == 'number') {
		size = parseInt(data);
		data = null;
	}
	if (data && data.length) {
		size = data.byteLength;
	}
	if (!size) {
		this.addError(this.INVALID_VALUE);
		return;
	}

	cnvgl.setContext(this._context);
	cnvgl.bufferData(target, size, data, usage);
};

/**
 * bufferSubData
 */
proto.bufferSubData = function(target, offset, data) {
	var size;
	size = data.byteLength;
	if (!size) {
		this.addError(this.INVALID_VALUE);
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.bufferSubData(target, offset, size, data);
};

/**
 * clear
 */
proto.clear = function(mask) {
	cnvgl.setContext(this._context);
	cnvgl.clear(mask);
};

/**
 * clearColor
 */
proto.clearColor = function(red, green, blue, alpha) {
	cnvgl.setContext(this._context);
	cnvgl.clearColor(red, green, blue, alpha);
};

/**
 * clearDepth
 */
proto.clearDepth = function(depth) {
	cnvgl.setContext(this._context);
	cnvgl.clearDepth(depth);
};

/**
 * clearStencil
 */
proto.clearStencil = function(s) {
	cnvgl.setContext(this._context);
	cnvgl.clearStencil(s);
};

/**
 * colorMask
 */
proto.colorMask = function(red, green, blue, alpha) {
	cnvgl.setContext(this._context);
	cnvgl.colorMask(red, green, blue, alpha);
};

/**
 * cullFace
 */
proto.cullFace = function(mode) {
	cnvgl.setContext(this._context);
	cnvgl.cullFace(mode);
};

/**
 * compileShader
 */
proto.compileShader = function(shader) {
	var shaderObj, shaderSrc;

	shaderObj = shader.object();
	shaderSrc = shader.getSource();

	cnvgl.setContext(this._context);
	cnvgl.shaderSource(shaderObj, 1, [shaderSrc], [shaderSrc.length]);
	cnvgl.compileShader(shaderObj);
};

/**
 * createBuffer
 */
proto.createBuffer = function() {
	var o = new cWebGLBuffer(this);
	return o;
};

/**
 * createFramebuffer
 */
proto.createFramebuffer = function() {
	var o = new cWebGLFramebuffer(this);
	return o;
};

/**
 * createProgram
 */
proto.createProgram = function() {
	var o = new cWebGLProgram(this);
	return o;
};

/**
 * createRenderbuffer
 */
proto.createRenderbuffer = function() {
	var o = new cWebGLRenderbuffer(this);
	return o;
};

/**
 * createShader
 */
proto.createShader = function(type) {
	var o = new cWebGLShader(this, type);
	return o;
};

/**
 * createTexture
 */
proto.createTexture = function() {
	var o = new cWebGLTexture(this);
	return o;
};

/**
 * deleteBuffer
 */
proto.deleteBuffer = function() {
};

/**
 * deleteShader
 */
proto.deleteShader = function() {
};

/**
 * depthFunc
 */
proto.depthFunc = function(func) {
	cnvgl.setContext(this._context);
	cnvgl.depthFunc(func);
};

/**
 * depthMask
 */
proto.depthMask = function(flag) {
	cnvgl.setContext(this._context);
	cnvgl.depthMask(flag);
};

/**
 * depthRange
 */
proto.depthRange = function(zNear, zFar) {
	cnvgl.setContext(this._context);
	cnvgl.depthRange(zNear, zFar);
};

/**
 * disable
 */
proto.disable = function(cap) {
	cnvgl.setContext(this._context);
	cnvgl.disable(cap);
};

/**
 * disableVertexAttribArray
 */
proto.disableVertexAttribArray = function(index) {
	cnvgl.setContext(this._context);
	cnvgl.disableVertexAttribArray(index);
};

/**
 * drawArrays
 */
proto.drawArrays = function(mode, first, count) {
	cnvgl.setContext(this._context);
	cnvgl.drawArrays(mode, first, count);	
};

/**
 * drawElements
 */
proto.drawElements = function(mode, count, type, offset) {
	cnvgl.setContext(this._context);
	cnvgl.drawElements(mode, count, type, offset);
};

/**
 * enable
 */
proto.enable = function(cap) {
	cnvgl.setContext(this._context);
	cnvgl.enable(cap);
};

/**
 * enableVertexAttribArray
 */
proto.enableVertexAttribArray = function(index) {
	cnvgl.setContext(this._context);
	cnvgl.enableVertexAttribArray(index);
};

/**
 * flush
 */
proto.flush = function() {
	cnvgl.setContext(this._context);
	cnvgl.flush();
};

/**
 * framebufferRenderbuffer
 */
proto.framebufferRenderbuffer = function(target, attachment, renderbuffertarget, renderbuffer) {
	cnvgl.setContext(this._context);
	cnvgl.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer.object());
};

/**
 * framebufferTexture2D
 */
proto.framebufferTexture2D = function(target, attachment, textarget, texture, level) {
	cnvgl.setContext(this._context);
	cnvgl.framebufferTexture2D(target, attachment, textarget, texture.object(), level);
};

/**
 * frontFace
 */
proto.frontFace = function(mode) {
	cnvgl.setContext(this._context);
	cnvgl.frontFace(mode);
};

/**
 * generateMipmap
 */
proto.generateMipmap = function(target) {
};

/**
 * getAttribLocation
 */
proto.getAttribLocation = function(program, name) {
	cnvgl.setContext(this._context);
	return cnvgl.getAttribLocation(program.object(), name);
};

/**
 * getContextAttributes
 */
proto.getContextAttributes = function() {
	return this.attr;
};

/**
 * Get last error
 *
 * @return  int
 */
/**
 * getError
 */
proto.getError = function() {
	var err;

	if (this.error != this.NO_ERROR) {
		err = this.error;
		this.error = this.NO_ERROR;
		return err;
	}

	cnvgl.setContext(this._context);

	return cnvgl.getError();
};

/**
 * Return the value for the passed pname.
 *
 * @param   int   pname   Name
 *
 * @return  int
 */
/**
 * getParameter
 */
proto.getParameter = function(pname) {
	var ret;
	ret = [];

	cnvgl.setContext(this._context);

	switch (pname) {

		case this.MAX_FRAGMENT_UNIFORM_VECTORS:
		case this.MAX_VARYING_VECTORS:
		case this.MAX_VERTEX_ATTRIBS:
		case this.MAX_VERTEX_UNIFORM_VECTORS:

			cnvgl.getIntegerv(pname, ret);
			
			if (ret.length > 0) {
				return ret[0];
			}
			
			return null;
	}

	this.addError(this.INVALID_ENUM);

	return null;
};

/**
 * getProgramParameter
 */
proto.getProgramParameter = function(program, pname) {
	var params = [];
	cnvgl.setContext(this._context);
	cnvgl.getProgramiv(program.object(), pname, params);
	return params[0];
};

/**
 * getShaderParameter
 */
proto.getShaderParameter = function(shader, pname) {
	var params = [];
	cnvgl.setContext(this._context);
	cnvgl.getShaderiv(shader.object(), pname, params);
	return params[0];
};

/**
 * getShaderInfoLog
 */
proto.getShaderInfoLog = function(shader) {
	var length = [], infoLog = [];
	cnvgl.setContext(this._context);
	cnvgl.getShaderInfoLog(shader.object(), null, length, infoLog);
	return infoLog[0];
};

/**
 * getUniformLocation
 */
proto.getUniformLocation = function(program, name) {
	var location;
	cnvgl.setContext(this._context);
	location = cnvgl.getUniformLocation(program.object(), name);
	if (location == -1) {
		return 0;
	}
	return new cWebGLUniformLocation(program, location);
};

/**
 * hint
 */
proto.hint = function(target, mode) {
	cnvgl.setContext(this._context);
	cnvgl.hint(target, mode);
};

/**
 * lineWidth
 */
proto.lineWidth = function(width) {
	cnvgl.setContext(this._context);
	cnvgl.lineWidth(width);
};

/**
 * linkProgram
 */
proto.linkProgram = function(program) {
	cnvgl.setContext(this._context);
	cnvgl.linkProgram(program.object());
	program.increaseLinkCount();
};

/**
 * onReady
 */
proto.onReady = function(func) {
	this._readyFunc = func;
};

/**
 * pixelStorei
 */
proto.pixelStorei = function(pname, param) {
	switch (pname) {
		case this.UNPACK_FLIP_Y_WEBGL:
			this._state.UNPACK_FLIP_Y_WEBGL = pname;
			break;
		default:
			cnvgl.setContext(this._context);
			cnvgl.pixelStorei(pname, param);
	}
};

/**
 * polygonOffset
 */
proto.polygonOffset = function(factor, units) {
	cnvgl.setContext(this._context);
	cnvgl.polygonOffset(factor, units);		
};	

/**
 * renderbufferStorage
 */
proto.renderbufferStorage = function(target, internalformat, width, height) {
	cnvgl.setContext(this._context);
	cnvgl.renderbufferStorage(target, internalformat, width, height);
};

/**
 * sampleCoverage
 */
proto.sampleCoverage = function(value, invert) {
	cnvgl.setContext(this._context);
	cnvgl.sampleCoverage(value, invert);		
};

/**
 * scissor
 */
proto.scissor = function(x, y, width, height) {
	cnvgl.setContext(this._context);
	cnvgl.scissor(x, y, width, height);		
};

/**
 * shaderSource
 */
proto.shaderSource = function(shader, string) {
	shader.setSource(string);
};

/**
 * stencilFunc
 */
proto.stencilFunc = function(func, ref, mask) {
	cnvgl.setContext(this._context);
	cnvgl.stencilFunc(func, ref, mask);
};

/**
 * stencilMask
 */
proto.stencilMask = function(mask) {
	cnvgl.setContext(this._context);
	cnvgl.stencilMask(mask);
};

/**
 * stencilOp
 */
proto.stencilOp = function(fail, zfail, zpass) {
	cnvgl.setContext(this._context);
	cnvgl.stencilOp(fail, zfail, zpass);
};

/**
 * texImage2D
 */
proto.texImage2D = function(target, level, internalformat, format, type, source) {
	var width, height, border, cnv, ctx, cnv, i, j, id, is, t;

	//todo: check origin-clean flag

	if (source instanceof HTMLImageElement) {
		cnv = document.createElement('canvas');
		cnv.width = source.width;
		cnv.height = source.height;
		ctx = cnv.getContext('2d');
		ctx.drawImage(source, 0, 0, source.width, source.height);
		source = cnv;
	}

	if (source instanceof HTMLCanvasElement) {
		if (!ctx) {
			ctx = source.getContext('2d');
		}
		source = ctx.getImageData(0, 0, source.width, source.height);
	}

	if (source.data) {
		width = source.width;
		height = source.height;
		border = 0;
		source = source.data;
	} else {
		width = format;
		height = type;
		border = source;
		format = arguments[6];
		type = arguments[7];
		source = arguments[8];
		if (!source) {
			source = new Uint8Array(width * height * 4);
		}
	}

	//need to invert data rows
	if (this._state.UNPACK_FLIP_Y_WEBGL) {
		t = new Uint8Array(width * height * 4);
		for (i = 0; i < height; i++) {
			for (j = 0; j < width; j++) {
				is = ((width * i) + j) * 4;
				id = ((width * (height - i - 1)) + j) * 4;
				t[id] = source[is];
				t[id + 1] = source[is + 1];
				t[id + 2] = source[is + 2];
				t[id + 3] = source[is + 3];
			}
		}
		source = t;
	}

	cnvgl.setContext(this._context);
	cnvgl.texImage2D(target, level, internalformat, width, height, border, format, type, source);
};

/**
 * texParameteri
 */
proto.texParameteri = function(target, pname, param) {
	cnvgl.setContext(this._context);
	cnvgl.texParameteri(target, pname, param);
};

/**
 * uniform1f
 */
proto.uniform1f = function(location, x) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform1f(location.location(), x);
};

/**
 * uniform1i
 */
proto.uniform1i = function(location, x) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform1i(location.location(), Math.floor(x));
};

/**
 * uniform2f
 */
proto.uniform2f = function(location, x, y) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform1f(location.location(), x);
};

/**
 * uniform2i
 */
proto.uniform2i = function(location, x, y) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform1i(location.location(), x, y);
};

/**
 * uniform2u
 */
proto.uniform2u = function(location, x, y) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform1u(location.location(), x);
};

/**
 * uniform3f
 */
proto.uniform3f = function(location, x, y, z) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform3f(location.location(), x, y, z);
};

/**
 * uniform3i
 */
proto.uniform3i = function(location, x, y, z) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform3f(location.location(), x, y, z);
};

/**
 * uniform3u
 */
proto.uniform3u = function(location, x, y, z) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform3f(location.location(), x, y, z);
};

/**
 * uniform3fv
 */
proto.uniform3fv = function(location, v) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniform3fv(location.location(), v.length / 3, v);
};

/**
 * uniformMatrix3fv
 */
proto.uniformMatrix3fv = function(location, transpose, value) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniformMatrix3fv(location.location(), value.length / 9, transpose, value);
};

/**
 * uniformMatrix4fv
 */
proto.uniformMatrix4fv = function(location, transpose, value) {
	if (this.isLocationError(location)) {
		return;
	}
	cnvgl.setContext(this._context);
	cnvgl.uniformMatrix4fv(location.location(), value.length / 16, transpose, value);
};

/**
 * useProgram
 */
proto.useProgram = function(program) {
	cnvgl.setContext(this._context);
	cnvgl.useProgram(program.object());
};

/**
 * vertexAttribPointer
 */
proto.vertexAttribPointer = function(idx, size, type, normalized, stride, offset) {
	cnvgl.setContext(this._context);
	cnvgl.vertexAttribPointer(idx, size, type, normalized, stride, offset);
};

/**
 * viewport
 */
proto.viewport = function(x, y, width, height) {
	cnvgl.setContext(this._context);
	cnvgl.viewport(x, y, width, height);
};

//private:

/**
 * isLocationError
 */
proto.isLocationError = function(l) {

	if (l == null) {
		return true;
	}

	if (!(l instanceof cWebGLUniformLocation)) {
		this.addError(this.INVALID_OPERATION);
		return true;
	}

	return false;
};

/**
 * checkReady
 */
proto.checkReady = function() {
	var This;

	if (this.driver.ready && !this._initialized) {
		this.initialize();
		this._initialized = true;
	}

	if (this.driver.ready && this._readyFunc) {
		this._readyFunc(this);
	} else {
		This = this;
		setTimeout(function() { This.checkReady(); }, 10);
	}
};

/**
 * initialize
 */
proto.initialize = function() {
	cnvgl.setContext(this._context);
	cnvgl.viewport(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * isContextLost
 */
proto.isContextLost = function() {
	return false;	
};

/**
 * Add an error to the local stack iff one does not already exist either locally or in gl context
 *
 * @param   int   err
 */
/**
 * addError
 */
proto.addError = function(err) {

	if (this.error != this.NO_ERROR) {
		return;	
	}
	
	cnvgl.setContext(this._context);
	this.error = cnvgl.getError();
	
	if (this.error == this.NO_ERROR) {
		this.error = err;	
	}
};



