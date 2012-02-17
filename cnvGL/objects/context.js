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

(function(cnvgl) {


	cnvgl.context = (function() {
								  
		function Initializer() {
			
			this.driver = null;
	
			//states
			this.array = {};
			this.color = {};
			this.depth = {};
			this.pack = {};
			this.polygon = {};
			this.shader = {};
			this.texture = {};
			this.unpack = {};
			this.viewport = {};
	
			//direct
			this.errorValue = 0;
	
			//bound framebuffer
			this.drawBuffer = null;
	
			//window framebuffer
			this.winDrawBuffer = null;
	
			//Buffers
			this.vertex_attrib_arrays = [];
	
			this.currentRenderbuffer = null;
	
			this.shared = null;
			this.const = {};
		}
	
		var cnvgl_context = jClass('cnvgl_context', Initializer);
	
		//public:
	
		cnvgl_context.cnvgl_context = function(driver) {

			cnvgl.setContext(this);
			this.shared = cnvgl.context_shared.getInstance();
			this.driver = driver;

			//array state
			this.array = {
				arrayBufferObj : null,
				elementArrayBufferObj : null,
				arrayObj : {
					vertexAttrib : []	
				}
			};
	
			//color state
			this.color = {
				blendColor : [0, 0, 0, 0],
				blendDestA : cnvgl.ZERO,
				blendDestRGB : cnvgl.ZERO,
				blendEnabled : cnvgl.FALSE,
				blendEquationA : cnvgl.FUNC_ADD,
				blendEquationRGB : cnvgl.FUNC_ADD,
				blendSrcA : cnvgl.ONE,
				blendSrcRGB : cnvgl.ONE,
				clearColor : [0, 0, 0, 0],
				colorMask : [0xFF, 0xFF, 0xFF, 0xFF],
				ditherFlag : cnvgl.TRUE
			};
	
			//depth state
			this.depth = {
				clear : 1.0,
				func : cnvgl.LESS,
				mask : cnvgl.TRUE,
				test : cnvgl.FALSE
			};
			
			//hint state
			this.hint = {
				generateMipmap : cnvgl.DONT_CARE
			};

			//line state
			this.line = {
				width : 1
			};

			//multisample state
			this.multisample = {
				sampleCoverageInvert : cnvgl.FALSE,
				sampleCoverageValue : 1
			};

			//pack state
			this.pack = {
				alignment : 4
			};
	
			//polygon state
			this.polygon = {
				cullFaceMode : cnvgl.BACK,
				cullFlag : cnvgl.FALSE,
				frontFace : cnvgl.CCW,
				offsetFactor : 0,
				offsetUnits : 0
			};

			//scissor state
			this.scissor = {
				enabled : cnvgl.FALSE
			};

			//shader state
			this.shader = {
				activeProgram : null	
			};
			
			//stencil state
			this.stencil = {
				clear : 0,
				failFunc : [cnvgl.KEEP, cnvgl.KEEP],
				func : [cnvgl.ALWAYS, cnvgl.ALWAYS],
				ref : [0, 0],
				valueMask : [~0, ~0],
				writeMask : [~0, ~0],
				zFailFunc : [cnvgl.KEEP, cnvgl.KEEP],
				zPassFunc : [cnvgl.KEEP, cnvgl.KEEP]
			};

			//unpack state
			this.unpack = {
				alignment : 4
			};
	
			//viewport state
			this.viewport = {
				near : 0.0,
				far : 1.0,
				x : 0,
				y : 0,
				w : 0,
				h : 0
			};
	
			//direct
			this.errorValue = cnvgl.NO_ERROR;
			this.const = cnvgl.constants;
	
			//texture state
			this.initFramebuffer();
			this.initTextures();
			this.initVertexAttribs();
		};
	
		cnvgl_context.initFramebuffer = function(width, height) {
			var frameBuffer, colorBuffer, depthBuffer, stencilBuffer;
	
			//set up framebuffer
			frameBuffer = new cnvgl.framebuffer(0);
			frameBuffer.width = width;
			frameBuffer.height = height;
	
			this.winDrawBuffer = frameBuffer;
			this.drawBuffer = frameBuffer;
	
			//set up color buffer
			colorBuffer = new cnvgl.renderbuffer(0);
			colorBuffer.internalFormat = cnvgl.RGBA;
			colorBuffer.width = width;
			colorBuffer.height = height;
			colorBuffer.data = this.driver.colorBuffer;
			frameBuffer.colorDrawBuffers[0] = colorBuffer;

			//set up depth buffer
			depthBuffer = new cnvgl.renderbuffer(0);
			depthBuffer.internalFormat = cnvgl.DEPTH_COMPONENT16;
			depthBuffer.width = width;
			depthBuffer.height = height;
			depthBuffer.data = this.driver.depthBuffer;
			frameBuffer.depthBuffer = depthBuffer;
			
			//set up stencil buffer
			stencilBuffer = new cnvgl.renderbuffer(0);
			stencilBuffer.internalFormat = cnvgl.STENCIL_INDEX8;
			stencilBuffer.width = width;
			stencilBuffer.height = height;
			stencilBuffer.data = this.driver.stencilBuffer;
			frameBuffer.stencilBuffer = stencilBuffer;
		};

		cnvgl_context.initTextures = function() {
			var units, i, unit;
			this.texture.currentUnit = 0;
			this.texture.unit = [];
			for (i = 0; i < this.const.maxTextureUnits; i++) {
				unit = new cnvgl.texture_unit(this, i);
				unit.current_texture[cnvgl.TEXTURE_2D] = this.shared.default_texture_objects[cnvgl.TEXTURE_2D];
				this.texture.unit[i] = unit;
			}
		};
	
		cnvgl_context.initVertexAttribs = function() {
			var i;
			for (i = 0; i < this.const.maxVertexAttribs; i++) {
				this.array.arrayObj.vertexAttrib[i] = new cnvgl.attrib_array_object();
			}
		};
	
		//static:
	
		cnvgl_context.Static.findFreeName = function(list, start) {
			start = start || 1;
			while (list[start]) {
				start++;
			}
			return start;
		};
	
		return cnvgl_context.Constructor;

	}());


}(cnvgl));

