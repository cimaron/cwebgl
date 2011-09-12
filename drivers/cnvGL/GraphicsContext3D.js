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
		//private:
		this.webglCtx = null;
		this.canvas = null;

		this.buffer = null;
		this.context = null;
		this.errors = [];

		this._state = {};
		this._dirty = false;
		
		this._frame = {};
		this._quality = {};
	}

	var GraphicsContext3D = new jClass('GraphicsContext3D', Initializer);
	
	//public:

	GraphicsContext3D.GraphicsContext3D = function(webglCtx) {
		var threshold, This;
		this.webglCtx = webglCtx;
		this.canvas = webglCtx.canvas;
		this.context = this.canvas.getContext('2d');

		this._quality.startThreshold = 250000;
		if (this.canvas.width * this.canvas.height > this._quality.startThreshold) {
			this._quality.factor = (this.canvas.width * this.canvas.height) / this._quality.startThreshold;
		} else {
			this._quality.factor = 1;
		}
		this.setTargetFps(2);

		this._createBuffer();

		//initialize state
		glClearColor(0, 0, 0, 255);
		glClearDepth(1.0);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		This = this;
		setInterval(function() { This._redraw(); }, 0);
	};

	//public:

	GraphicsContext3D.activeTexture = function(texture) {
		glActiveTexture(texture);
	};

	GraphicsContext3D.attachShader = function(program, shader) {
		glAttachShader(program, shader);
	};
	
	GraphicsContext3D.bindAttribLocation = function(program, index, name) {
		glBindAttribLocation(program, index, name);
	};

	GraphicsContext3D.bindBuffer = function(target, buffer) {
		glBindBuffer(target, buffer);
	};

	GraphicsContext3D.bindTexture = function(target, texture) {
		glBindTexture(target, texture);
	};

	GraphicsContext3D.blendFunc = function(sfactor, dfactor) {
		glBlendFunc(sfactor, dfactor);
	};

	GraphicsContext3D.bufferData = function(target, data, usage) {
		var size;
		if (typeof data == 'number') {
			size = data;
			data = null;
		} else {
			size = data.byteLength;	
		}
		glBufferData(target, size, data, usage);
	};

	GraphicsContext3D.bufferSubData = function(target, offset, data) {
		glBufferSubData(target, offset, data.length, data);
	};

	GraphicsContext3D.clear = function(mask) {
		this._dirty = true;
		glClear(mask);
	};

	GraphicsContext3D.clearColor = function(red, green, blue, alpha) {
		glClearColor(red, green, blue, alpha);
	};

	GraphicsContext3D.clearDepth = function(depth) {
		glClearDepth(depth);
	};

	GraphicsContext3D.compileShader = function(shader) {
		glCompileShader(shader);
	};

	GraphicsContext3D.createBuffer = function() {
		var buffers = [];
		glGenBuffers(1, buffers);	
		return buffers[0][0];
	};
	
	GraphicsContext3D.createProgram = function() {
		return glCreateProgram();
	};
	
	GraphicsContext3D.createShader = function(type) {
		return glCreateShader(type);
	};
	
	GraphicsContext3D.createTexture = function() {
		var textures = [];
		glGenTextures(1, textures);
		return textures[0][0];
	};	
	
	GraphicsContext3D.drawArrays = function(mode, first, count) {
		this._dirty = true;
		glDrawArrays(mode, first, count);
	};

	GraphicsContext3D.drawElements = function(mode, count, type, offset) {
		this._dirty = true;
		glDrawElements(mode, count, type, offset);
	};

	GraphicsContext3D.enable = function(cap) {
		glEnable(cap);
	};
	
	GraphicsContext3D.enableVertexAttribArray = function(index) {
		glEnableVertexAttribArray(index);
	};
	
	GraphicsContext3D.generateMipmap = function(target) {
		return glGetAttribLocation(program, name);
	};

	GraphicsContext3D.getAttribLocation = function(program, name) {
		return glGetAttribLocation(program, name);
	};

	GraphicsContext3D.getError = function() {
		if (this.errors.length > 0) {
			return this.errors.shift();	
		}
		return glGetError();
	};

	GraphicsContext3D.getProgramParameter = function(program, pname) {
		var params = [];
		glGetProgramiv(program, pname, params);
		return params[0];
	};
	
	GraphicsContext3D.getShaderInfoLog = function(shader) {
		var length = [], infoLog = [];
		glGetShaderInfoLog(shader, null, length, infoLog);
		return infoLog[0];
	};
	
	GraphicsContext3D.getShaderParameter = function(shader, pname) {
		var params = [];
		glGetShaderiv(shader, pname, params);
		return params[0];
	};
	
	GraphicsContext3D.getUniformLocation = function(program, name) {
		return glGetUniformLocation(program, name);
	};
	
	GraphicsContext3D.linkProgram = function(program) {
		glLinkProgram(program);
	};
	
	GraphicsContext3D.pixelStorei = function(pname, param) {
		switch (pname) {
			case 0x9240:
				this._state.UNPACK_FLIP_Y_WEBGL = pname;
				break;
			default:
				glPixelStorei(pname, param);
		}
	};

	GraphicsContext3D.shaderSource = function(shader, string) {
		glShaderSource(shader, 1, [string], [string.length]);
	};
	
	GraphicsContext3D.uniform1i = function(location, v0) {
		return glUniform1i(location, v0);
	};

	GraphicsContext3D.uniform3f = function(location, v0, v1, v2) {
		return glUniform3f(location, v0, v1, v2);
	};

	GraphicsContext3D.uniformMatrix4fv = function(location, transpose, value) {
		return glUniformMatrix4fv(location, value.length / 16, transpose, value);
	};
	
	GraphicsContext3D.useProgram = function(program) {
		glUseProgram(program);
	};

	GraphicsContext3D.texImage2D = function(target, level, internalformat, format, type, source) {
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
		
		glTexImage2D(target, level, internalformat, width, height, border, format, type, source);
	};

	GraphicsContext3D.texParameteri = function(target, pname, param) {
		glTexParameteri(target, pname, param);
	};

	GraphicsContext3D.vertexAttribPointer = function(idx, size, type, normalized, stride, offset) {
		var pointer = [];
		glVertexAttribPointer(idx, size, type, normalized, stride, offset);
	};

	GraphicsContext3D.viewport = function(x, y, width, height) {
		x = Math.round(x / this._quality.factor);
		y = Math.round(y / this._quality.factor);
		width = Math.round(width / this._quality.factor);
		height = Math.round(height / this._quality.factor);

		glViewport(x, y, width, height);
	};

	GraphicsContext3D.setTargetFps = function(low, high) {
		this._frame.fps = 0;
		this._frame.last = [];
		this._quality.fpsLow = low;
		this._quality.fpsHigh = high ? high : 4 * low;
		this._quality.fpsLowThreshold = 0;
		this._quality.fpsHighThreshold = 0;
	};

	//private:

	GraphicsContext3D._createBuffer = function() {
		var ctx, width, height;

		ctx = cnvgl_context.getCurrentContext();

		if (this._quality.factor > 1) {
			if (!this._quality.cnv) {
				this._quality.cnv = document.createElement('canvas');
			}
			width = Math.round(this.canvas.width / this._quality.factor);
			height = Math.round(this.canvas.height / this._quality.factor);
			this.webglCtx.drawingBufferWidth = width;
			this.webglCtx.drawingBufferHeight = height;
			this._quality.cnv.width = width;
			this._quality.cnv.height = height;
			this._quality.ctx = this._quality.cnv.getContext('2d');
			this.context.mozImageSmoothingEnabled = false;
		} else {
			width = this.canvas.width;
			height = this.canvas.height;
		}

		//initialize buffers
		this.buffer = this.context.createImageData(width, height);
		ctx.color_buffer = this.buffer.data;
		ctx.depth_buffer = new Float32Array(width * height);
	};

	GraphicsContext3D._updateFrame = function() {
		var time, dur;
		//update frame counts, fps, etc.
		this._frame.count++;
		time = new Date().getTime();
		this._frame.last.push(time);

		//average over one second period
		dur = time - this._frame.last[0];
		this._frame.fps = 1000 * this._frame.last.length / dur;
		if (dur > 1000) {
			this._frame.last.shift();
		}
	};

	GraphicsContext3D._checkFps = function() {
		var change;

		if (this._frame.fps < this._quality.fpsLow) {
			this._quality.fpsLowThreshold++;
		}

		//must maintain low fps over period of one second
		if (this._quality.fpsLowThreshold > this._frame.fps) {
			this._quality.fpsLowThreshold = 0;
			change = 1 + this._quality.fpsLow / Math.max(this._frame.fps, 1) / 4;
			this._quality.factor *= change;
			this._createBuffer();
		}

		if (this._frame.fps > this._quality.fpsHigh) {
			this._quality.fpsHighThreshold++;
		}

		//must maintain high fps over period of one second
		if (this._quality.fpsHighThreshold > this._frame.fps && this._quality.factor > 1) {
			this._quality.fpsHighThreshold = 0;
			//and even then, only slowly increase the resolution
			this._quality.factor = Math.max(1, this._quality.factor / 1.1);
			this._createBuffer();
		}
	};

	GraphicsContext3D._redraw = function() {

		this._updateFrame();
		if (this._dirty) {
			this._dirty = false;

			if (this._quality.factor <= 1) {
				this.context.putImageData(this.buffer, 0, 0);
			} else {
				this._quality.ctx.putImageData(this.buffer, 0, 0);
				this.context.drawImage(this._quality.cnv, 0, 0, this.canvas.width, this.canvas.height);
			}
		}

		this._checkFps();

	};
	
	return GraphicsContext3D.Constructor;

}());

