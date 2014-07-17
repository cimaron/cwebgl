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

function Type(name, size, slots, base) {
	this.name = name;
	this.size = size;
	this.slots = slots;
	this.base = base;
}

var types = {
	_void : new Type("void", 1, 1),
	bool : new Type("bool", 1, 1),
	int : new Type("int", 1, 1),
	float : new Type("float", 1, 1),
	vec2 : new Type("vec2", 2, 1, 'float'),
	vec3 : new Type("vec3", 3, 1, 'float'),
	vec4 : new Type("vec4", 4, 1, 'float'),
	bvec2 : new Type("bvec2", 2, 1, 'bool'),
	bvec3 : new Type("bvec3", 3, 1, 'bool'),
	bvec4 : new Type("bvec4", 4, 1, 'bool'),
	ivec2 : new Type("ivec2", 2, 1, 'int'),
	ivec3 : new Type("ivec3", 3, 1, 'int'),
	ivec4 : new Type("ivec4", 4, 1, 'int'),
	mat2 : new Type("mat2", 4, 2, 'float'),
	mat3 : new Type("mat3", 9, 3, 'float'),
	mat4 : new Type("mat4", 16, 4, 'float'),
	sampler2D : new Type("sampler2D", 1, 1),
	samplerCube : new Type("samplerCube", 1, 1)
};

