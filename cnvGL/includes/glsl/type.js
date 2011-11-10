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

(function(glsl) {

	var type, i;

	type = {};

	type.names = [
		"void", "float", "int", "uint", "bool", "vec2", "vec3", "vec4", "bvec2", "bvec3", "bvec4", "ivec2",
		"ivec3", "ivec4", "uvec2", "uvec3", "uvec4", "mat2", "mat2x3", "mat2x4", "mat3x2", "mat3", "mat3x4",
		"mat4x2", "mat4x3", "mat4", "sampler1D", "sampler2D", "sampler2Drect", "sampler3D", "samplercube",
		"sampler1Dshadow", "sampler2Dshadow", "sampler2Drectshadow", "samplercubeshadow", "sampler1Darray",
		"sampler2Darray", "sampler1Darrayshadow", "sampler2Darrayshadow", "isampler1D", "isampler2D",
		"isampler3D", "isamplercube", "isampler1Darray", "isampler2Darray", "usampler1D", "usampler2D",
		"usampler3D", "usamplercube", "usampler1Darray", "usampler2Darray", "struct", "type_name"
		];

	/*
	void : 0,
	float : 1,
	int : 2,
	uint : 3,
	bool : 4,
	vec2 : 5,
	vec3 : 6,
	vec4 : 7,
	bvec2 : 8,
	bvec3 : 9,
	bvec4 : 10,
	ivec2 : 11,
	ivec3 : 12,
	ivec4 : 13,
	uvec2 : 14,
	uvec3 : 15,
	uvec4 : 16,
	mat2 : 17,
	mat2x3 : 18,
	mat2x4 : 19,
	mat3x2 : 20,
	mat3 : 21,
	mat3x4 : 22,
	mat4x2 : 23,
	mat4x3 : 24,
	mat4 : 25,
	sampler1D : 26,
	sampler2D : 27,
	sampler2Drect : 28,
	sampler3D : 29,
	samplercube : 30,
	sampler1Dshadow : 31,
	sampler2Dshadow : 32,
	sampler2Drectshadow : 33,
	samplercubeshadow : 34,
	sampler1Darray : 35,
	sampler2Darray : 36,
	sampler1Darrayshadow : 37,
	sampler2Darrayshadow : 38,
	isampler1D : 39,
	isampler2D : 40,
	isampler3D : 41,
	isamplercube : 42,
	isampler1Darray : 43,
	isampler2Darray : 44,
	usampler1D : 45,
	usampler2D : 46,
	usampler3D : 47,
	usamplercube : 48,
	usampler1Darray : 49,
	usampler2Darray : 50,	
	struct : 51,
	type_name : 52
	*/
	for (i = 0; i < type.names.length; i++) {
		type[type.names[i]] = i;
	}

	type.size = [
		 1,  1, 1, 1, 1, 2,  3, 4,
		 2,  3, 4, 2, 3, 4,  2, 3,
		 4,  4, 6, 8, 6, 9, 12, 8,
		12, 16, 1, 1, 1, 1,  1, 1,
		 1,  1, 1, 1, 1
		];

	type.defaultValues = [
		"null", "0.0", "0", "0", "0", "[0,0]", "[0,0,0]", "[0,0,0,0]",
		"[0,0]", "[0,0,0]", "[0,0,0,0]", "[0,0]", "[0,0,0]", "[0,0,0,0]", "[0,0]", "[0,0,0]",
		"[0,0,0,0]", "[0,0,0,0]", "[0,0,0,0,0,0,0,0]", "[0,0,0,0,0,0]",
		"[0,0,0,0,0,0,0,0,0]", "[0,0,0,0,0,0,0,0,0,0,0,0]", "[0,0,0,0,0,0,0,0]",
		"[0,0,0,0,0,0,0,0,0,0,0,0]", "[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]", "0", "0", "0", "0", "0", "0", 
		"0", "0", "0", "0", "0"
		];

	glsl.type = type;

}(glsl));

