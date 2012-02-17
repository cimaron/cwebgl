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

cnvgl = {

	/**
	 * Current cnvGL context
	 *
	 * @var  cnvgl_context
	 */	
	currentContext : null,

	/**
	 * Create a new cnvgl context
	 *
	 * @var Object  driver  The graphics driver to attach to the context
	 */
	createContext : function(driver) {
		var ctx;
		ctx = new cnvgl.context(driver);
		return ctx;
	},

	/**
	 * Sets the current context
	 *
	 * @var cnvgl_context  context  The cnvgl context to make current
	 */
	setContext : function(context) {
		cnvgl.currentContext = context;
	},

	/**
	 * Gets the current context
	 */
	getCurrentContext : function() {
		return cnvgl.currentContext;
	},

	/**
	 * Sets an error in the specified context
	 *
	 * @var GLenum         error  Specifies the error code
	 * @var cnvgl_context  ctx    Specifies the context to set the error code
	 */
	throw_error : function(error, ctx) {
		ctx = ctx || cnvgl.getCurrentContext();
		if (error && ctx.errorValue == cnvgl.NO_ERROR) {
			ctx.errorValue = error;
		}
	}

};



include('cnvGL/defines.js');

include('cnvGL/objects/attrib_array_object.js');
include('cnvGL/objects/buffer.js');
include('cnvGL/objects/constants.js');
include('cnvGL/objects/context.js');
include('cnvGL/objects/context_shared.js');
include('cnvGL/objects/framebuffer.js');
include('cnvGL/objects/program.js');
include('cnvGL/objects/shader.js');
include('cnvGL/objects/renderbuffer.js');
include('cnvGL/objects/texture.js');

include('cnvGL/functions/blend.js');
include('cnvGL/functions/bufferobj.js');
include('cnvGL/functions/clear.js');
include('cnvGL/functions/context.js');
include('cnvGL/functions/depth.js');
include('cnvGL/functions/draw.js');
include('cnvGL/functions/enable.js');
include('cnvGL/functions/fbobject.js');
include('cnvGL/functions/get.js');
include('cnvGL/functions/hint.js');
include('cnvGL/functions/lines.js');
include('cnvGL/functions/multisample.js');
include('cnvGL/functions/pixelstore.js');
include('cnvGL/functions/polygon.js');
include('cnvGL/functions/scissor.js');
include('cnvGL/functions/shaderapi.js');
include('cnvGL/functions/stencil.js');
include('cnvGL/functions/teximage.js');
include('cnvGL/functions/texobj.js');
include('cnvGL/functions/texparam.js');
include('cnvGL/functions/texstate.js');
include('cnvGL/functions/uniforms.js');
include('cnvGL/functions/varray.js');
include('cnvGL/functions/viewport.js');

include('cnvGL/includes/memory.js');

