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

cnvgl_fragment_processor = (function() {

	//Internal Constructor
	function Initializer() {
		this.program = null;		
		this.access = {
			_out : {}
		};
	}

	var processor = jClass('cnvgl_fragment_processor', Initializer);

	//public:

	processor.processor = function() {	
	}

	processor.setProgram = function(program) {
		this.program = 	program;
	}

	processor.processTriangle = function(v1, v2, v3) {
	
		var min = Math.min;
		var max = Math.max;
		var ceil = Math.ceil;
		var floor = Math.floor;
	
		//@todo: sort vertices
	
		var line1 = this.line(v1, v2);
		var line2 = this.line(v1, v3);
		var line3 = this.line(v2, v3);
	
		//get max vertical bounds
		var yi_start = min(line1.y1, min(line2.y1, line3.y1));
		var yi_start = ceil(yi_start - .5) + 1;
	
		var yi_end = max(line1.y2, max(line2.y2, line3.y2));
		var yi_end = ceil(yi_end + .5) - 1;
	
		var varying = {};
	
		var buffer = cnvgl_state.color_buffer;
		var viewport_w = cnvgl_state.viewport_w;
		var viewport_h = cnvgl_state.viewport_h;
		var c = [0, 0, 0, 0];
		
		//for each horizontal scanline	
		for (var yi = yi_start; yi < yi_end; yi++) {
	
			//get left and right edges
			var xi1 = -1;
			var xi2 = -1;
			if (yi >= line1.y1 && yi <= line1.y2) {
				xi1 = Math.floor((yi - line1.y1) / line1.dy + line1.x1);
			}
			if (yi >= line2.y1 && yi <= line2.y2) {
				xi2 = Math.floor((yi - line2.y1) / line2.dy + line2.x1);
				if (xi1 == -1) {
					xi1 = xi2; xi2 = -1;	
				}
			}
			if (xi2 == -1) {
				var xi2 = Math.floor((yi - line3.y1) / line3.dy + line3.x1);
			}
	
			//check order
			if (xi1 > xi2) {
				var xi_start = xi2;
				var xi_end = xi1;
			} else {
				var xi_end = xi2;
				var xi_start = xi1;
			}
	
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

	processor.line = function(v1, v2) {
	
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

	processor.fragment = function(xi, yi, varying, c) {
		this.program.fragment_program.apply(this.access);
		
		var gl_FragColor = this.access._out.gl_FragColor;
		c[0] = Math.round(gl_FragColor[0] * 255);
		c[1] = Math.round(gl_FragColor[1] * 255);
		c[2] = Math.round(gl_FragColor[2] * 255);
	}

	return processor.Constructor;

})();

