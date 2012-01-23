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
	var shader, result, vertex, temp, program, memory;
	var tex;

	shader = {
		MAX_UNIFORMS : 128,
		MAX_FRAGMENT_UNIFORM_COMPONENTS : 128,
		MAX_VERTEX_ATTRIBS : 16,
		MAX_VARYING_VECTORS : 12,
		MAX_TEMPORARIES : 12
	};
	
	GPU.executeVertex = function(){};
	GPU.executeFragment = function(){};

	GPU.memory.temp = cnvgl.malloc(shader.MAX_TEMPORARIES * 4, 4);
	cnvgl.memset(GPU.memory.temp, 0, 0);
	GPU.memory.uniforms = cnvgl.malloc(shader.MAX_UNIFORMS * 4, 4);
	cnvgl.memset(GPU.memory.uniforms, 0, 0);
	GPU.memory.attributes = cnvgl.malloc(shader.MAX_VERTEX_ATTRIBS, 1);
	cnvgl.memset(GPU.memory.attributes, 0, 0);
	GPU.memory.result = cnvgl.malloc(3 * 4, 4);
	cnvgl.memset(GPU.memory.result, 0, 0);

	program = {};
	vertex = {};
	fragment = {};
	result = {};

	//set up alias for use by shaders
	temp = GPU.memory.temp;
	program.local = GPU.memory.uniforms.data;
	vertex.attrib = GPU.memory.attributes.data;
	result.position = GPU.memory.result.data;
	result.color = {};
	result.color.primary = GPU.memory.result.data;

	GPU.uploadVertexShader = function(source) {
		eval(source);
		this.executeVertex = main;
	};

	GPU.uploadFragmentShader = function(source) {
		eval(source);
		this.executeFragment = main;
	};

	GPU.shader = shader;

	//
	var tex;
	shader.setTexFunc = function(f) { tex = f; };

}(GPU));

