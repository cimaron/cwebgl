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


function glClearDepth(depth) {
	var ctx;
	ctx = cnvgl_context.getCurrentContext();

	depth = Math.max(Math.min(depth, 1), 0);
	ctx.depth.clear = depth;
}


function glDepthFunc(func) {
	var ctx;
	ctx = cnvgl_context.getCurrentContext();
	
	if (func != GL_NEVER
		&& func != GL_LESS
		&& func != GL_EQUAL
		&& func != GL_LEQUAL
		&& func != GL_GREATER
		&& func != GL_NOTEQUAL
		&& func != GL_GEQUAL
		&& func != GL_ALWAYS) {
		cnvgl_throw_error(GL_INVALID_ENUM);
		return;		
	}

	ctx.depth.func = func;
}


function glDepthMask(mask) {
	var ctx;
	ctx = cnvgl_context.getCurrentContext();

	ctx.depth.mask = mask ? GL_TRUE : GL_FALSE;
}

