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
	 * glCullFace — specify whether front- or back-facing facets can be culled
	 *
	 * @var GLenum  mode  Specifies whether front- or back-facing facets are candidates for culling.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glCullFace.xml
	 */
	cnvgl.cullFace = function(mode) {
		var ctx;
		ctx = cnvgl.getCurrentContext();
		
		if (mode != cnvgl.FRONT_AND_BACK
			&& mode != cnvgl.FRONT
			&& mode != cnvgl.BACK) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}
	
		ctx.polygon.cullFaceMode = mode;
		
		ctx.driver.cullFace(ctx, mode);
	};
	

	/**
	 * glFrontFace — define front- and back-facing polygons
	 *
	 * @var GLenum  mode  Specifies the orientation of front-facing polygons.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glFrontFace.xml
	 */
	cnvgl.frontFace = function(mode) {
		var ctx;
		ctx = cnvgl.getCurrentContext();
	
		if (mode != cnvgl.CW
			&& mode != cnvgl.CCW) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return;
		}
	
		ctx.polygon.frontFace = mode;
		
		ctx.driver.frontFace(ctx, mode);
	};


	/**
	 * glPolygonOffset — set the scale and units used to calculate depth values
	 *
	 * @var GLfloat  factor  Specifies a scale factor that is used to create a variable depth offset for each polygon.
	 * @var GLfloat  units   Is multiplied by an implementation-specific value to create a constant depth offset.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glPolygonOffset.xml
	 */
	cnvgl.polygonOffset = function(factor, units) {
		var ctx;
		ctx = cnvgl.getCurrentContext();
	
		if (ctx.polygon.offsetFactor == factor &&
			ctx.polygon.offsetUnits == units) {
			return;	
		}

		ctx.polygon.offsetFactor = factor;
		ctx.polygon.offsetUnits = units;
		
		ctx.driver.polygonOffset(ctx, factor, units);
	};

	
}(cnvgl));

