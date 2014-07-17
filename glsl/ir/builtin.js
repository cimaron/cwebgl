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

var builtin = {
	
	vars : {
	
		vertex : [
			{
				position : 0,
				type : 'vec4',
				name : 'gl_Position',
				out : 'result@0'
			},
			{
				position : 1,
				type : 'float',
				name : 'gl_PointSize',
				out : 'result@1'
			}
		],

		fragment : [
			{
				position : 0,
				type : 'vec4',
				name : 'gl_FragColor',
				out : 'result@0'
			}
		]
	},
	
	/**
	 * List of instructions for operators
	 * 
	 * Denoted by operator, then by definition of param types to output type
	 */
	oper : {
		"!" : {
			"bool:bool" : [
				"ABS %1.x %2.x",
				"SGE %1.x 0.0 %1.x"
				]
			},
		"+" : {
			"float,float:float" : ["ADD %1.x %2.x %3.x"],
			"vec2,vec2:vec2" : ["ADD %1.xy %2.xy %3.xy"],
			"vec3,vec3:vec3" : ["ADD %1.xyz %2.xyz %3.xyz"],
			"vec4,vec4:vec4" : ["ADD %1 %2 %3"]
			},
		"<" : {
			"float,float:float" : ["SLT %1.x %2.x %3.x"]
			},
		"*" : {
			"float,float:float" : ["MUL %1.x %2.x %3.x"],
			"float,vec3:vec3" : ["MUL %1.xyz %2.x %3.xyz"],
			"vec3,float:vec3" : ["MUL %1.xyz %2.xyz %3.x"],
			"vec3,vec3:vec3" : ["MUL %1.xyz %2.xyz %3.xyz"],
			"vec4,vec4:vec4" : ["MUL %1 %2 %3"],
			"mat3,vec3:vec3" : [
				"MUL %1.xyz %2.xyz %3.x",
				"MAD %1.xyz %2@1.xyz %3.y %1",
				"MAD %1.xyz %2@2.xyz %3.z %1"
				],
			"mat4,vec4:vec4" : [
				"MUL %1 %2 %3.x",
				"MAD %1 %2@1 %3.y %1",
				"MAD %1 %2@2 %3.z %1",
				"MAD %1 %2@3 %3.w %1"
				],
			"mat4,mat4:mat4" : [
				"MUL %1 %2 %3.x",
				"MAD %1 %2@1 %3.y %1",
				"MAD %1 %2@2 %3.z %1",
				"MAD %1 %2@3 %3.w %1",
				"MUL %1@1 %2 %3@1.x",
				"MAD %1@1 %2@1 %3@1.y %1@1",
				"MAD %1@1 %2@2 %3@1.z %1@1",
				"MAD %1@1 %2@3 %3@1.w %1@1",
				"MUL %1@2 %2 %3@2.x",
				"MAD %1@2 %2@1 %3@2.y %1@2",
				"MAD %1@2 %2@2 %3@2.z %1@2",
				"MAD %1@2 %2@3 %3@2.w %1@2",
				"MUL %1@3 %2 %3@3.x",
				"MAD %1@3 %2@1 %3@3.y %1@3",
				"MAD %1@3 %2@2 %3@3.z %1@3",
				"MAD %1@3 %2@3 %3@3.w %1@3"
				]
			},
		"-" : {
			"vec3,vec3:vec3" : ["SUB %1.xyz %2.xyz %3.xyz"],
			"vec4,vec4:vec4" : ["SUB %1 %2 %3"]
		}
	},

	/**
	 * List of instructions for built in functions
	 * 
	 * Denoted by function name, then by definition of param types to output type
	 */
	func : {
		"dot": {
			"vec3,vec3:float" : ["DP3 %1 %2 %3"],
			"vec4,vec4:float" : ["DP4 %1 %2 %3"]
			},			
        "max": {
			"float,float:float" : ["MAX %1.x %2.x %3.x"]
			},
        "normalize": {
			"vec3:vec3" : [
				"DP3 %1.x %2 %2",
				"RSQ %1.x %1.x",
				"MUL %1.xyz %2.xyz %1.x"
				],
			"vec4:vec4" : [
				"DP4 %1.x %2 %2",
				"RSQ %1.x %1.x",
				"MUL %1 %2 %1.x"
				]
			},
		"pow": {
			"float,float:float" : ["POW %1.x %2.x %3.x"]
			},
        "reflect": {
			"vec3,vec3:vec3" : [
				"DP3 %1.x %3 %2",
				"MUL %1.xyz %3 %1.x",
				"MAD %1.xyz -%1 2.0 %2"
				]
			},
		"texture2D": {
			"sampler2D,vec2:vec4" : ["TEX %1 %3 %2 \"2D\""]
		}
	}
};

function _builtinParseType(str) {
	var parts, ret;

	parts = str.split(":");
	parts[0] = parts[0].split(",");
	
	ret = {
		src : parts[0],
		dest : parts[1]
	};
	
	return ret;
}


function symbol_table_init(state) {
	var i, j, vars, v, entry, types, name;

	vars = (state.options.target === glsl.target.vertex) ? builtin.vars.vertex : builtin.vars.fragment;

	for (i = 0; i < vars.length; i++) {
		v = vars[i];
		entry = state.symbols.add_variable(v.name, v.type);
		entry.position = v.position;
		entry.out = v.out;
	}

	vars = builtin.func;

	for (name in vars) {
		v = vars[name];
		for (j in v) {
			types = _builtinParseType(j);	
			entry = state.symbols.add_function(name, types.dest, types.src);
			entry.code = v[j]
		}
	}
}

