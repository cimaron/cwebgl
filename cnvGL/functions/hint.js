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
	 * glHint — specify implementation-specific hints
	 *
	 * @var GLenum  target  Specifies a symbolic constant indicating the behavior to be controlled.
	 * @var GLenum  mode    Specifies a symbolic constant indicating the desired behavior.  
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glHint.xml
	 */
	cnvgl.hint = function(target, mode) {
		var ctx, name;
		ctx = cnvgl.getCurrentContext();
	
		if (mode != cnvgl.NICEST && mode != cnvgl.FASTEST && mode != cnvgl.DONT_CARE) {
			cnvgl.throw_error(ctx, cnvgl.INVALID_ENUM);
			return;
		}

		switch (target) {
			case cnvgl.GENERATE_MIPMAP_HINT:
				name = 'generateMipmap';
				break;

			default:
				throw new Error('hint not implemented yet ' + target);
				return;
		}
		
		if (ctx.hint[name] == mode) {
			return;	
		}

		ctx.hint[name] = mode;

		ctx.driver.hint(ctx, target, mode);
	};


}(cnvgl));

