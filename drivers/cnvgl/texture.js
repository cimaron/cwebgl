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


proto.newTextureObject = function() {
	return new GPU.TextureObject();
};


/**
 * Bind Texture
 *
 * @param   object   ctx       GPU context
 * @param   int      target    Texture target
 * @param   object   tex_obj   Texture object
 */
proto.bindTexture = function(ctx, target, tex_obj) {
	this.command('bindTexture', getGPUTextureTarget(target), tex_obj.driverObj, ctx.texture.currentUnit);
};


/**
 *
 */
proto.texParameter = function(ctx, target, tex_obj, pname, param) {
	var cmd, parm;

	switch (pname) {

		case cnvgl.TEXTURE_MIN_FILTER:
			cmd = 'TextureMinFilter';
			parm = getGPUTextureFilter(param);
			break;

		case cnvgl.TEXTURE_MAG_FILTER:
			cmd = 'TextureMagFilter';
			parm = getGPUTextureFilter(param);
			break;

		default:
			return;
	}

	this.command('texParameter' + cmd, tex_obj.driverObj, parm);
};

/**
 * Send textImage2D command to GPU
 */
proto.texImage2D = function(ctx, target, level, internalFormat, width, height, depth, border, format, type, data, unpack, texture_obj, texture_image) {

	this.command('texImage2D',
		texture_obj.driverObj,
		//getGPUTextureTarget(target),
		level,
		internalFormat,
		width,
		height,
		getGPUPixelFormat(format),
		type,
		data
		);		
};



proto.renderTexture = function(ctx, fb_obj, tex_obj, textarget, level, offset) {
	this.command('renderTexture', fb_obj, tex_obj, textarget, level, offset);
};



