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


GraphicsContext3D = (function() {
							  
	function Initializer() {
		//public:	
	}

	var GraphicsContext3D = jClass('GraphicsContext3D', Initializer);

	//public:
	
	GraphicsContext3D.GraphicsContext3D = function(canvas) {
		this._context = canvas.getContext('experimental-webgl', true);
	}
	
	//public:
	
	GraphicsContext3D.activeTexture = function(texture) {
		this._context.activeTexture(texture);
	}
	
	GraphicsContext3D.attachShader = function(program, shader) {
		this._context.attachShader(program, shader);
	}
	
	GraphicsContext3D.bindBuffer = function(target, buffer) {
		this._context.bindBuffer(target, buffer);
	}
	
	GraphicsContext3D.bindFramebuffer = function(type, framebuffer) {
		this._context.bindFramebuffer(type, framebuffer);
	}
	
	GraphicsContext3D.bindRenderbuffer = function(target, renderbuffer) {
		this._context.bindRenderbuffer(target, renderbuffer);
	}
	
	GraphicsContext3D.bindTexture = function(target, texture) {
		this._context.bindTexture(target, texture);
	}
	
	GraphicsContext3D.blendFunc = function(sfactor, dfactor) {
		this._context.blendFunc(sfactor, dfactor);
	}
	
	GraphicsContext3D.bufferData = function(target, data, usage) {
		this._context.bufferData(target, data, usage);
	}
	
	GraphicsContext3D.clear = function(mask) {
		this._context.clear(mask);
	}
	
	GraphicsContext3D.clearColor = function(red, green, blue, alpha) {
		this._context.clearColor(red, green, blue, alpha);
	}
	
	GraphicsContext3D.compileShader = function(shader) {
		this._context.compileShader(shader);
	}
	
	GraphicsContext3D.createBuffer = function() {
		return this._context.createBuffer();
	}
	
	GraphicsContext3D.createFramebuffer = function() {
		return this._context.createFramebuffer();
	}
	
	GraphicsContext3D.createProgram = function() {
		return this._context.createProgram();
	}
	
	GraphicsContext3D.createRenderbuffer = function() {
		return this._context.createRenderbuffer();
	}
	
	GraphicsContext3D.createShader = function(type) {
		return this._context.createShader(type);
	}
	
	GraphicsContext3D.createTexture = function() {
		return this._context.createTexture();
	}
	
	GraphicsContext3D.disable = function(cap) {
		this._context.disable(cap);
	}
	
	GraphicsContext3D.drawArrays = function(mode, first, count) {
		this._context.drawArrays(mode, first, count);	
	}
	
	GraphicsContext3D.drawElements = function(mode, count, type, offset) {
		this._context.drawElements(mode, count, type, offset);
	}
	
	GraphicsContext3D.enable = function(cap) {
		this._context.enable(cap);
	}
	
	GraphicsContext3D.enableVertexAttribArray = function(index) {
		this._context.enableVertexAttribArray(index);
	}
	
	GraphicsContext3D.framebufferRenderbuffer = function(target, attachment, renderbuffertarget, renderbuffer) {
		this._context.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer);
	}
	
	GraphicsContext3D.framebufferTexture2D = function(target, attachment, textarget, texture, level) {
		this._context.framebufferTexture2D(target, attachment, textarget, texture, level);
	}
	
	GraphicsContext3D.generateMipmap = function(target) {
		this._context.generateMipmap(target);
	}
	
	GraphicsContext3D.getAttribLocation = function(program, name) {
		return this._context.getAttribLocation(program, name);
	}
	
	GraphicsContext3D.getProgramParameter = function(program, pname) {
		return this._context.getProgramParameter(program, pname);
	}
	
	GraphicsContext3D.getShaderInfoLog = function(shader) {
		return this._context.getShaderInfoLog(shader);
	}
	
	GraphicsContext3D.getShaderParameter = function(shader, pname) {
		return this._context.getShaderParameter(shader, pname);
	}
	
	GraphicsContext3D.getUniformLocation = function(program, name) {
		return this._context.getUniformLocation(program, name);
	}
	
	GraphicsContext3D.linkProgram = function(program) {
		this._context.linkProgram(program);
	}
	
	GraphicsContext3D.pixelStorei = function(pname, param) {
		this._context.pixelStorei(pname, param);
	}
	
	GraphicsContext3D.renderbufferStorage = function(target, internalformat, width, height) {
		this._context.renderbufferStorage(target, internalformat, width, height);
	}
	
	GraphicsContext3D.shaderSource = function(shader, source) {
		this._context.shaderSource(shader, source);
	}
	
	GraphicsContext3D.texImage2D = function() {
		this._context.texImage2D.apply(this._context, arguments);
	}
	
	GraphicsContext3D.texParameteri = function(target, pname, param) {
		this._context.texParameteri(target, pname, param);
	}
	
	GraphicsContext3D.uniform1i = function(location, x) {
		this._context.uniform1i(location, x);
	}
	
	GraphicsContext3D.uniform1f = function(location, x) {
		this._context.uniform1f(location, x);
	}
	
	GraphicsContext3D.uniform3f = function(location, x, y, z) {
		this._context.uniform3f(location, x, y, z);
	}
	
	GraphicsContext3D.uniform3fv = function(location, v) {
		this._context.uniform3fv(location, v);
	}
	
	GraphicsContext3D.uniformMatrix3fv = function(location, transpose, value) {
		this._context.uniformMatrix3fv(location, transpose, value);
	}
	
	GraphicsContext3D.uniformMatrix4fv = function(location, transpose, value) {
		this._context.uniformMatrix4fv(location, transpose, value);
	}
	
	GraphicsContext3D.useProgram = function(program) {
		this._context.useProgram(program);
	}
	
	GraphicsContext3D.vertexAttribPointer = function(idx, size, type, normalized, stride, offset) {
		this._context.vertexAttribPointer(idx, size, type, normalized, stride, offset);
	}
	
	GraphicsContext3D.viewport = function(x, y, width, height) {
		this._context.viewport(x, y, width, height);
	}
	
	return GraphicsContext3D.Constructor;
	
}());

