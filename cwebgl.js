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


cWebGL = {

	version : '0.3.1',

	/**
	 * List of WebGLRenderingContext contexts
	 *
	 * @var    array
	 */	
	contexts : [],

	/**
	 * Can use a native context
	 *
	 * @var    boolean
	 */	
	native : null,

	/**
	 * List of possible native webgl context names
	 *
	 * @var    array
	 */	
	names : ["webgl", "experimental-webgl"],

	/**
	 * List of drivers
	 *
	 * @var    array
	 */
	drivers : {},

	/**
	 * List of valid native webgl context names
	 *
	 * @var    array
	 */
	valid : [],

	/**
	 * Properties to extend to native contexts
	 *
	 * @var    object
	 */	
		//define extended properties
	extensions : {
		onReady : function(f) {
			var This = this;
			window.setTimeout(function() {
				f(This);
			}, 0);
		},
	},

	/**
	 * The native browser HTMLCanvasElement.getContext method
	 *
	 * @param    string    name    The context name to generate
	 * @param    string    config  (Optional) configuration object
	 *
	 * @return   object
	 */
	getNativeContext : HTMLCanvasElement.prototype.getContext,

	/**
	 * Tests for a native webgl context type
	 *
	 * @return   boolean
	 */
	test : function() {
		var i, e;

		for (i = 0; i < this.names.length; i++) {
			try {
				if (document.createElement("canvas").getContext(this.names[i], null)) {
					this.valid.push(this.names[i]);
				}
			} catch (e) {
				//can't generate context
			}
		}

		this.native = this.valid.length > 0;

		return this.native;
	},

	/**
	 * Tests drivers to determine which to use
	 *
	 * @return   boolean
	 */
	getDriver : function() {
		var i;

		for (i in this.drivers) {
			if (this.drivers[i].test()) {
				return this.drivers[i];
			}
		}

		return null;
	},

	/**
	 * The HTMLCanvasElement.getContext method hook
	 *
	 * @param    string    name    The context name to generate
	 * @param    string    config  (Optional) configuration object
	 * @param    string    native  (Optional) Force a native context
	 *
	 * @return   object
	 */
	getContext : function(name, config, ntv) {
		var _, ctx, driver;

		//with(WebGLRenderingContextNative)
		_ = cWebGL;

		//return native 2d context
		if (_.names.indexOf(name) == -1) {
			return _.getNativeContext.call(this, name, config);
		}

		//if context does not exist, create it
		if (!_.contexts[this]) {

			//use a known valid 3d context name if possible
			if (_.native) {
				name = _.valid[0];
			}

			//native or software context
			if ((ntv || _.native) && (!config || config.native)) {
				ctx = _.getNativeContext.call(this, name, config);
				_.extend(ctx);
			} else {
				if (!(driver = _.getDriver())) {
					throw new Error('Could not load graphics driver');	
				}

				ctx = new cWebGLRenderingContext(this, new cWebGLContextAttributes(config), new driver(this));
			}

			_.contexts[this] = ctx;
		}

		return _.contexts[this];	
	},

	/**
	 * Extend a native WebGLRenderingContext with extra properties
	 *
	 * @param    WebGLRenderingContext    name    The context
	 */
	extend : function(ctx) {
		var i;

		for (i in this.extensions) {
			if (this.extensions.hasOwnProperty(i)) {
				ctx[i] = this.extensions[i];
			}
		}
	},

	/**
	 * Initialize library
	 */
	initialize : function() {
		if (typeof HTMLCanvasElement != "undefined") {
			if (!this.test()) {
				WebGLRenderingContext = cWebGLRenderingContext;
			}
			HTMLCanvasElement.prototype.getContext = this.getContext;
		}
	}

};

cWebGL.initialize();

