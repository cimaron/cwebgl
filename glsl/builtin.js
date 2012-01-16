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

	var vertex_vars = [
		['out', 0, 'vec4', 'gl_Position', 'result.position']
	];

	var fragment_vars = [
		['out', 1, 'vec4', 'gl_FragColor', 'result.color.primary']
	];

	glsl.parser.initialize_types = function(state) {
		var i, vars, funcs, types, v, entry;

		vars = state.target == glsl.mode.vertex ? vertex_vars : fragment_vars;
		for (i = 0; i < vars.length; i++) {
			v = vars[i];
			entry = state.symbols.add_variable(v[3]);
			entry.type = glsl.type[v[2]];
			entry.position = v[1];
			entry.out = v[4];
		}

		//defined in ir_generator_tables.php
		glsl.parser.initialize_functions(state);
	};

		  
}(glsl));