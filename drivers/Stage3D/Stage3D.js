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


cWebGL.drivers.Stage3D = (function() {

	function Initializer() {
		cWebGL.Driver.Initializer.apply(this);
		this.object = null;
		this.src = "../../drivers/Stage3D/actionscript/bin/cWebGL.swf?r="+(new Date().getTime());
		this.constants = null;
		this.state = {};
		this.queue = [];
		this.timer = null;
	}

	var DriverStage3D = jClass('DriverStage3D', Initializer, cWebGL.Driver);

	//static:

	DriverStage3D.Static.test = function() {
		return true;
	};

	//public:

	DriverStage3D.DriverStage3D = function(canvas, config) {
		var rand, div, This;

		this.Driver(canvas, config);

		rand = new Date().getTime();
		div = document.createElement('div');
		canvas.parentNode.insertBefore(div, canvas);
		div.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+canvas.width+'" height="'+canvas.height+'">'+
			'<param name="movie" value="'+this.src+'">'+
			'<param name="allowfullscreen" value="true">'+
			'<param name="allowscriptaccess" value="always">'+
			'<param name="flashvars" value="">'+
			'<param name="wmode" value="direct" />'+
			'<param name="MovieData" value="">'+
			'<embed id="webgl_'+rand+'" src="'+this.src+'"'+
				' quality="high" type="application/x-shockwave-flash" width="'+this.canvas.width+'"'+
				' height="'+this.canvas.height+'" allowscriptaccess="always" wmode="direct">'+
			'</embed></object>';

		if (window.ActiveXObject) {
			this.object = div.childNodes[0];
		} else {
			this.object = document.getElementById('webgl_'+rand);
		}

		this.initialize();
	};

	DriverStage3D.initialize = function() {
		var This;
		if (this.object.test) {
			this.ready = true;
			this.constants = this.object.constants();
		} else {
			This = this;
			setTimeout(function() { This.initialize(); }, 50);
		}
	};

	DriverStage3D.clear = function(ctx, color, depth, mask) {
		var newmask;
		newmask = 0;
		if (mask && cnvgl.COLOR_BUFFER_BIT) {
			newmask |= this.constants.clearMask.COLOR;
		}
		if (mask && cnvgl.DEPTH_BUFFER_BIT) {
			newmask |= this.constants.clearMask.DEPTH;
		}
		this.command('clear', color[0], color[1], color[2], color[3], depth, 0, newmask);
		this.object.render();
	};

	DriverStage3D.command = function() {
		var args, This;
		args = [].slice.call(arguments, 0);

		this.queue.push(args);
		console.log(args);

		if (!this.timer) {
			This = this;
			this.timer = setTimeout(function(){ This.flush(true); }, 0);
		}
	};

	DriverStage3D.flush = function(present) {
		var results;

		clearTimeout(this.timer);
		this.timer = null;

		if (present) {
			this.queue.push(['present']);
		}

		results = this.object.execCommands(this.queue);
		this.queue = [];

		console.log(results);
		return results.result;
	};

	DriverStage3D.compileShader = function(ctx, shader, source, type) {

		this.compileStatus = glsl.compile(source, type - cnvgl.FRAGMENT_SHADER);
		this.compileLog = glsl.errors.join("\n");

		if (this.compileStatus) {
			shader.out = glsl.output;
		}
	};

	DriverStage3D.createProgram = function(ctx) {
		var program;
		program = new cWebGL.Driver.Program();
		this.command('createProgram');
		program.Stage3D = parseInt(this.flush());
		return program;
	};

	DriverStage3D.createShader = function(ctx, type) {
		return {};
	};

	DriverStage3D.cullFace = function(ctx, mode) {
		this._SetCulling(ctx.polygon.cullFlag, mode);
	};

	DriverStage3D.drawArrays = function(ctx, mode, first, count) {
		var indices, i;
		indices = [];
		switch (mode) {
			case cnvgl.TRIANGLES:
				for (i = 0; i < count; i++) {
					indices[i] = i;
				}
				break;
			default:
				return;
		}
		this.command('drawTriangles', indices, first, indices.length / 3);
	};

	DriverStage3D.enable = function(ctx, flag, v) {
		var command;
		switch (flag) {
			case cnvgl.CULL_FACE:
				this._SetCulling(v, ctx.polygon.cullFaceMode);
				break;
			case cnvgl.DEPTH_TEST:
				this._SetDepthTest(v, ctx.depth.func, ctx.depth.mask);
				break;
			default:
				throw new Error('not implemented yet');
				break;
		}
	};

	DriverStage3D.enableVertexAttribArray = function(ctx, index) {
	};

	DriverStage3D.link = function(ctx, program, shaders) {
		var sh, i, j, unif, varying;

		sh = [];
		for (i = 0; i < shaders.length; i++) {
			sh[i] = shaders[i].out;	
		}

		program.GLSL = glsl.link(sh);

		for (i = 0; i < sh.length; i++) {
			if (sh[i].target == 0) {
				program.fragmentProgram = "mov oc, fc0.xxxx"; //sh[i].exec;
			} else {
				//console.log(shaders[0].out.body.toString());
				program.vertexProgram = "mov vt0, vc5\n"+
										"m44 vt0, vc1, vt0\n"+
										"mov vt1, vc6\n"+
										"m44 vt1, vc1, vt1\n"+
										"mov vt2, vc7\n"+
										"m44 vt2, vc1, vt2\n"+
										"mov vt3, vc8\n"+
										"m44 vt3, vc1, vt3\n"+
										"mov vt4.xyz, va0.xyz\n"+
										"mov vt4.w, vc0.x\n"+
										"m44 vt5, vt0, vt4\n"+
										"mov op, vt5"; //sh[i].exec;	
			}
		}
		
		this.command('upload', program.Stage3D, program.vertexProgram, program.fragmentProgram);

		this.linkStatus = program.GLSL.status;
		this.linkLog = glsl.errors.join("\n");

		if (this.linkStatus) {
			program.attributes = program.GLSL.attributes.active;
			program.uniforms = program.GLSL.uniforms.active;
			program.varying = program.GLSL.varying.active;

			//upload constants
			for (i = 0; i < program.uniforms.length; i++) {
				unif = program.uniforms[i];
				if (unif.name.match(/^\$constant/)) {
					this.command('setProgramConstantsFromVector', this.constants.programType.VERTEX, unif.location, 1, unif.value, 0);
					this.command('setProgramConstantsFromVector', this.constants.programType.FRAGMENT, unif.location, 1, unif.value, 0);
				}
			}
		}

		return program;
	};

	DriverStage3D.uploadAttributes = function(ctx, location, size, stride, pointer, data) {
		var formats;
		formats = [
			this.constants.vertexBufferFormat.BYTES_4,
			this.constants.vertexBufferFormat.FLOAT_1,
			this.constants.vertexBufferFormat.FLOAT_2,
			this.constants.vertexBufferFormat.FLOAT_3,
			this.constants.vertexBufferFormat.FLOAT_4,
		]
		this.command('setVertexData', location, data, size, formats[size]);
	};

	DriverStage3D.uploadUniform = function(ctx, location, data, slots, components) {
		var newData;
		//need to pad each vector to 4
		newData = data;
		this.command('setProgramConstantsFromVector', this.constants.programType.VERTEX, location, slots, newData, 0);
		this.command('setProgramConstantsFromVector', this.constants.programType.FRAGMENT, location, slots, newData, 0);
	};

	DriverStage3D.useProgram = function(ctx, program) {
		var shaders;
	};

	DriverStage3D.viewport = function(ctx, x, y, w, h) {
		this.command('configureBackBuffer', w, h, 0, true);
	};

	DriverStage3D._SetCulling = function(en, mode) {
		var command, newmode;
		if (!en) {
			newmode = this.constants.triangleFace.NONE;
		} else {
			if (mode == cnvgl.FRONT) {
				newmode = this.constants.triangleFace.FRONT;
			}
			if (mode == cnvgl.BACK) {
				newmode = this.constants.triangleFace.BACK;	
			}
			if (mode == cnvgl.FRONT_AND_BACK) {
				newmode = this.constants.triangleFace.FRONT_AND_BACK;	
			}
		}
		this.command('setCulling', newmode);
	};

	DriverStage3D._SetDepthTest = function(en, func, mask) {
		var command, newfunc;
		switch (func) {
			case cnvgl.ALWAYS:
				newfunc = this.constants.compareMode.ALWAYS;
				break;
			case cnvgl.EQUAL:
				newfunc = this.constants.compareMode.EQUAL;
				break;
			case cnvgl.GREATER:
				newfunc = this.constants.compareMode.GREATER;
				break;
			case cnvgl.GREATER_EQUAL:
				newfunc = this.constants.compareMode.GREATER_EQUAL;
				break;
			case cnvgl.LESS:
				newfunc = this.constants.compareMode.LESS;
				break;
			case cnvgl.LESS_EQUAL:
				newfunc = this.constants.compareMode.LESS_EQUAL;
				break;
			case cnvgl.NEVER:
				newfunc = this.constants.compareMode.NEVER;
				break;
			case cnvgl.NOT_EQUAL:
				newfunc = this.constants.compareMode.NOT_EQUAL;
				break;
		}

		this.command('setDepthTest', mask, en ? newfunc : this.constants.compareMode.ALWAYS);
	};


	return DriverStage3D.Constructor;
	
}());

