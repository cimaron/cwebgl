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
include('cnvGL/objects/cnvgl_context.js');
include('cnvGL/objects/context_shared.js');


GraphicsContext3D = (function() {

	function Initializer() {
		//public:
		this.webglCtx = null;
		this.canvas = null;
		this.ctx = null;

		this.object = null;
		this.loaded = false;

		this.commands = [];
	}

	var GraphicsContext3D = jClass('GraphicsContext3DFlash', Initializer);

	//public:

	GraphicsContext3D.GraphicsContext3DFlash = function(webglCtx) {
		this.webglCtx = webglCtx;
		this.webglCtx.ready = false;

		this.canvas = webglCtx.canvas;
		this.ctx = cnvgl_context.getCurrentContext();

		var rand = new Date().getTime();
		var div = document.createElement('div');
		this.canvas.parentNode.insertBefore(div, this.canvas);
		div.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+this.canvas.width+'" height="'+this.canvas.height+'"><param name="movie" value="../../drivers/Flash/flash/bin/GraphicsContext3D.swf"><param name="allowfullscreen" value="true"><param name="allowscriptaccess" value="always"><param name="flashvars" value=""><param name="wmode" value="direct" /><param name="MovieData" value=""><embed id="webgl_'+rand+'" src="../../drivers/Flash/flash/bin/GraphicsContext3D.swf" quality="high" type="application/x-shockwave-flash" width="'+this.canvas.width+'" height="'+this.canvas.height+'" allowscriptaccess="always" wmode="direct"></embed></object>';
		if (window.ActiveXObject) {
			this.object = div.childNodes[0];
		} else {
			this.object = document.getElementById('webgl_'+rand);
		}

		this.initialize();
	};

	GraphicsContext3D.initialize = function() {	
		var This = this;
		if (!this.object.test) {
			setTimeout(function() { This.initialize(); }, 100);
			return;
		}
		this.loaded = true;
		this.webglCtx.ready = true;
		this.constants = this.object.constants();

		setInterval(function() { This._redraw(); }, 0);
	};

	GraphicsContext3D.addCommand = function(command, args) {
		args.unshift(command);
		this.commands.push(args);
	};

	GraphicsContext3D.flush = function() {
		if (!this.loaded) {
			return;
		}
		var result;
		result = this.object.execCommands(this.commands);
		this.commands = [];
		return result;
	};

	GraphicsContext3D._redraw = function() {
		if (this._dirty) {
			this.flush();
			this._dirty = false;
			this.object.render();
		}
	};

	GraphicsContext3D.clear = function(mask) {
		var r, g, b, a, d, s, m;
		r = this.ctx.color.clearColor[0];
		g = this.ctx.color.clearColor[1];
		b = this.ctx.color.clearColor[2];
		a = this.ctx.color.clearColor[3];
		d = this.ctx.depth.clear;
		s = 0;

		if (mask & GL_COLOR_BUFFER_BIT) {
			m |= this.constants.clearMask.COLOR;
		}
		if (mask & GL_DEPTH_BUFFER_BIT) {
			m |= this.constants.clearMask.DEPTH;
		}
		this._dirty = true;
		this.addCommand('clear', [r, g, b, a, d, s, m]);
	};

	GraphicsContext3D.compileShader = function(shader) {
		glCompileShader(shader);
	};

	GraphicsContext3D.createProgram = function() {
		return glCreateProgram();
	};

	GraphicsContext3D.createShader = function(type) {
		return glCreateShader(type);		
	};

	GraphicsContext3D.getShaderParameter = function(shader, pname) {
		var params = [];
		glGetShaderiv(shader, pname, params);
		return params[0];
	};

	GraphicsContext3D.shaderSource = function(shader, source) {
		glShaderSource(shader, 1, [source], [source.length]);
	};
	
	return GraphicsContext3D.Constructor;
	
}());

