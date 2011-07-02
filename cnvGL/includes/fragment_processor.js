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

//----------------------------------------------------------------------------------------
//	class cnvgl_vertex_processor
//----------------------------------------------------------------------------------------
function cnvgl_fragment_processor() {
	
	//member variables
	this.mode = null;
	this.buffer = null;
	this.program = null;

	//Call constructor
	this.construct();
}

//----------------------------------------------------------------------------------------
//	Class Magic
//----------------------------------------------------------------------------------------

__cnvgl_fragment_processor = new pClass('cnvgl_fragment_processor');
cnvgl_fragment_processor.prototype = __cnvgl_fragment_processor;

//----------------------------------------------------------------------------------------
//	Methods
//----------------------------------------------------------------------------------------

__cnvgl_fragment_processor.cnvgl_fragment_processor = function() {
}

__cnvgl_fragment_processor.processPrimitive = function(v1, v2, v3) {

	//@todo: sort vertices
	
	var line1 = this.line(v1, v2);
	var line2 = this.line(v1, v3);
	var line3 = this.line(v2, v3);

	//console.log(line1);
	//console.log(line2);
	//console.log(line3);

	//for each horizontal scanline
	
	//debugger;

	var yi_start = Math.ceil(line1.y1);
	var yi_end = Math.ceil(line1.y2);
	var varying = {};

	var buffer = cnvgl_state.color_buffer;
	var viewport_w = cnvgl_state.viewport_w;
	var viewport_h = cnvgl_state.viewport_h;
	var c = [0, 0, 0];

	for (var yi = yi_start; yi < yi_end; yi++) {

		//get left/right
		var xi_start = Math.floor((yi - line1.y1) / line1.dy + line1.x1);
		var xi_end = Math.floor((yi - line2.y1) / line2.dy + line2.x1);

		for (var xi = xi_start; xi < xi_end; xi++) {
			
			this.fragment(xi, yi, varying, c);

			//draw it!
			var i = (viewport_w * yi + xi) * 4;

			buffer[i] = c[0];
			buffer[i + 1] = c[1];
			buffer[i + 2] = c[2];	
		}

		//console.log(yi, xi_start, yi, xi_end);
	}

	
}

__cnvgl_fragment_processor.line = function(v1, v2) {
	var line;
	if (v1.sy > v2.sy) {
		line = {
			x1 : v2.sx,
			y1 : v2.sy,
			x2 : v1.sx,
			y2 : v1.sy
		};
	} else {
		line = {
			x1 : v1.sx,
			y1 : v1.sy,
			x2 : v2.sx,
			y2 : v2.sy
		};
	}
	line.dy = (v2.sy - v1.sy) / (v2.sx - v1.sx);
	line.dx = 1 / line.dy;
	return line;
}


__cnvgl_fragment_processor.fragment = function(xi, yi, varying, c) {
	c[0] = 255;
	c[1] = 255;
	c[2] = 255;
}


