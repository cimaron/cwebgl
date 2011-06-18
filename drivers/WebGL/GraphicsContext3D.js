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
	this._context = canvas.getContext('experimental-webgl', true);
}

//public:

__GraphicsContext3D.activeTexture = function(texture) {
	this._context.activeTexture(texture);
}

__GraphicsContext3D.attachShader = function(program, shader) {
	return this._context.attachShader(program, shader);
}

__GraphicsContext3D.bindBuffer = function(type, buffer) {
	return this._context.bindBuffer(type, buffer);
}

__GraphicsContext3D.bindFramebuffer = function(type, framebuffer) {
	return this._context.bindFramebuffer(type, framebuffer);
}

__GraphicsContext3D.bindRenderbuffer = function(target, renderbuffer) {
	this._context.bindRenderbuffer(target, renderbuffer);
}

__GraphicsContext3D.bindTexture = function(target, texture) {
	this._context.bindTexture(target, texture);
}

__GraphicsContext3D.blendFunc = function(sfactor, dfactor) {
	this._context.blendFunc(sfactor, dfactor);
}

__GraphicsContext3D.bufferData = function(target, data, usage) {
	return this._context.bufferData(target, data, usage);
}

__GraphicsContext3D.clear = function(mask) {
	return this._context.clear(mask);
}

__GraphicsContext3D.clearColor = function(red, green, blue, alpha) {
	return this._context.clearColor(red, green, blue, alpha);
}

__GraphicsContext3D.compileShader = function(shader) {
	return this._context.compileShader(shader);
}

__GraphicsContext3D.createBuffer = function() {
	return this._context.createBuffer();
}

__GraphicsContext3D.createFramebuffer = function() {
	return this._context.createFramebuffer();
}

__GraphicsContext3D.createProgram = function(program) {
	return this._context.createProgram();
}

__GraphicsContext3D.createRenderbuffer = function() {
	return this._context.createRenderbuffer();
}

__GraphicsContext3D.createShader = function(type) {
	return this._context.createShader(type);
}

__GraphicsContext3D.createTexture = function() {
	return this._context.createTexture();
}

__GraphicsContext3D.disable = function(cap) {
	return this._context.disable(cap);
}

__GraphicsContext3D.drawArrays = function(mode, first, count) {
	return this._context.drawArrays(mode, first, count);	
}

__GraphicsContext3D.drawElements = function(mode, count, type, offset) {
	return this._context.drawElements(mode, count, type, offset);
}

__GraphicsContext3D.enable = function(cap) {
	return this._context.enable(cap);
}

__GraphicsContext3D.enableVertexAttribArray = function(index) {
	return this._context.enableVertexAttribArray(index);
}

__GraphicsContext3D.framebufferRenderbuffer = function(target, attachment, renderbuffertarget, renderbuffer) {
	return this._context.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer);
}

__GraphicsContext3D.framebufferTexture2D = function(target, attachment, textarget, texture, level) {
	return this._context.framebufferTexture2D(target, attachment, textarget, texture, level);
}

__GraphicsContext3D.generateMipmap = function(target) {
	return this._context.generateMipmap(target);
}

__GraphicsContext3D.getAttribLocation = function(program, name) {
	return this._context.getAttribLocation(program, name);
}

__GraphicsContext3D.getProgramParameter = function(program, pname) {
	return this._context.getProgramParameter(program, pname);
}

__GraphicsContext3D.getShaderParameter = function(shader, pname) {
	return this._context.getShaderParameter(shader, pname);
}

__GraphicsContext3D.getUniformLocation = function(program, name) {
	return this._context.getUniformLocation(program, name);
}

__GraphicsContext3D.linkProgram = function(program) {
	return this._context.linkProgram(program);
}

__GraphicsContext3D.pixelStorei = function(pname, param) {
	return this._context.pixelStorei(pname, param);
}

__GraphicsContext3D.renderbufferStorage = function(target, internalformat, width, height) {
	return this._context.renderbufferStorage(target, internalformat, width, height);
}

__GraphicsContext3D.shaderSource = function(shader, source) {
	return this._context.shaderSource(shader, source);
}

__GraphicsContext3D.texImage2D = function() {
	return this._context.texImage2D.apply(this._context, arguments);
}

__GraphicsContext3D.texParameteri = function(target, pname, param) {
	return this._context.texParameteri(target, pname, param);
}

__GraphicsContext3D.uniform1i = function(location, x) {
	return this._context.uniform1i(location, x);
}

__GraphicsContext3D.uniform1f = function(location, x) {
	return this._context.uniform1f(location, x);
}

__GraphicsContext3D.uniform3f = function(location, x, y, z) {
	return this._context.uniform3f(location, x, y, z);
}

__GraphicsContext3D.uniform3fv = function(location, v) {
	return this._context.uniform3fv(location, v);
}

__GraphicsContext3D.uniformMatrix3fv = function(location, transpose, value) {
	return this._context.uniformMatrix3fv(location, transpose, value);
}

__GraphicsContext3D.uniformMatrix4fv = function(location, transpose, value) {
	return this._context.uniformMatrix4fv(location, transpose, value);
}

__GraphicsContext3D.useProgram = function(program) {
	return this._context.useProgram(program);
}

__GraphicsContext3D.vertexAttribPointer = function(idx, size, type, normalized, stride, offset) {
	return this._context.vertexAttribPointer(idx, size, type, normalized, stride, offset);
}

__GraphicsContext3D.viewport = function(x, y, width, height) {
	return this._context.viewport(x, y, width, height);
}


