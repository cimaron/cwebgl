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


cnvgl_primitive = (function() {
							
	function Initializer() {
		//public:
		this.mode = null;
		this.vertices = [];
		this.sorted = false;
		this.direction = null;
	}

	var cnvgl_primitive = jClass('cnvgl_primitive', Initializer);

	//public:

	cnvgl_primitive.cnvgl_primitive = function() {
	};

	cnvgl_primitive.perspective = function() {
		var i, v;
		for (i = 0; i < this.vertices.length; i++) {
			v = this.vertices[i];
			v.x /= v.w;
			v.y /= v.w;
			v.z /= v.w;
		}
	};

	return cnvgl_primitive.Constructor;

}());

