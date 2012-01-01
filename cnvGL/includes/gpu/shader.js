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

(function(GPU) {
	var result, vertex, temp, program, memory;

	var shader = {
		MAX_UNIFORMS : 128,
		MAX_FRAGMENT_UNIFORM_COMPONENTS : 128,
		MAX_VERTEX_ATTRIBS : 16,
		MAX_VARYING_VECTORS : 12,
		MAX_TEMPORARIES : 12
	};

	GPU.executeVertex = function(){};
	GPU.executeFragment = function(){};

	shader.external_bindings = {
		'gl_FragColor' : 0,
		'gl_Position' : 1
	};

	shader.internal_bindings = {
		'result.position' : 0,
		'result.color' : 1
	};

	memory = {
		temp : GPU.malloc(shader.MAX_TEMPORARIES * 4, 4),
		uniforms : GPU.malloc(shader.MAX_UNIFORMS * 4, 4),
		attributes : GPU.malloc(shader.MAX_VERTEX_ATTRIBS * 4, 4),
		varying : GPU.malloc(shader.MAX_VARYING_VECTORS * 4, 4),
		result : GPU.malloc(1, 4)
	};

	//Pointers
	result = {
		position : [0,0,0,0],
		color : {
			primary : [0,0,0,0]	
		}
	};

	//result = memory.result.data;
	temp = memory.temp.data;

	program = {
		local : memory.uniforms.data
	};

	vertex = {
		attrib : memory.attributes.data,
		varying : memory.varying.data
	};

	fragment = {
		attrib : memory.varying.data
	};

	GPU.setAttribPtr = function(attributes) {
		GPU.memory.shader.attributes = attributes.data;
		vertex.attrib = attributes.data;
	};

	GPU.uploadVertexShader = function(source) {
		eval(source);
		this.executeVertex = main;
	};

	GPU.uploadFragmentShader = function(source) {
		eval(source);
		this.executeFragment = main;
	};

	GPU.uploadShader = function(source, target) {
		if (target == glsl.mode.vertex) {
			this.uploadVertexShader(source);	
		} else {
			this.uploadFragmentShader(source);	
		}
	}

	GPU.shader = shader;
	GPU.memory.shader = memory;

	GPU.shader.result = result;
	GPU.shader.vertex = vertex;
	GPU.shader.fragment = fragment;

	//
	var tex;
	shader.setTexFunc = function(f) { tex = f; };

}(GPU));

