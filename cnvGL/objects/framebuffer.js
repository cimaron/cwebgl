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

function cnvgl_framebuffer(name) {

	this.name = name;
	this.refCount = 0;
	this.deletePending = false;

	this.visual = null; //??
	this.initialized = null;

	this.width = 0;
	this.height = 0;

	this.xmin = 0;
	this.xmax = 0;
	this.ymin = 0;
	this.ymax = 0;
	
	this.depthMax = 0;
	this.depthMaxF = 0;
	this.MRD = 0;
	
	this.status = null;
	this.integerColor = null;

	this.attachment = [];

	this.colorDrawBuffers = [];   
	this.colorReadBuffer = null;

	this.numColorDrawBuffers = 0;
	this.colorDrawBufferIndexes = [];
	this.colorReadBufferIndex = -1;

	this.depthBuffer = null;
	this.stencilBuffer = null;
};
