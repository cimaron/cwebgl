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


//----------------------------------------------------------------------------------------
//	class GraphicsContext3D
//----------------------------------------------------------------------------------------

function GraphicsContext3D(canvas) {
	
	//members

	//Call constructor
	this.construct(canvas);
}

//----------------------------------------------------------------------------------------
//	Class Magic
//----------------------------------------------------------------------------------------

__GraphicsContext3D = new pClass;
GraphicsContext3D.prototype = __GraphicsContext3D;

//----------------------------------------------------------------------------------------
//	Methods
//----------------------------------------------------------------------------------------

__GraphicsContext3D.GraphicsContext3D = function(canvas) {
	this.context = canvas.getContext('2d');

	//create our cnvGL context here;
	this.width = canvas.width;
	this.height = canvas.height;

	var cnvgl_ctx = cnvgl_context.getCurrentContext();

	//initialize frame buffers
	//cnvgl_state.color_buffer = new Uint8Array(this.width * this.height * 4);
	this.buffer = this.context.createImageData(this.width, this.height);

	cnvgl_ctx.color_buffer = this.buffer.data;
	cnvgl_ctx.depth_buffer = new Float32Array(this.width * this.height);

	//initialize state
	glClearColor(0, 0, 0, 255);
	glClearDepth(1.0);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
}

//public:

__GraphicsContext3D.attachShader = function(program, shader) {
	glAttachShader(program, shader);
}

__GraphicsContext3D.bindBuffer = function(target, buffer) {
	glBindBuffer(target, buffer);
}

__GraphicsContext3D.bufferData = function(target, data, usage) {
	if (typeof data == 'number') {
		//@todo
	}
	glBufferData(target, data.length, data, usage);			 
}

__GraphicsContext3D.clear = function(mask) {
	this.setRedraw();
	glClear(mask);
}

__GraphicsContext3D.clearColor = function(red, green, blue, alpha) {
	glClearColor(red, green, blue, alpha);
}

__GraphicsContext3D.compileShader = function(shader) {
	glCompileShader(shader);
}

__GraphicsContext3D.createBuffer = function() {
	var buffers = [];
	glGenBuffers(1, buffers);	
	return buffers[0][0];
}

__GraphicsContext3D.createProgram = function() {
	return glCreateProgram();
}

__GraphicsContext3D.createShader = function(type) {
	return glCreateShader(type);
}

__GraphicsContext3D.drawArrays = function(mode, first, count) {
	glDrawArrays(mode, first, count);
}

__GraphicsContext3D.enable = function(cap) {
	glEnable(cap);
}

__GraphicsContext3D.enableVertexAttribArray = function(index) {
	glEnableVertexAttribArray(index);
}

__GraphicsContext3D.getAttribLocation = function(program, name) {
	return glGetAttribLocation(program, name);
}

__GraphicsContext3D.getProgramParameter = function(program, pname) {
	var params = [];
	glGetProgramiv(program, pname, params);
	return params[0];
}

__GraphicsContext3D.getShaderInfoLog = function(shader) {
	var length = [], infoLog = [];
	glGetShaderInfoLog(shader, null, length, infoLog);
	return infoLog[0];
}

__GraphicsContext3D.getShaderParameter = function(shader, pname) {
	var params = [];
	glGetShaderiv(shader, pname, params);
	return params[0];
}

__GraphicsContext3D.getUniformLocation = function(program, name) {
	return glGetUniformLocation(program, name);
}

__GraphicsContext3D.linkProgram = function(program) {
	glLinkProgram(program);
}

__GraphicsContext3D.shaderSource = function(shader, string) {
	glShaderSource(shader, 1, [string], [string.length]);
}

__GraphicsContext3D.uniformMatrix4fv = function(location, transpose, value) {
	return glUniformMatrix4fv(location, value.length / 16, transpose, value);
}

__GraphicsContext3D.useProgram = function(program) {
	glUseProgram(program);
}

__GraphicsContext3D.vertexAttribPointer = function(idx, size, type, normalized, stride, offset) {
	var pointer = [];
	glVertexAttribPointer(idx, size, type, normalized, stride, offset);
}

__GraphicsContext3D.viewport = function(x, y, width, height) {
	glViewport(x, y, width, height);
}

//private:
__GraphicsContext3D.setRedraw = function() {
	this.redrawing = true;
	var This = this;
	setTimeout(function() { This.redraw(); }, 0);
}

__GraphicsContext3D.redraw = function() {
	if (this.redrawing) {
		this.context.putImageData(this.buffer, 0, 0);
		this.redrawing = false;
	}
}