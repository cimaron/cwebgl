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
		var args, result;
		args = [].slice.call(arguments, 0);
		result = this.object.execCommands([args]);
		console.log(args[0], result);
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
		program.Stage3D = this.command('createProgram');
		return program;
	};

	DriverStage3D.createShader = function(ctx, type) {
		return {};
	};

	DriverStage3D.cullFace = function(ctx, mode) {
		this._SetCulling(ctx.polygon.cullFlag, mode);
	};

	DriverStage3D.drawArrays = function(ctx, mode, first, count) {
		this.command('drawTriangles');
		this.object.render();
	};

	DriverStage3D.enable = function(ctx, flag, v) {
		var command;
		switch (flag) {
			case cnvgl.CULL_FACE:
				this._SetCulling(v, ctx.polygon.cullFaceMode);
				break;
			case cnvgl.DEPTH_TEST:
				this._SetDepthTest(v, ctx.depth.func);
				break;
			default:
				throw new Error('not implemented yet');
				break;
		}
	};

	DriverStage3D.enableVertexAttribArray = function(ctx, index) {
	};

	DriverStage3D.link = function(shaders) {
		var program, i, j, unif, varying;

		program.programObj = glsl.link(shaders);

		this.linkStatus = program.programObj.status;
		this.linkLog = glsl.errors.join("\n");

		if (this.linkStatus) {
			program.attributes = program.programObj.attributes.active;
			program.uniforms = program.programObj.uniforms.active;
			program.varying = program.programObj.varying.active;

			varying = new Array(GPU.shader.MAX_VARYING_VECTORS);
			for (i = 0; i < program.varying.length; i++) {
				for (j = 0; j < program.varying[i].slots; j++) {
					varying[program.varying[i].location + j] = program.varying[i].components;
				}
			}
			for (i = 0; i < varying.length; i++) {
				//this.command('setArray', 'activeVarying', i, varying[i] || 0);
			}
		}

		return program;
	};

	DriverStage3D.uploadAttributes = function(ctx, location, size, stride, pointer, data) {
	};

	DriverStage3D.uploadUniform = function(ctx, location, data, slots, components) {
		this.command('setProgramConstantsFromVector', this.constants.programType.VERTEX, location, -1);
		this.command('setProgramConstantsFromVector', this.constants.programType.FRAGMENT, location, -1);
	};

	DriverStage3D.useProgram = function(ctx, program) {
		var shaders;
		shaders = ctx.shader.activeProgram.attached_shaders;
		//shaders[1].object_code.exec
		//shaders[0].object_code.exec
		this.command('upload', "mov op, va0\nmov v0, va1", "mov oc, v0");
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

	DriverStage3D._SetDepthTest = function(en, func) {
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

		this.command('setDepthTest', en ? newfunc : this.constants.compareMode.ALWAYS);
	};


	return DriverStage3D.Constructor;
	
}());

