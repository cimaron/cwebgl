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

cnvgl_rendering_culling = (function() {

	function Initializer() {
		//public:
		this.ctx = null;
		this.renderer = null;
	}

	var cnvgl_rendering_culling = jClass('cnvgl_rendering_culling', Initializer);	

	cnvgl_rendering_culling.cnvgl_rendering_culling = function(ctx, renderer) {
		this.ctx = ctx;
		this.renderer = renderer;
	};

	cnvgl_rendering_culling.checkCull = function(prim) {
		var dir;
		if (this.ctx.polygon.cullFlag) {
			dir = this.getPolygonFaceDir(prim);
			if (!(
				(dir > 0 && (this.ctx.polygon.cullFlag == GL_FALSE || this.ctx.polygon.cullFace == GL_FRONT)) ||
				(dir < 0 && (this.ctx.polygon.cullFlag == GL_FALSE || this.ctx.polygon.cullFace == GL_BACK)))) {
				return true;
			}
		}
		return false;
	};

	cnvgl_rendering_culling.getPolygonFaceDir = function(prim) {
		var dir;
		dir = prim.getDirection();
		if (this.ctx.polygon.frontFace) {
			dir = -dir;	
		}
		return dir;
	};

	return cnvgl_rendering_culling.Constructor;

}());

