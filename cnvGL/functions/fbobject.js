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


function glGenFramebuffers(n, framebuffers) {
	var ctx, list, name;

	ctx = cnvgl_context.getCurrentContext();
	list = [];

	if (n < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	for (i = 0; i < n; i++) {
		name = cnvgl_context.findFreeName(ctx.shared.frameBuffers, name);
		ctx.shared.frameBuffers[name] = 1;
		list.push(name);
	}

	framebuffers[0] = list;
}


function glBindFramebuffer(target, framebuffer) {
	var ctx, framebuffer_obj;

	ctx = cnvgl_context.getCurrentContext();

	if (target != GL_FRAMEBUFFER) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	if (framebuffer) {
		framebuffer_obj = ctx.shared.frameBuffers[framebuffer];
	} else {
		framebuffer_obj = ctx.winDrawBuffer;
	}

	if (!framebuffer_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;		
	}

	//create object if necessary
	if (framebuffer_obj == 1) {
		framebuffer_obj = new cnvgl_framebuffer(framebuffer);
		ctx.shared.frameBuffers[framebuffer] = framebuffer_obj;
	}

	ctx.drawBuffer = framebuffer_obj;
}


function glGenRenderbuffers(n, renderbuffers) {
	var ctx, list, name;

	ctx = cnvgl_context.getCurrentContext();
	list = [];

	if (n < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	for (i = 0; i < n; i++) {
		name = cnvgl_context.findFreeName(ctx.shared.renderBuffers, name);
		ctx.shared.renderBuffers[name] = 1;
		list.push(name);
	}

	renderbuffers[0] = list;
}


function glBindRenderbuffer(target, renderbuffer) {
	var ctx, renderbuffer_obj, name;

	ctx = cnvgl_context.getCurrentContext();

	if (target != GL_RENDERBUFFER) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}

	if (renderbuffer) {
		renderbuffer_obj = ctx.shared.renderBuffers[renderbuffer];
	}

	if (!renderbuffer_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;		
	}

	if (renderbuffer_obj == 1) {
		renderbuffer_obj = new cnvgl_renderbuffer(renderbuffer);
		ctx.shared.renderBuffers[renderbuffer] = renderbuffer_obj;
	}

	ctx.currentRenderbuffer = renderbuffer_obj;
}


function glRenderbufferStorage(target, internalFormat, width, height) {
	var ctx, renderbuffer_obj, baseFormat, temp;	

	ctx = cnvgl_context.getCurrentContext();

	if (target != GL_RENDERBUFFER) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;
	}
	
	/*
	if (internalformat is not an accepted format) {
		cnvgl_throw_error(GL_INVALID_ENUM);
	}
	*/
	
	if (width < 1 || width > ctx.const.maxRenderbufferSize) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	if (height < 1 || height > ctx.const.maxRenderbufferSize) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	renderbuffer_obj = ctx.currentRenderbuffer;

	if (!renderbuffer_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
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
}

