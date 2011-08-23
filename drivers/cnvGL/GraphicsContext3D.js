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
		this.buffer = null;
		this.width = null;
		this.height = null;
		this.context = null;
		
		//private:
		this._scale = null;
		this._timer = null;
		this._dirty = false;
		this._tempWidth = null;
		this._tempHeight = null;
		this._tempCanvas = null;
		this._tempCanvasCtx = null;
		this._frameCount = null;
		this._checkResChange = 0;
	}

	var GraphicsContext3D = new jClass('GraphicsContext3D', Initializer);
	
	//public:
	
	GraphicsContext3D.GraphicsContext3D = function(canvas) {
		this.context = canvas.getContext('2d');

		//create our cnvGL context here;
		this.width = canvas.width;
		this.height = canvas.height;
		this._scale = 1;

		this._createBuffer();

		//initialize state
		glClearColor(0, 0, 0, 255);
		glClearDepth(1.0);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
		
		var This = this;
		setInterval(function() { This._redraw(); }, 0);
	};
	
	GraphicsContext3D._createBuffer = function() {
		var cnvgl_ctx = cnvgl_context.getCurrentContext();
		var width, height;

		if (this._scale > 1) {
			this._tempCanvas = document.createElement('canvas');
			this._tempWidth = Math.round(this.width / this._scale);
			this._tempHeight = Math.round(this.height / this._scale);
			this._tempCanvas.width = this._tempWidth;
			this._tempCanvas.height = this._tempHeight;
			this._tempCanvasCtx = this._tempCanvas.getContext('2d');
			this._tempCanvasCtx.mozImageSmoothingEnabled = false;
			
			width = this._tempWidth;
			height = this._tempHeight;
			
		} else {
			width = this.width;
			height = this.height;
		}
		
		//initialize frame buffers
		//cnvgl_state.color_buffer = new Uint8Array(this.width * this.height * 4);
		this.buffer = this.context.createImageData(width, height);

		cnvgl_ctx.color_buffer = this.buffer.data;

		if (Float32Array.native) {
			cnvgl_ctx.depth_buffer = new Float32Array(width * height);
		} else {
			cnvgl_ctx.depth_buffer = new Array(width * height);
		}		
	};
	
	//public:
	
	GraphicsContext3D.attachShader = function(program, shader) {
		glAttachShader(program, shader);
	};
	
	GraphicsContext3D.bindBuffer = function(target, buffer) {
		glBindBuffer(target, buffer);
	};
	
	GraphicsContext3D.bufferData = function(target, data, usage) {
		/*
		if (typeof data == 'number') {
		}
		*/
		glBufferData(target, data.length, data, usage);			 
	};
	
	GraphicsContext3D.clear = function(mask) {
		glClear(mask);
		this._dirty = true;
	};

	GraphicsContext3D.clearColor = function(red, green, blue, alpha) {
		glClearColor(red, green, blue, alpha);
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
	
	GraphicsContext3D.drawArrays = function(mode, first, count) {
		glDrawArrays(mode, first, count);
		this._dirty = true;
	};

	GraphicsContext3D.enable = function(cap) {
		glEnable(cap);
	};
	
	GraphicsContext3D.enableVertexAttribArray = function(index) {
		glEnableVertexAttribArray(index);
	};
	
	GraphicsContext3D.getAttribLocation = function(program, name) {
		return glGetAttribLocation(program, name);
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
	
	GraphicsContext3D.shaderSource = function(shader, string) {
		glShaderSource(shader, 1, [string], [string.length]);
	};
	
	GraphicsContext3D.uniformMatrix4fv = function(location, transpose, value) {
		return glUniformMatrix4fv(location, value.length / 16, transpose, value);
	};
	
	GraphicsContext3D.useProgram = function(program) {
		glUseProgram(program);
	};
	
	GraphicsContext3D.vertexAttribPointer = function(idx, size, type, normalized, stride, offset) {
		var pointer = [];
		glVertexAttribPointer(idx, size, type, normalized, stride, offset);
	};

	GraphicsContext3D.viewport = function(x, y, width, height) {
		glViewport(x / this._scale, y / this._scale, width / this._scale, height / this._scale);
	};

	//private:
	GraphicsContext3D._redraw = function() {
		if (this._dirty) {
			this._frameCount++;
			this._dirty = false;

			if (this._scale == 1) {
				this.context.putImageData(this.buffer, 0, 0);
			} else {
				this._tempCanvasCtx.putImageData(this.buffer, 0, 0);
				this.context.drawImage(this._tempCanvas, 0, 0, this.width, this.height);
			}

			//automatically adjust resolution for next frame
			var time, dur;
			time = new Date().getTime();
			if (this._time) {
				dur = time - this._time;
			}
			this._time = time;

			if (dur > 500 && this._scale < 8) {
				this._checkResChange--;
			} else {
				if (dur < 50 && this._scale > 1) {
					this._checkResChange++;
				} else {
					this._checkResChange = 0;
				}
			}

			if (this._checkResChange < -2) {
				this._scale *= 2;
				this._createBuffer();				
			}

			if (this._checkResChange > 10) {
				this._scale /= 2;
				this._createBuffer();
				this._checkResChange = 0;
			}
		}
	};
	
	return GraphicsContext3D.Constructor;

}());

