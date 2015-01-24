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

(function() {

	var proto;

	var GPU = {};
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	/**
	 * Select node.js util functions
	 */
	
	var util = {};
	
	(function(exports) {
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 * prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = function(ctor, superCtor) {
	  ctor.super_ = superCtor;
	  ctor.prototype = Object.create(superCtor.prototype, {
	    constructor: {
	      value: ctor,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	};
	
	}(util));
	
	
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
	
	GPU.initialize = function() {
		this.renderer = new cnvgl_renderer();
	};
	
	
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
	
	
	function BaseBuffer(size, type) {
	
		this.size = size;
	
		this.data = new type(size);
	
		this.id = Objects.add(this);
	};
	
	
	
	/**
	 * Color Buffer Class
	 */
	function ColorBuffer(width, height) {
	
		if (!height) {
			height = 1;
		}
	
		this.width = width;
		this.height = height;
	
		BaseBuffer.apply(this, [this.width * this.height * 4, Uint8ClampedArray]);
	}
	
	util.inherits(ColorBuffer, BaseBuffer);
	
	var proto = ColorBuffer.prototype;
	
	/**
	 * Clear Buffer
	 */
	proto.clear = function(color) {
		this.rect(0, 0, this.width - 1, this.height - 1, color);	
	};
	
	/**
	 * Draw rectangle
	 */
	proto.rect = function(x1, y1, x2, y2, color) {
		var i, j, row_width, row_start, start, end, temp;
	
		if (x1 > x2) {
			temp = x2; x2 = x1; x1 = temp;
		}
	
		if (y1 > y2) {
			temp = y2; y2 = y1; y1 = temp;
		}
	
		x1 *= 4;
		x2 *= 4;
		row_width = this.width * 4;
		row_start = y1 * row_width;
	
		for (i = y1; i <= y2; i++) {
	
			start = x1 + row_start;
			end = x2 + row_start;
	
			for (j = start; j <= end; j+=4) {
				this.data[j] = color[0];	
				this.data[j + 1] = color[1];	
				this.data[j + 2] = color[2];
				this.data[j + 3] = color[3];	
			}
	
			row_start += row_width;
		}
	
	};
	
	
	
	
	
	function DepthBuffer(width, height) {
		var size;
	
		if (height) {
			size = width * height;
		} else {
			size = width;
			height = 1;
		}
	
		this.width = width;
		this.height = height;
	
		this.buffer = new Float32Array(size);
	}
	
	
	
	
	
	/**
	 * GPU Api
	 */
	GPU.createColorBuffer = function(w, h, b) {
		return new ColorBuffer(w, h, b);
	};
	
	GPU.execClearBuffer = function(buffer, color) {
		buffer.clear(color);
	};
	
	GPU.execRectangle = function(buffer, x1, y1, x2, y2, color) {
		buffer.rect(x1, y1, x2, y2, color);
	};
	
	
	
	
	
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
	
	function GpuCommandBuffer() {
		this.data = [];
		this.data.length = 4096;
	
		this.read = 0;
		this.write = 0;
	}
	
	var proto = GpuCommandBuffer.prototype;
	
	/**
	 * Add an item to the command buffer
	 *
	 * @param   object
	 */
	proto.enqueue = function(item) {
	
		this.data[this.write] = item;
	
		this.write++;
		this.write %= this.data.length;
	};
	
	/**
	 * Get an item from the command buffer, updating internal pointer
	 *
	 * @return  object
	 */
	proto.dequeue = function() {
		var item;
	
		if (this.read === this.write) {
			return null;	
		}
	
		item = this.data[this.read];
	
		this.read++;
		this.read %= this.data.length;
	
		return item;
	};
	
	/**
	 * Reset command buffer
	 */
	proto.reset = function() {
		this.read = 0;
		this.write = 0;
	};
	
	proto.process = function() {
		var time, item;
	
		time = Frame.getTimeLeft(true);
	
		while (Frame.getTimeLeft() > 0 && (CommandBuffer.read !== CommandBuffer.write)) {
			item = CommandBuffer.dequeue();
			item.func.apply(GPU, item.args);
		}
	
		Frame.callback({
			frame : Frame.getFrameTime(),
			left : Frame.getTimeLeft(),
			total : (Frame.getFrameTime() - Frame.getTimeLeft())
		});
	
		this.schedule();
	};
	
	proto.schedule = function() {
	
		var This = this;
		
		if (Frame.running) {
			Frame.getFrame.apply(window, [function() { This.process(); }]);
		}	
	};
	
	var CommandBuffer = new GpuCommandBuffer();
	
	/**
	 * GPU Api
	 */
	GPU.command = function(cmd, args) {
		CommandBuffer.enqueue({func : cmd, args : args});
	};
	
	GPU.empty = function() {
		CommandBuffer.reset();
	};
	
	
	
	
	
	
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
	
	
	(function(GPU) {
	
		GPU.Context = function() {
	
			this.activeVarying = [];
			this.blendEnabled = false;
			this.blendDestA = 0;
			this.blendDestRGB = 0;
			this.blendEquationA = cnvgl.FUNC_ADD;
			this.blendEquationRGB = cnvgl.FUNC_ADD;
			this.blendSrcA = 1;
			this.blendSrcRGB = 1;
			this.clearColor = null;
			this.clearDepth = null;
			this.clearStencil = null;
			this.colorBuffer = null;
			this.colorMask = [0xFF, 0xFF, 0xFF, 0xFF];
			this.cullFlag = false;
			this.cullFrontFace = cnvgl.CCW;
			this.cullFaceMode = cnvgl.BACK;
			this.depthBuffer = null;
			this.depthFunc = cnvgl.LESS;
			this.depthMask = cnvgl.TRUE;
			this.depthTest = null;
			this.mulitsampleCoverageValue = 1;
			this.mulitsampleCoverageInvert = false;
			this.scissorX = 0;
			this.scissorY = 0;
			this.scissorWidth = 0;
			this.scissorHeight = 0;
			this.stencilBuffer = null;
			this.stencilFuncFront = cnvgl.ALWAYS;
			this.stencilFuncBack = cnvgl.ALWAYS;
			this.stencilRefFront = 0;
			this.stencilRefBack = 0;
			this.stencilValueMaskFront = ~0;
			this.stencilValueMaskBack = ~0;
			this.stencilWriteMaskFront = ~0;
			this.stencilWriteMaskBack = ~0;
	
			/*
			this.stencilFailFuncBack
			this.stencilFailFuncFront
			this.stencilZFailFuncBack
			this.stencilZFailFuncFront
			this.stencilZPassFuncBack
			this.stencilZPassFuncFront
			*/
	
			this.viewportF = 1;
			this.viewportH = 0;
			this.viewportN = 0;
			this.viewportW = 0;
			this.viewportX = 0;
			this.viewportY = 0;
		};
	
	}(GPU));
	
	
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
	
	function Execute(cmd) {
	
		if (GPU.commands[cmd[1]]) {
			return GPU.commands[cmd[1]].apply(GPU, cmd);
		} else {
			//console.log(cmd);
		}
	}
	
	GPU.execute = Execute;
	
	GPU.commands = {};
	
	GPU.commands.set = function(ctx, cmd, name, value) {
		ctx[name] = value;
		return true;
	};
	
	GPU.commands.setArray = function(ctx, cmd, name, index, value) {
		ctx[name][index] = value;
		return true;
	};
	
	GPU.commands.clear = function(ctx, cmd, mask) {
		if (mask && cnvgl.COLOR_BUFFER_BIT) {
			cnvgl.memseta(ctx.colorBuffer, 0, ctx.clearColor, ctx.colorBuffer.size);
		}
		if (mask && cnvgl.DEPTH_BUFFER_BIT) {
			cnvgl.memset(ctx.depthBuffer, 0, ctx.clearDepth);
		}
		if (mask && cnvgl.STENCIL_BUFFER_BIT) {
			cnvgl.memset(ctx.stencilBuffer, 0, ctx.clearStencil);
		}
		return true;
	};
	
	var cache = {
		i : -1,
		data : []
	};
	
	
	GPU.commands.drawPrimitives = function(ctx, cmd, mode, first, count) {
		var start, now, vertex;
		
		start = Date.now();
		if (cache.i == -1) {
			cache.i = first;
		}
		for (; cache.i < count; cache.i++) {
			vertex = new Vertex(cache.i);
			GPU.renderer.send(ctx, mode, vertex);
	
			now = Date.now();
			if (now - start > 200) {
				//time limit is up
				cache.i++;
				return false;
			}
		}
		GPU.renderer.end(ctx, mode);
		cache.i = -1;
		return true;
	};
	
	
	GPU.commands.drawIndexedPrimitives = function(ctx, cmd, mode, indices, first, count, type) {
		var start, now, idx;
		
		start = Date.now();
		if (cache.i == -1) {
			cache.data = [];
			cache.i = first;
		}
	
		for (; cache.i < count; cache.i++) {
			
			idx = indices[first + cache.i];
	
			if (cache.data[idx]) {
				vertex = cache.data[idx];
			} else {
				vertex = new Vertex(idx);
				cache.data[idx] = vertex;
			}
	
			GPU.renderer.send(ctx, mode, vertex);
	
			now = Date.now();
			if (now - start > 200) {
				//time limit is up
				cache.i++;
				return false;
			}
		}
	
		GPU.renderer.end(ctx, mode);
		cache.i = -1;
		return true;
	};
		
	GPU.commands.uploadProgram = function(ctx, cmd, data) {
		GPU.uploadShaders(ctx, data);
		return true;
	};
	
	GPU.commands.uploadAttributes = function(ctx, cmd, location, size, stride, si, data) {
		var ds, i, c, dest;
	
		ds = Math.ceil((data.length - si) / (size + stride)) * 4;
		dest = cnvgl.malloc(ds, 1);
	
		GPU.memory.attributes_src[location] = {
			start : location * 4,
			size : size,
			stride : stride,
			si : si,
			data : dest
		};
		
		c = 0;
		for (i = 0; i < ds; i++) {
	
			if (c < size) {
				dest[i] = data[si];
				si++;
			} else {
				dest[i] = (c == 3) ? 1 : 0;
			}
	
			c++;
			if (c == 4) {
				si += stride;
				c = 0;
			}
		}
		return true;
	};
	
	GPU.commands.uploadTexture = function(ctx, cmd, unit, texture_obj) {
		GPU.texture.upload(unit, texture_obj);
		return true;
	};
	
	GPU.commands.uploadUniforms = function(ctx, cmd, location, data, slots, components) {
		var i, j, mem, row, s;
	
		mem = GPU.memory.uniforms;
		row = 4 * location;
		s = 0;
	
		for (i = 0; i < slots; i++) {
			for (j = 0; j < components; j++) {
				mem[row + j] = data[s++];
			}
			row += 4;
		}
	
		return true;
	};
	
	
	
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
	
	function GpuFrame() {
	
		this.start = 0;
		this.running = false;
	
		this.callback = null;
		this.getFrame = this.getAnimationFrameFunc();
	
		this.fps = 60;
	}
	
	var proto = GpuFrame.prototype;
	
	/**
	 * Get native animation frame function
	 *
	 * @return  function
	 */
	proto.getAnimationFrameFunc = function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(func) {
				window.setTimeout(func, 1000 / 60);
			};
	};
	
	proto.setFps = function(fps) {
		var old;
		
		old = this.fps;
		this.fps = fps;
		
		return old;
	};
	
	proto.getFrameTime = function() {
		return 1000 / this.fps;
	};
	
	proto.getTimeLeft = function(reset) {
		var total, now;
		
		total = this.getFrameTime();
		now = Date.now();
	
		if (reset) {
			this.start = now;
			return total;
		}
	
		return (total - (now - this.start));
	};
	
	
	var Frame = new GpuFrame();
	
	
	/**
	 * GPU Api
	 */
	 
	/**
	 * Set frames per second value
	 *
	 * @param   int   fps   Frames per second
	 *
	 * @return  int
	 */
	GPU.setFps = function(fps) {
		return Frame.setFps(fps);
	};
	
	GPU.getFps = function() {
		return Frame.fps;
	};
	
	GPU.onFrame = function(func) {
		Frame.callback = func;
	};
	
	GPU.run = function() {
		Frame.running = true;
		CommandBuffer.schedule();
	};
	
	GPU.pause = function() {
		Frame.running = false;
	};
	
	
	
	
	
	
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
	
	
	GPU.memory = {};
	
	GPU.memory.temp = null;
	GPU.memory.uniforms = null;
	GPU.memory.attributes = null;
	GPU.memory.cur_attributes = null;
	GPU.memory.varying = null;
	GPU.memory.result = null;
	
	
	
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
	
	
	function CommandQueue(driver) {
		this.commands = [];
		this.timer = null;
		this.driver = driver;
	}
	
	proto = CommandQueue.prototype;
	
	/**
	 * Enqueue a command
	 */
	proto.enqueue = function(cmd) {
		this.commands.push(cmd);
		this.schedule();
	};
	
	
	proto.process = function() {
		var command, start, now, result;
	
		this.timer = null;
		start = Date.now();
	
		while (this.commands.length > 0) {
	
			command = this.commands.shift();
			result = GPU.execute(command);
			
			if (!result) {
				this.commands.unshift(command);
				this.schedule();
				return;
			}
	
			now = Date.now();
	
			if (this.commands.length > 0 && now - start > 200) {
				this.schedule();
				return;
			}
		}
	
		this.driver.present();
	};
	
	/**
	 * Schedule the next batch
	 */
	proto.schedule = function() {
		var This;
		if (!this.timer) {
			This = this;
			this.timer = setTimeout(function() { This.process(); }, 0);
		}
	};
	
	GPU.CommandQueue = CommandQueue;
	
	
	
	
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
	
	
	var shader, result, vertex, temp, program, memory;
	var tex;
	
	shader = {
		MAX_UNIFORMS : 128,
		MAX_FRAGMENT_UNIFORM_COMPONENTS : 128,
		MAX_VERTEX_ATTRIBS : 16,
		MAX_VARYING_VECTORS : 12,
		MAX_TEMPORARIES : 12
	};
	
	GPU.executeVertex = function(){};
	GPU.executeFragment = function(){};
	
	GPU.memory.attributes_src = cnvgl.malloc(shader.MAX_VERTEX_ATTRIBS, 1);
	
	GPU.uploadShaders = function(state, prgm) {
	
		state.prgm = prgm;
	
		this.executeVertex = prgm.vertex;
		this.executeFragment = prgm.fragment;
	
		GPU.memory.uniforms = prgm.context.uniform_f32;
		GPU.memory.attributes = prgm.context.attribute_f32;
		GPU.memory.varying = prgm.context.varying_f32;
		GPU.memory.result = prgm.context.result_f32;		
	};
	
	GPU.shader = shader;
	
	//
	var tex;
	shader.setTexFunc = function(f) { tex = f; };
	
	
	
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
	
	var texture, i, j, texUnit;
	
	texture = {
		MAX_TEXTURE_COORDS : 4,
		MAX_COMBINED_TEXTURE_IMAGE_UNITS : 2
	};
	
	texUnit = [];
	for (i = 0; i < texture.MAX_COMBINED_TEXTURE_IMAGE_UNITS; i++) {
		texUnit[i] = null;
	}
	
	function tex(c, ci, src, si, sampler, target) {
		var texture, mipmap_level, img, img_w, img_h, img_d, i, u, v, a, b, i1, s, t;
		
		s = src[si];
		t = src[si + 1];
	
		target = 0;
		mipmap_level = 0;
	
		texture = texUnit[sampler];
		
		if (!texture) {
			c[ci + 0] = 0;
			c[ci + 1] = 0;
			c[ci + 2] = 0;
			c[ci + 3] = 1;
			return;
		}
		
		img = texture.images[mipmap_level];
	
		if (!img) {
			c[ci + 0] = 0;
			c[ci + 1] = 0;
			c[ci + 2] = 0;
			c[ci + 3] = 1;
			return;
		}
	
		img_w = img.width;
		img_h = img.height;
		img_d = img.data;
	
		switch (texture.min_filter) {
			case cnvgl.LINEAR:
	
				var ui, vi, u0v0, u1v0, u0v1, u1v1, ai, bi;
	
				u = (s * (img_w - 1));
				v = (t * (img_h - 1));
				ui = (u | 0); //floor(s * img.width)
				vi = (v | 0); //floor(t * img.height)
				a = u - ui;
				b = v - vi;
	
				u0v0 = (1 - a) * (1 - b);
				u1v0 =      a  * (1 - b);
				u0v1 = (1 - a) *      b ;
				u1v1 =      a  *      b ;
	
				i = (vi * img_w + ui) * 4;
				i1 = i + (img_w * 4);
	
				c[ci + 0] = u0v0 * img_d[i    ] + u1v0 * img_d[i + 4] + u0v1 * img_d[i1    ] + u1v1 * img_d[i1 + 4];
				c[ci + 1] = u0v0 * img_d[i + 1] + u1v0 * img_d[i + 5] + u0v1 * img_d[i1 + 1] + u1v1 * img_d[i1 + 5];
				c[ci + 2] = u0v0 * img_d[i + 2] + u1v0 * img_d[i + 6] + u0v1 * img_d[i1 + 2] + u1v1 * img_d[i1 + 6];
				c[ci + 3] = u0v0 * img_d[i + 3] + u1v0 * img_d[i + 7] + u0v1 * img_d[i1 + 3] + u1v1 * img_d[i1 + 7];
				
				break;
	
			case cnvgl.NEAREST:
			default:
				u = (s * img_w)|0; //floor(s * img.width)
				v = (t * img_h)|0; //floor(t * img.height)
				if (u == img_w) {
					u--;
				}
				if (v == img_h) {
					v--;
				}
				i = (v * img_w + u) * 4;
				c[ci + 0] = img_d[i];
				c[ci + 1] = img_d[i + 1];
				c[ci + 2] = img_d[i + 2];
				c[ci + 3] = img_d[i + 3];
		}
	
	}
	
	GPU.texture = texture;
	
	GPU.tex = tex;
	
	GPU.texture.upload = function(unit, texture_obj) {
		texUnit[unit] = texture_obj;
	};
	
	
	
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
	 * Clipping Renderer Class
	 */
	function cnvgl_rendering_clipping(renderer) {
	
		this.ctx = null;
		this.renderer = renderer;
	
		this.v1 = null;
		this.v2 = null;
		this.v3 = null;
	
		this.planes = [[ 1,  0,  0],
		               [-1,  0,  0],
		               [ 0,  1,  0],
		               [ 0, -1,  0],
		               [ 0,  0,  1],
		               [ 0,  0, -1]];
	}
	
	proto = cnvgl_rendering_clipping.prototype;
	
	/**
	 * Clip point
	 */
	proto.clipPoint = function(prim) {
		var p;
	
		p = prim.vertices[0];
	
		if (p.xd < -1 || p.xd > 1 ||
			p.yd < -1 || p.yd > 1 ||
			p.zd < -1 || p.zd > 1) {
			return 0;
		}
	
		return 1;
	};
	
	/**
	 * Clip line
	 */
	proto.clipLine = function(prim, clipped) {
		clipped.push(prim);
		return 1;
	};
	
	/**
	 * Clip triangle
	 */
	proto.clipTriangle = function(state, prim, clipped) {
		var i, p, nprim;
	
		//store for interpolation
		this.v1 = prim.vertices[0];
		this.v2 = prim.vertices[1];
		this.v3 = prim.vertices[2];
	
		this.renderer.interpolate.setVertices(this.v1, this.v2, this.v3);
	
		for (i = 0; i < this.planes.length; i++) {
			p = this.planes[i];
			if (!this.clipTriangleToPlane(state, prim, p[0], p[1], p[2], 1)) {
				return 0;
			}
		}
	
		//prim is now clipped, and may have extra vertices
		
		for (i = 0; i < prim.vertices.length; i+=3) {
			nprim = new Primitive();
			nprim.vertices.push(prim.vertices[i]);
			nprim.vertices.push(prim.vertices[i + 1]);
			nprim.vertices.push(prim.vertices[i + 2]);
			clipped.push(nprim);
		}
	
		return clipped.length;
	};
	
	/**
	 * Interpolate
	 */
	proto.interpolate = function(state, v1, v2, amt) {
		var int, xw, yw, vr, namt, v;
	
		int = this.renderer.interpolate;
	
		namt = 1 - amt;
	
		xw = v1.xw * namt + v2.xw * amt;
		yw = v1.yw * namt + v2.yw * amt;
	
		int.setPoint(xw, yw);
	
		vr = new Vertex();
		vr.varying = new Float32Array(v1.varying);
		vr.result = new Float32Array(v1.result);
	
		//we don't need to interpolate all values, only those used in the rest of the rendering pipeline
		vr.xw = v1.xw * namt + v2.xw * amt;
		vr.yw = v1.yw * namt + v2.yw * amt;
		vr.zw = v1.zw * namt + v2.zw * amt;
	
		vr.w = v1.w * namt + v2.w * amt;
	
		//interpolate
		//int.interpolateAttributes(this.v1, this.v2, this.v3, vr);
		int.interpolateVarying(state, this.v1, this.v2, this.v3, vr.varying);
	
		return vr;
	};
	
	/**
	 * Clip triangle to plane
	 */
	proto.clipTriangleToPlane = function(state, prim, px, py, pz, pd) {
		var v1, v2, v3, d1, d2, d3, cx, n, l;
	
		n = 0;
		l = prim.vertices.length;
	
		while (n < l) {
	
			v1 = prim.vertices[n];
			v2 = prim.vertices[n + 1];
			v3 = prim.vertices[n + 2];
	
			d1 = (v1.xd * px + v1.yd * py + v1.zd * pz);
			d2 = (v2.xd * px + v2.yd * py + v2.zd * pz);
			d3 = (v3.xd * px + v3.yd * py + v3.zd * pz);
	
			cx = (d1 <= pd ? 1 : 0) + (d2 <= pd ? 1 : 0) + (d3 <= pd ? 1 : 0);
	
			if (cx == 0) {
	
				if (n == 0 && prim.vertices.length == 3) {
					// totally clipped
					return false;
				}
	
				prim.vertices.splice(n, 3); // remove 3 elements
				l -= 3; // update length
				n -= 3; // update counter so next time around we're ok
	
			} else if (cx == 1) { // only one point unclipped, create one tri (reuse this)
	
				if (d1 <= pd) { // v1 is fine
					prim.vertices[n + 1] = this.interpolate(state, v1, v2, (pd -d1)/(d2-d1));
					prim.vertices[n + 2] = this.interpolate(state, v1, v3, (pd-d1)/(d3-d1));
				} else if (d2 <= pd) { // v2
					prim.vertices[n + 0] = this.interpolate(state, v2, v1, (pd-d2)/(d1-d2));
					prim.vertices[n + 2] = this.interpolate(state, v2, v3, (pd-d2)/(d3-d2));
				} else { // v3
					prim.vertices[n + 0] = this.interpolate(state, v3, v1, (pd-d3)/(d1-d3));
					prim.vertices[n + 1] = this.interpolate(state, v3, v2, (pd-d3)/(d2-d3));
				}
	
			} else if (cx == 2) { // two points unclipped, must make a quad (reuse this, + add one tri)
				// note that we don't increase l here, as we don't need to check this new tri
				if (d1 > pd) { // v1 is Clipped
					prim.vertices[n + 0] = this.interpolate(state, v2, v1, (pd-d2)/(d1-d2));
					prim.vertices.push(prim.vertices[n], prim.vertices[n + 2], this.interpolate(state, v3, v1, (pd-d3)/(d1-d3)));
				} else if (d2 > pd) { // v2 is Clipped
					prim.vertices[n + 1] = this.interpolate(state, v3, v2, (pd-d3)/(d2-d3));
					prim.vertices.push(prim.vertices[n], this.interpolate(state, v1, v2, (pd-d1)/(d2-d1)), prim.vertices[n + 1]);
				} else { // v3
					prim.vertices[n + 2] = this.interpolate(state, v1, v3, (pd-d1)/(d3-d1));
					prim.vertices.push(this.interpolate(state, v2, v3, (pd-d2)/(d3-d2)), prim.vertices[n + 2], prim.vertices[n + 1]);
				}
			} // otherwise 3 = unclipped
	
			n += 3;
		}
	
		return prim.vertices.length > 0;
	};
	
	
	
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
	 * Culling renderer class
	 */
	function cnvgl_rendering_culling(renderer) {
		this.renderer = renderer;
	}
	
	proto = cnvgl_rendering_culling.prototype;
	
	/**
	 * Check cull
	 */
	proto.checkCull = function(state, prim) {
		var dir;
		if (state.cullFlag) {
	
			//always cull if front and back
			if (state.cullFaceMode == cnvgl.FRONT_AND_BACK) {
				return true;	
			}
	
			dir = this.getPolygonFaceDir(prim);
			if (!(
				(dir > 0 && (state.cullFlag == cnvgl.FALSE || state.cullFaceMode == cnvgl.FRONT)) ||
				(dir < 0 && (state.cullFlag == cnvgl.FALSE || state.cullFaceMode == cnvgl.BACK)))) {
				return true;
			}
		}
		return false;
	};
	
	/**
	 * Get polygon face direction
	 */
	proto.getPolygonFaceDir = function(state, prim) {
		var dir;
		dir = prim.getDirection();
		if (state.cullFrontFace == cnvgl.CCW) {
			dir = -dir;
		}
		return dir;
	};
	
	
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
	 * Fragment Rendering Class
	 */
	function cnvgl_rendering_fragment(renderer) {
			this.renderer = renderer;
	}
	
	var proto = cnvgl_rendering_fragment.prototype;
	
	/**
	 * Load attributes into shader
	 */
	proto.loadAttributes = function(state, f) {
		var attr, i, j;
	
		for (i = 0; i < state.activeVarying.length; i++) {
			attr = state.activeVarying[i];
	
			if (attr) {
				for (j = 0; j < attr; j++) {
					GPU.memory.varying[4 * i + j] = f.attrib[4 * i + j];	
				}
			}
		}
	};
	
	/**
	 * Process fragment
	 */
	proto.process = function(state, f) {
		var i;
	
		this.loadAttributes(state, f);
		
		GPU.executeFragment();
	};
	
	/**
	 * Write fragment output
	 */
	proto.write = function(state, i, frag) {
		var c_buffer, c, result, c_mask;
	
		if (state.depthMask) {
			state.depthBuffer[i] = frag.gl_FragDepth;
		}
	
		i <<= 2;
	
		result = GPU.memory.result;
		c = frag.color;
		c[0] = result[0] * 255;
		c[1] = result[1] * 255;
		c[2] = result[2] * 255;
		c[3] = result[3] * 255;
	
		c_buffer = state.colorBuffer.data;
	
		if (state.blendEnabled) {
			this.blend(state, c, c[0], c[1], c[2], c[3], c_buffer[i], c_buffer[i + 1], c_buffer[i + 2], c_buffer[i + 3]);
		}
	
		c_mask = state.colorMask;
		c_buffer[i    ] = c_mask[0] & (c[0] + .5)|0; //round(frag.r)
		c_buffer[i + 1] = c_mask[1] & (c[1] + .5)|0; //round(frag.g)
		c_buffer[i + 2] = c_mask[2] & (c[2] + .5)|0; //round(frag.b)
		c_buffer[i + 3] = c_mask[3] & (c[3] + .5)|0; //round(frag.a)		
	};
	
	/**
	 * Blend colors
	 */
	proto.blend = function(state, color, sr, sg, sb, sa, dr, dg, db, da) {
		var state, a_sr, a_sg, a_sb, a_sa, a_dr, a_dg, a_db, a_da;
		
		switch (state.blendSrcA) {
			case cnvgl.ONE:
				a_sr = a_sg = a_sb = a_sa = (1);
				break;
			case cnvgl.ZERO:
				a_sr = a_sg = a_sb = a_sa = (0);
				break;
			case cnvgl.SRC_ALPHA:
				a_sr = a_sg = a_sb = a_sa = (sa / 255);
				break;
			case cnvgl.ONE_MINUS_SRC_ALPHA:
				a_sr = a_sg = a_sb = a_sa = (1 - (sa / 255));
				break;
			case cnvgl.DST_ALPHA:
				a_sr = a_sg = a_sb = a_sa = (da / 255);
				break;
			case cnvgl.ONE_MINUS_DST_ALPHA:
				a_sr = a_sg = a_sb = a_sa = (1 - (da / 255));
				break;
			default:
				throw new Error('Blend source ' + state.blendSrcA + ' not implemented');
		}
	
		switch (state.blendDestA) {
			case cnvgl.ONE:
				a_dr = a_dg = a_db = a_da = (1);
				break;
			case cnvgl.ZERO:
				a_dr = a_dg = a_db = a_da = (0);
				break;
			case cnvgl.SRC_ALPHA:
				a_dr = a_dg = a_db = a_da = (sa / 255);
				break;
			case cnvgl.ONE_MINUS_SRC_ALPHA:
				a_dr = a_dg = a_db = a_da = (1 - (sa / 255));
				break;
			case cnvgl.DST_ALPHA:
				a_dr = a_dg = a_db = a_da = (da / 255);
				break;
			case cnvgl.ONE_MINUS_DST_ALPHA:
				a_dr = a_dg = a_db = a_da = (1 - (da / 255));
				break;
			default:
				throw new Error('Blend source ' + state.blendSrcD + ' not implemented');					
		}
	
		switch (state.blendEquationRGB) {
			case cnvgl.FUNC_ADD:
				color[0] = (a_sr * sr) + (a_dr * dr);
				color[1] = (a_sg * sg) + (a_dg * dg);
				color[2] = (a_sb * sb) + (a_db * db);
				break;
			default:
				throw new Error('Blend function ' + state.blendEquationRGB + ' not implemented');									
		}
	
		switch (state.blendEquationA) {
			case cnvgl.FUNC_ADD:
				color[3] = (a_sa * sa) + (a_da * da);
				break;
			default:
				throw new Error('Blend function ' + state.blendEquationRGB + ' not implemented');									
		}
		
		if (color[0] > 255) { color[0] = 255; }
		if (color[1] > 255) { color[1] = 255; }
		if (color[2] > 255) { color[2] = 255; }
		if (color[3] > 255) { color[3] = 255; }
		
	};
	
	
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
	 * Interpolate Rendering Class
	 */
	function cnvgl_rendering_interpolate(renderer) {
	
		this.ctx = null;
		this.renderer = renderer;
		
		this.v1 = null;
		this.v2 = null;
		this.v3 = null;
	
		this.a = null;
		this.b = null;
		this.c = null;
		this.wa = null;
		this.wb = null;
		this.wc = null;
		this.t = {};
	
		this.attributes = null;
		this.varying = null;
	}
	
	proto = cnvgl_rendering_interpolate.prototype;
	
	
	/**
	 * Set vertices
	 */
	proto.setVertices = function(v1, v2, v3) {
	
		//this.varying = this.ctx.shader.activeProgram.varying.names;
		//this.attributes = this.ctx.shader.activeProgram.attributes.names;
	
		this.v1 = [v1.xw, v1.yw, v1.zw, v1.w];
		this.v2 = [v2.xw, v2.yw, v2.zw, v2.w];
		if (v3) {
			this.v3 = [v3.xw, v3.yw, v3.zw, v3.w];
		} else {
			this.v3 = null;	
		}
		this.precompute();
	};
	
	/*
	cnvgl_rendering_interpolate.interpolateAttributes = function(v1, v2, v3, dest) {
		var attribute, vi, vl, vs;
		for (v in this.attribute) {
			attribute = this.attribute[v];
			vl = attribute.location;
			vs = attribute.size;
			for (vi = 0; vi < attribute.slots; vi++) {
				this.interpolateTriangleVector(v1.attributes.data[vl], v2.attributes.data[vl], v3.attributes.data[vl], dest[vl], vs);
				vs -= 4;
			}
		}
	};
	*/
	
	/**
	 * 
	 */
	proto.interpolateVarying = function(state, v1, v2, v3, dest) {
		var i;
		for (i = 0; i < state.activeVarying.length; i++) {
			if (state.activeVarying[i]) {
				this.interpolateTriangleVector(v1.varying, v2.varying, v3.varying, dest, state.activeVarying[i], i * 4);
			}
		}
	};
	
	/**
	 * Precompute interpolation variables
	 */
	proto.precompute = function() {
		var x1, x2, x3, y1, y2, y3, t;
	
		x1 = this.v1[0];
		x2 = this.v2[0];
		y1 = this.v1[1];
		y2 = this.v2[1];
	
		t = {};
	
		if (this.v3) {
			x3 = this.v3[0];		
			y3 = this.v3[1];
	
			t.a = (x2 - x1);
			t.b = (x3 - x1);
			t.c = (y2 - y1);
			t.d = (y3 - y1);
			t.e = (t.c / t.a);
			t.f = (t.d + t.e * t.b);
			t.g = 1 / (t.a * t.d - t.b * t.c);  
	
			this.wa = 1 / this.v1[3];
			this.wb = 1 / this.v2[3];
			this.wc = 1 / this.v3[3];
		
		} else {
			t.a = (x2 - x1);
			t.b = (y2 - y1);
			t.c = Math.sqrt(t.a * t.a + t.b * t.b);
		}
	
		this.t = t;
	};
	
	/**
	 * Set point
	 */
	proto.setPoint = function(x, y) {
		var  x1, y1;
	
		x1 = this.v1[0];
		y1 = this.v1[1];
	
		if (this.v3) {
	
			this.b = (this.t.b * (y1 - y) + this.t.d * (x - x1)) * this.t.g;
			this.c = (this.t.a * (y - y1) - this.t.c * (x - x1)) * this.t.g;
			this.a = 1 - this.b - this.c;
	
			this.a *= this.wa;
			this.b *= this.wb;
			this.c *= this.wc;
	
			this.t.p = 1 / (this.a + this.b + this.c);
		
		} else {
	
			x = (x - x1);
			y = (y - y1);
			this.a = Math.sqrt(x * x + y * y);
			this.a = this.a / this.t.c;
			this.b = 1 - this.a;
		}
	};
	
	/**
	 * Linear interpolation
	 */
	proto.interpolateLine = function(f1, f2) {
		var i, v;
	
		//todo: do a check that we need to interpolate at all
		if (typeof f1 == 'object') {
			v = [];
			for (i = 0; i < f1.length; i++) {
				v[i] = ((this.a * f1[i]) + (this.b * f2[i])) /* * this.t.p*/;
			}
		} else {
			v = ((this.a * f1) + (this.b * f2)) /* * this.t.p*/;
		}
		return v;				
	};
	
	/**
	 * Triangle interpolation
	 */
	proto.interpolateTriangle = function(f1, f2, f3) {
		var v;
		v = ((this.a * f1) + (this.b * f2) + (this.c * f3)) * this.t.p;
		return v;
	};
	
	/**
	 * Interpolate a list
	 */
	proto.interpolateTriangleVector = function(f1, f2, f3, dest, size, start) {
		var i;
		//todo: do a check that we need to interpolate at all
		for (i = 0; i < size; i++) {
			dest[start + i] = ((this.a * f1[start + i]) + (this.b * f2[start + i]) + (this.c * f3[start + i])) * this.t.p;
		}
	};
	
	
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
	 * Primitive Rendering Class
	 */
	function cnvgl_rendering_primitive(renderer) {
	
		this.renderer = renderer;
	
		this.line = new cnvgl_rendering_primitive_line(renderer);
		this.point = new cnvgl_rendering_primitive_point(renderer);
		this.triangle = new cnvgl_rendering_primitive_triangle(renderer);
		
		this.vertices = [];
	}
	
	proto = cnvgl_rendering_primitive.prototype;
	
	/**
	 * Send a vertex
	 */
	proto.send = function(state, mode, vertex) {
		this.vertices.push(vertex);
		switch (mode) {
			case cnvgl.POINTS:
				this.points(state);
				break;
			case cnvgl.LINES:
				this.lines(state);
				break;
			case cnvgl.LINE_STRIP:
				this.lineStrip(state);
				break;
			case cnvgl.LINE_LOOP:
				this.lineLoop(state);
				break;
			case cnvgl.TRIANGLES:
				this.triangles(state);
				break;
			case cnvgl.TRIANGLE_STRIP:
				this.triangleStrip(state);
				break;
		}
	};
	
	/**
	 * Finish
	 */
	proto.end = function(state, mode) {
		switch (mode) {
			case cnvgl.LINE_LOOP:
				//swap vertices
				this.vertices.push(this.vertices.shift());
				this.lines(state);
				break;
		}
		this.vertices = [];
	};
	
	/**
	 * Render points
	 */
	proto.points = function(state) {
		var prim;
		prim = new Primitive();
		prim.vertices.push(this.vertices.shift());
		this.point.render(state, prim);
	};
	
	/**
	 * Render lines
	 */
	proto.lines = function(state) {
		var prim;
		if (this.vertices.length > 1) {
			prim = new Primitive();
			prim.vertices.push(this.vertices.shift());
			prim.vertices.push(this.vertices.shift());
			this.line.render(state, prim);
		}
	};
	
	/**
	 * Render line strip
	 */
	proto.lineStrip = function(state) {
		var prim;
		if (this.vertices.length > 1) {
			prim = new Primitive();
			prim.vertices.push(this.vertices.shift());
			prim.vertices.push(this.vertices[0]);
			this.line.render(state, prim);
		}
	};
	
	/**
	 * Render line loop
	 */
	proto.lineLoop = function(state) {
		var prim, v0;
		if (this.vertices.length < 2) {
			return;
		}
		prim = new Primitive();
		if (this.vertices.length > 2) {
			v0 = this.vertices.shift();
			prim.vertices.push(this.vertices.shift());
			prim.vertices.push(this.vertices[0]);
			this.vertices.unshift(v0);
		} else {
			prim.vertices.push(this.vertices[0]);
			prim.vertices.push(this.vertices[1]);
		}
		this.line.render(state, prim);
	};
	
	/**
	 * Render triangles
	 */
	proto.triangles = function(state) {
		var prim;
		if (this.vertices.length > 2) {
			prim = new Primitive();
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices.shift());
			this.triangle.render(state, prim);
		}
	};
	
	/**
	 * Render triangle strip
	 */
	proto.triangleStrip = function(state) {
		var prim;
		if (this.vertices.length > 2) {
			prim = new Primitive();
			prim.vertices.push(this.vertices.shift());	
			prim.vertices.push(this.vertices[0]);
			prim.vertices.push(this.vertices[1]);
			this.triangle.render(state, prim);
		}
	};
	
	
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
	 * Renderer Class
	 */
	function cnvgl_renderer() {
		this.clipping = new cnvgl_rendering_clipping(this);
		this.culling = new cnvgl_rendering_culling(this);
		this.interpolate = new cnvgl_rendering_interpolate(this);
		this.primitive = new cnvgl_rendering_primitive(this);
		this.fragment = new cnvgl_rendering_fragment(this);
		this.vertex = new cnvgl_rendering_vertex(this);
	}
	
	proto = cnvgl_renderer.prototype;
	
	/**
	 * Send a vertex
	 */
	proto.send = function(state, mode, vertex) {
		if (!vertex.processed) {
			this.vertex.process(state, vertex);
		}
		this.primitive.send(state, mode, vertex);
	};
	
	/**
	 * Finish vertex
	 */
	proto.end = function(mode) {
		this.primitive.end(mode);
	};
	
	/**
	 * Check depth
	 */
	proto.checkDepth = function(state, i, z) {
		var depth, pass;
	
		depth = state.depthBuffer[i];
	
		switch (state.depthFunc) {
			case cnvgl.NEVER:
				pass = false;
				break;
			case cnvgl.ALWAYS:
				pass = true;
				break;
			case cnvgl.LESS:
				pass = z < depth;
				break;
			case cnvgl.LEQUAL:
				pass = z <= depth;
				break;
			case cnvgl.EQUAL:
				pass = z == depth;
				break;
			case cnvgl.GREATER:
				pass = z > depth;
				break;
			case cnvgl.GEQUAL:
				pass = z >= depth;
				break;
			case cnvgl.NOTEQUAL:
				pass = z != depth;
				break;
			default:
				pass = true;
		}		
		return pass;
	};
	
	
	
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
	 * Vertex Rendering Class
	 */
	function cnvgl_rendering_vertex(renderer) {
		this.renderer = renderer;
	}
	
	proto = cnvgl_rendering_vertex.prototype;
	
	/**
	 * Load vertex attributes into shader memory
	 */
	proto.loadAttributes = function(state, n) {
		var src, attr, i, j;
		
		src = GPU.memory.attributes_src;
	
		for (i = 0; i < src.length; i++) {
	
			attr = src[i];
			
			if (!attr) {
				break;
			}
	
			for (j = 0; j < attr.size; j++) {
				GPU.memory.attributes[attr.start + j] = attr.data[n * 4 + j];
			}
		}
		
	};
	
	/**
	 * Process vertex
	 */
	proto.process = function(state, v) {
	
		this.loadAttributes(state, v.i);
	
		GPU.executeVertex();
	
		v.varying = new Float32Array(GPU.memory.varying);
		v.result = new Float32Array(GPU.memory.result);
	
		v.x = v.result[0];
		v.y = v.result[1];
		v.z = v.result[2];
		v.w = v.result[3];
	
		//set normalized coordinates
		if (v.w) {
			v.xd = v.x / v.w;
			v.yd = v.y / v.w;
			v.zd = v.z / v.w;
	
			//set window coordinates
			v.xw = state.viewportX + (state.viewportW / 2) * (1 + v.xd);
			v.yw = state.viewportY + (state.viewportH / 2) * (1 - v.yd);
			v.zw = (((state.viewportF - state.viewportN) * v.zd) + state.viewportN + state.viewportF) / 2;
		}
	};
	
	/**
	 * Sort vertices
	 */
	proto.sortVertices = function(prim) {
	
		if (prim.sorted) {
			return;
		}
	
		var ymin = 99999, yminx = 9999, yi, i, vs, vertices= [];
		vs = prim.vertices;
	
		//nothing to sort
		if (vs.length < 2) {
			return;
		}
	
		//find top vertex
		for (i = 0; i < vs.length; i++) {
			if (vs[i].yw < ymin || (vs[i].yw == ymin && vs[i].xw < yminx)) {
				ymin = vs[i].yw;
				yminx = vs[i].xw;
				yi = i;
			}
		}
	
		//reorder vertices
		for (i = 0; i < vs.length; i++) {
			vertices[i] = vs[yi];
			yi++;
			if (yi >= vs.length) {
				yi = 0;
			}
		}
	
		prim.vertices = vertices;
		prim.sorted = true;
	};
	
	/**
	 * Get slope
	 */
	proto.slope = function(x1, y1, x2, y2) {
		x1 = x2 - x1;
		y1 = y2 - y1;
		//divide by zero should return Nan
		return (x1 / y1);
	};
	
	
	
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
	 * Fragment Object Class
	 */
	function Fragment() {
		this.attrib = null;
		this.result = null;
		this.color = new Float32Array(4);
	};
	
	
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
	 * Primitive Object Class
	 */
	function Primitive() {
		this.mode = null;
		this.vertices = [];
		this.sorted = false;
		this.direction = null;
	}
	
	proto = Primitive.prototype;
	
	/**
	 * Get direction
	 */
	proto.getDirection = function() {
		var a, E, i, th, n;
	
		if (this.direction) {
			return this.direction;	
		}
	
		n = this.vertices.length;
		E = 0;
		for (i = 0; i < n; i++) {
			th = (i + 1) % n;
			E += (this.vertices[i].xw * this.vertices[th].yw - this.vertices[th].xw * this.vertices[i].yw);
		}
		E = E > 0 ? 1 : -1;
		
		this.direction = E;
	
		return this.direction;
	};
	
	
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
	 * Vertex Object Class
	 */
	function Vertex(i) {
	
		this.processed = false;
		
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.w = 0;
		
		this.xd = 0;
		this.yd = 0;
		this.zd = 0;
	
		this.xw = 0;
		this.yw = 0;
		this.zw = 0;
		
		this.xc = 0;
		this.yc = 0;
		this.zc = 0;
		
		this.i = i;
	
		//allocate memory
		this.varying = null;
		this.result = null;
	};
	
	
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
	 * Line Primitive Rendering Class
	 */
	function cnvgl_rendering_primitive_line(renderer) {
		this.renderer = renderer;
		
		this.prim = null;
		this.frag = new Fragment();
	}
	
	proto = cnvgl_rendering_primitive_line.prototype;
	
	/**
	 * Render
	 */
	proto.render = function(state, prim) {
		var clipped, num, i;
	
		clipped = [];
		num = this.renderer.clipping.clipLine(prim, clipped);
	
		for (i = 0; i < num; i++) {
			this.renderClipped(state, clipped[i]);
		}
	};
	
	/**
	 * Render clipped
	 */
	proto.renderClipped = function(state, prim) {
		var v1, v2, dx, dy, dir;
		this.prim = prim;
		v1 = prim.vertices[0];
		v2 = prim.vertices[1];
	
		dx = this.renderer.vertex.slope(v1.xw, v1.yw, v2.xw, v2.yw);
		dy = this.renderer.vertex.slope(v1.yw, v1.xw, v2.yw, v2.xw);		
		dir = Math.abs(dx) > Math.abs(dy) ? 1 : -1; //x-major = 1 : y-major = -1
	
		if (dir > 0) {
			this.lineX(state, v1, v2, dy);
		} else {
			this.lineY(state, v1, v2, dx);
		}
	};
	
	/**
	 * Render a horizontal oriented line
	 */
	proto.lineX = function(state, v1, v2, dy) {
		var frag, x_start, x_end, xi_start, xi_end, y, v, xi, yi, i;
	
		//make v1 left vertex
		if (v2.xw < v1.xw) {
			v = v2; v2 = v1; v1 = v;
		}
	
		this.renderer.interpolate.setVertices(v2, v1);
	
		x_start = v1.xw;
		x_end = v2.xw;
		xi_start = Math.ceil(x_start);
		xi_end = Math.floor(x_end);
		y = v1.yw + (xi_start - v1.xw) * dy;
	
		for (xi = xi_start; xi <= xi_end; xi++) {
	
			yi = (y|0); //floor(y)
			this.renderer.interpolate.setPoint(xi, yi);
			/*
			for (v in v1.varying) {
				this.frag.varying[v] = this.renderer.interpolate.interpolateLine(v1.varying[v], v2.varying[v]);
			}
			*/
	
			i = (state.viewportW * yi + xi);
	
			this.renderer.fragment.process(state, this.frag);
			this.renderer.fragment.write(state, i, this.frag);
	
			y += dy;
		}
	};
	
	/**
	 * Render a vertical oriented line
	 */
	proto.lineY = function(state, v1, v2, dx) {
		var frag, y_start, y_end, yi_start, yi_end, x, v, yi, xi, i;
	
		//make v1 top vertex
		if (v2.yw < v1.yw) {
			v = v2; v2 = v1; v1 = v;
			//dy = -dy;
		}
	
		this.renderer.interpolate.setVertices(v2, v1);
	
		y_start = v1.yw;
		y_end = v2.yw;
		yi_start = Math.ceil(y_start);
		yi_end = (y_end)|0; //floor(y_end)
		x = v1.xw + (yi_start - v1.yw) * dx;
	
		for (yi = yi_start; yi <= yi_end; yi++) {
	
			xi = (x|0); //floor(x)
			this.renderer.interpolate.setPoint(xi, yi);
	
			/*
			for (v in v1.varying) {
				this.frag.varying[v] = this.renderer.interpolate.interpolateLine(v1.varying[v], v2.varying[v]);
			}
			*/
	
			i = (state.viewportW * yi + xi);
	
			this.renderer.fragment.process(state, this.frag);
			this.renderer.fragment.write(state, i, this.frag);
	
			x += dx;
		}
	};
	
	
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
	 * Point Renderer Class
	 */
	function cnvgl_rendering_primitive_point(renderer) {
	
		this.renderer = renderer;
		this.frag = new Fragment();
	
		this.prim = null;
	}
	
	proto = cnvgl_rendering_primitive_point.prototype;
	
	/**
	 * Render point
	 */
	proto.render = function(state, prim) {
		var num;
	
		num = this.renderer.clipping.clipPoint(prim);
	
		if (num) {
			this.renderClipped(state, prim);
		}
	
	};
	
	/**
	 * Render clipped point
	 */
	proto.renderClipped = function(state, prim) {
		var vw, v, x, y, i;
	
		this.prim = prim;
	
		v = prim.vertices[0];
		x = Math.round(v.xw);
		y = Math.round(v.yw);
	
		vw = state.viewportW;
	
		/*
		for (i in v.varying) {
			this.frag.varying[i] = v.varying[i];
		}
		*/
	
		i = (vw * y + x);
	
		this.renderer.fragment.process(state, this.frag);
		this.renderer.fragment.write(state, i, this.frag);
	};
	
	
	
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
	 * Triangle Rendering Class
	 */
	function cnvgl_rendering_primitive_triangle(renderer) {
	
		this.renderer = renderer;
		this.frag = new Fragment();
	
		this.prim = null;
		this.v1 = null;
		this.v2 = null;
		this.v3 = null;
	}
	
	proto = cnvgl_rendering_primitive_triangle.prototype;
	
	/**
	 * Render triangle
	 */
	proto.render = function(state, prim) {
		var clipped, num, i;
	
		if (this.renderer.culling.checkCull(state, prim)) {
			return;
		}
		
		//clipping may split triangle into multiple triangles
		clipped = [];
		num = this.renderer.clipping.clipTriangle(state, prim, clipped);
	
		for (i = 0; i < num; i++) {
			this.renderClipped(state, clipped[i]);
		}
	};
	
	/**
	 * Render clipped triangle
	 */
	proto.renderClipped = function(state, prim) {
		var dir, t;
	
		this.prim = prim;
	
		//prepare (sort) vertices
		this.renderer.vertex.sortVertices(prim);
		dir = prim.getDirection();
	
		if (dir >= 0) {
			t = prim.vertices[2];
			prim.vertices[2] = prim.vertices[1];
			prim.vertices[1] = t;
		}
	
		this.rasterize(state, prim);
	};
	
	/**
	 * Rasterize triangle
	 */
	proto.rasterize = function(state, prim) {
		var v1, v2, v3, dx1, dx2, dx3, yi_start, yi_end, yi, x_start, x_end, vpass;
	
		v1 = this.v1 = prim.vertices[0];
		v2 = this.v2 = prim.vertices[1];
		v3 = this.v3 = prim.vertices[2];
	
		this.renderer.interpolate.setVertices(this.v1, this.v2, this.v3);
	
		dx1 = this.renderer.vertex.slope(v1.xw, v1.yw, v2.xw, v2.yw);
		dx2 = this.renderer.vertex.slope(v1.xw, v1.yw, v3.xw, v3.yw);
		dx3 = this.renderer.vertex.slope(v2.xw, v2.yw, v3.xw, v3.yw);
	
		//top and bottom bounds
		yi_start = (v1.yw|0) + .5; //floor(v1.yw) + .5
		if (yi_start < v1.yw) {
			yi_start++;
		}
		yi = v3.yw > v2.yw ? v3.yw : v2.yw;
		yi_end = yi + 1;
		if (yi_end >= yi) {
			yi_end--;
		}
	
		x_start = v1.xw + (yi_start - v1.yw) * dx1;
		x_end = v1.xw + (yi_start - v1.yw) * dx2;
		vpass = false;
	
		//for each horizontal scanline
		for (yi = yi_start; yi < yi_end; yi++) {
	
			//next vertex (v1, v2) -> (v2, v3)
			if (!vpass && yi > v2.yw) {
				x_start = v3.xw + (yi - v3.yw) * dx3;
				dx1 = dx3;
				vpass = true;
			}
	
			//next vertex (v1, v3) -> (v2, v3)
			if (!vpass && yi > v3.yw) {
				x_end = v3.xw + (yi - v3.yw) * dx3;
				dx2 = dx3;
				vpass = true;
			}
	
			this.rasterizeScanline(state, yi, x_start, x_end);
	
			x_start += dx1;
			x_end += dx2;
		}
	};
	
	/**
	 * Rasterize single scanline of triangle
	 */
	proto.rasterizeScanline = function(state, yi, x_start, x_end) {
		var int, xi_start, xi_end, xi, i, v;
	
		int = this.renderer.interpolate;
	
		//left and right bounds
		xi_start = (x_start|0) + .5; //floor(x_start) + .5
		if (xi_start < x_start) {
			xi_start++;	
		}
		xi_end = /*ceil*/((x_end + 1-1e-10)|0) - .5;
		if (xi_end >= x_end) {
			xi_end--;
		}
	
		i = state.viewportW * (yi - .5) + (xi_start - .5);
	
		for (xi = xi_start; xi <= xi_end; xi++) {
	
			int.setPoint(xi, yi);
	
			//Early depth test
			//Need to add check for shader writing to depth value.
			//If so, this needs to run after processing the fragment
			if (state.depthTest) {
				this.frag.gl_FragDepth = int.interpolateTriangle(this.v1.zw, this.v2.zw, this.v3.zw);
				if (!this.renderer.checkDepth(state, i, this.frag.gl_FragDepth)) {
					i++;
					continue;
				}
			}
	
			if (!this.frag.attrib) {
				this.frag.attrib = new Float32Array(this.v1.varying);
				this.frag.result = new Float32Array(this.v1.result);				
			}
			int.interpolateVarying(state, this.v1, this.v2, this.v3, this.frag.attrib);
	
			this.renderer.fragment.process(state, this.frag);
			this.renderer.fragment.write(state, i, this.frag);
	
			i++;
		}		
	};
	
	


	GPU.initialize();

	this.GPU = GPU;

}());

