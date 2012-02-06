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

cnvgl_renderer = (function() {

	//Internal Constructor
	function Initializer() {

		//public:
		this.clipping = null;
		this.culling = null;
		this.fragment = null;
		this.interpolate = null;
		this.primitive = null;
		this.vertex = null;
	}

	var cnvgl_renderer = jClass('cnvgl_renderer', Initializer);

	//public:

	cnvgl_renderer.cnvgl_renderer = function() {
		this.clipping = new cnvgl_rendering_clipping(this);
		this.culling = new cnvgl_rendering_culling(this);
		this.interpolate = new cnvgl_rendering_interpolate(this);
		this.primitive = new cnvgl_rendering_primitive(this);
		this.fragment = new cnvgl_rendering_fragment(this);
		this.vertex = new cnvgl_rendering_vertex(this);
	};

	cnvgl_renderer.send = function(state, mode, vertex) {
		if (!vertex.processed) {
			this.vertex.process(state, vertex);
		}
		this.primitive.send(state, mode, vertex);
	};

	cnvgl_renderer.end = function(mode) {
		this.primitive.end(mode);
	};

	cnvgl_renderer.checkDepth = function(state, i, z) {
		var depth, pass;

		depth = state.depthBuffer[i];

		switch (state.depthFunc) {
			case cnvgl.NEVER:
				pass = false;
				break;
			case cnvgl.ALWAYS:
				pass = true;
				break;
			case cnvgl.LESS:
				pass = z < depth;
				break;
			case cnvgl.LEQUAL:
				pass = z <= depth;
				break;
			case cnvgl.EQUAL:
				pass = z == depth;
				break;
			case cnvgl.GREATER:
				pass = z > depth;
				break;
			case cnvgl.GEQUAL:
				pass = z >= depth;
				break;
			case cnvgl.NOTEQUAL:
				pass = z != depth;
				break;
			default:
				pass = true;
		}		
		return pass;
	};

	return cnvgl_renderer.Constructor;

}());



include('drivers/cnvGL/gpu/rendering/clipping.js');
include('drivers/cnvGL/gpu/rendering/culling.js');
include('drivers/cnvGL/gpu/rendering/fragment.js');
include('drivers/cnvGL/gpu/rendering/interpolate.js');
include('drivers/cnvGL/gpu/rendering/primitive.js');
include('drivers/cnvGL/gpu/rendering/vertex.js');
include('drivers/cnvGL/gpu/rendering/primitive/point.js');
include('drivers/cnvGL/gpu/rendering/primitive/line.js');
include('drivers/cnvGL/gpu/rendering/primitive/triangle.js');

include('drivers/cnvGL/gpu/rendering/objects/primitive.js');
include('drivers/cnvGL/gpu/rendering/objects/vertex.js');
include('drivers/cnvGL/gpu/rendering//objects/fragment.js');
