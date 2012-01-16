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


	/**
	 * glBindFramebuffer — bind a framebuffer to a framebuffer target
	 *
	 * @var GLenum  target  Specifies the framebuffer target of the binding operation.
	 * @var GLuint  ids     Specifies the name of the framebuffer object to bind.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glBindFramebuffer.xml
	 */
	cnvgl.bindFramebuffer = function(target, framebuffer) {
		var ctx, framebuffer_obj;
	
		ctx = cnvgl.getCurrentContext();
	
		if (target != cnvgl.FRAMEBUFFER) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}
	
		if (framebuffer) {
			framebuffer_obj = ctx.shared.frameBuffers[framebuffer];
		} else {
			framebuffer_obj = ctx.winDrawBuffer;
		}
	
		if (!framebuffer_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;		
		}
	
		//create object if necessary
		if (framebuffer_obj == 1) {
			framebuffer_obj = new cnvgl_framebuffer(framebuffer);
			ctx.shared.frameBuffers[framebuffer] = framebuffer_obj;
		}
	
		ctx.drawBuffer = framebuffer_obj;
	};


	/**
	 * glBindRenderbuffer — bind a renderbuffer to a renderbuffer target
	 *
	 * @var GLenum  target        Specifies the renderbuffer target of the binding operation.
	 * @var GLuint  renderbuffer  Specifies the name of the renderbuffer object to bind.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glBindRenderbuffer.xml
	 */
	cnvgl.bindRenderbuffer = function(target, renderbuffer) {
		var ctx, renderbuffer_obj, name;
	
		ctx = cnvgl.getCurrentContext();
	
		if (target != cnvgl.RENDERBUFFER) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}
	
		if (renderbuffer) {
			renderbuffer_obj = ctx.shared.renderBuffers[renderbuffer];
		}
	
		if (!renderbuffer_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;		
		}
	
		if (renderbuffer_obj == 1) {
			renderbuffer_obj = new cnvgl.renderbuffer(renderbuffer);
			ctx.shared.renderBuffers[renderbuffer] = renderbuffer_obj;
		}
	
		ctx.currentRenderbuffer = renderbuffer_obj;
	};


	/**
	 * glGenFramebuffers — generate framebuffer object names
	 *
	 * @var GLsizei   n    Specifies the number of framebuffer object names to generate.
	 * @var [GLuint]  ids  Specifies an array in which the generated framebuffer object names are stored.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGenFramebuffers.xml
	 */
	cnvgl.genFramebuffers = function(n, framebuffers) {
		var ctx, list, name;

		ctx = cnvgl.getCurrentContext();
		list = [];
	
		if (n < 0) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		for (i = 0; i < n; i++) {
			name = cnvgl.context.findFreeName(ctx.shared.frameBuffers, name);
			ctx.shared.frameBuffers[name] = 1;
			list.push(name);
		}
	
		framebuffers[0] = list;
	};


	/**
	 * glGenRenderbuffers — generate renderbuffer object names
	 *
	 * @var GLsizei   n              Specifies the number of renderbuffer object names to generate.
	 * @var [GLuint]  renderbuffers  Specifies an array in which the generated renderbuffer object names are stored.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGenRenderbuffers.xml
	 */
	cnvgl.genRenderbuffers = function(n, renderbuffers) {
		var ctx, list, name;
	
		ctx = cnvgl.getCurrentContext();
		list = [];
	
		if (n < 0) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		for (i = 0; i < n; i++) {
			name = cnvgl.context.findFreeName(ctx.shared.renderBuffers, name);
			ctx.shared.renderBuffers[name] = 1;
			list.push(name);
		}
	
		renderbuffers[0] = list;
	};


	/**
	 * glRenderbufferStorage — establish data storage, format and dimensions of a renderbuffer object's image
	 *
	 * @var GLenum   target          Specifies a binding to which the target of the allocation and must be GL_RENDERBUFFER.
	 * @var GLenum   internalformat  Specifies the internal format to use for the renderbuffer object's image.
	 * @var GLsizei  width           Specifies the width of the renderbuffer, in pixels.
	 * @var GLsizei  height          Specifies the height of the renderbuffer, in pixels.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glRenderbufferStorage.xml
	 */
	cnvgl.renderbufferStorage = function(target, internalFormat, width, height) {
		var ctx, renderbuffer_obj, baseFormat, temp;	
	
		ctx = cnvgl.getCurrentContext();
	
		if (target != cnvgl.RENDERBUFFER) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}
		
		/*
		if (internalformat is not an accepted format) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
		}
		*/
		
		if (width < 1 || width > ctx.const.maxRenderbufferSize) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		if (height < 1 || height > ctx.const.maxRenderbufferSize) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		renderbuffer_obj = ctx.currentRenderbuffer;
	
		if (!renderbuffer_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;		
		}
	
		if (renderbuffer_obj.internalFormat == internalFormat &&
			renderbuffer_obj.width == width &&
			renderbuffer_obj.height == height) {
			return;
		}
	
		renderbuffer_obj.format = 0;
		renderbuffer_obj.numSamples = 0;
	
		renderbuffer_obj.data = cnvgl_malloc(internalFormat, width * height);
	
		renderbuffer_obj.internalFormat = internalFormat;
		renderbuffer_obj.width = width;
		renderbuffer_obj.height = height;
	};
	
}(cnvgl));

