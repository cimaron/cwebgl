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
CONNECTION WITH THE SOFTWARE OR THE USE		 OR OTHER DEALINGS IN THE SOFTWARE.
*/

function type(name, size, slots) {
	this.name = name;
	this.size = size;
	this.slots = slots;
}

types = {
	_void : new type("void", 1, 1),
	bool : new type("bool", 1, 1),
	int : new type("int", 1, 1),
	float : new type("float", 1, 1),
	vec2 : new type("vec2", 2, 1),
	vec3 : new type("vec3", 3, 1),
	vec4 : new type("vec4", 4, 1),
	bvec2 : new type("bvec2", 2, 1),
	bvec3 : new type("bvec3", 3, 1),
	bvec4 : new type("bvec4", 4, 1),
	ivec2 : new type("ivec2", 2, 1),
	ivec3 : new type("ivec3", 3, 1),
	ivec4 : new type("ivec4", 4, 1),
	mat2 : new type("mat2", 4, 2),
	mat3 : new type("mat3", 9, 3),
	mat4 : new type("mat4", 16, 4),
	sampler2D : new type("sampler2D", 1, 1),
	samplerCube : new type("samplerCube", 1, 1)
}

module.exports.types = types;
