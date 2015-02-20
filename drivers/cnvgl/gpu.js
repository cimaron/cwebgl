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


/**
 * Convert GL texture target to GPU texture target
 */
function getGPUTextureTarget(gl_target) {
	var cnst = GPU.constants.texture.targets;

	switch (gl_target) {

		case cnvgl.TEXTURE_2D:
			return cnst.texture_2D;
	}

	throw new Error("cnvGL.driver: Invalid texture target");
}

/**
 * Convert GL texture pixel format to gpu format
 */
function getGPUPixelFormat(format) {
	var cnst = GPU.constants.texture.image.format;

	switch (format) {
		
		case cnvgl.RGB:
			return cnst.rgb;

		case cnvgl.RGBA:
			return cnst.rgba;
	}

	throw new Error("cnvGL.driver: Invalid pixel format");
}

/**
 * Convert GL texture filter format to gpu format
 */
function getGPUTextureFilter(filter) {
	var cnst = GPU.constants.texture.func;

	switch (filter) {
		
		case cnvgl.LINEAR:
			return cnst.linear;

		case cnvgl.NEAREST:
			return cnst.nearest;
		
		case cnvgl.LINEAR_MIPMAP_NEAREST:
			return cnst.linear_mipmap_nearest;

		case cnvgl.NEAREST_MIPMAP_LINEAR:
			return cnst.nearest_mipmap_linear;
	}

	throw new Error("cnvGL.driver: Invalid texture filter");
}


