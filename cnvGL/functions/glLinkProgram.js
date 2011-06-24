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

/*void*/
function glLinkProgram(/*GLuint*/ program) {

	//if (not supported) then
	//	cnvgl_throw_error(GL_INVALID_OPERATION);
	//endif
	
	//get program
	var program_obj = cnvgl_objects[program];

	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	//object is not a program
	if (!program_obj.instanceOf('cnvgl_program')) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	//link error conditions:
	//The number of active attribute variables supported by the implementation has been exceeded.

	//reset
	program_obj.link_status = false;
	program_obj.executable = null;

	var linker = new ShaderLinker();
	
	for (var i = 0; i < program_obj.attached_shaders_count; i++) {
		var location = program_obj.attached_shaders[i];
		var shader_obj = cnvgl_objects[location];
		linker.addObjectCode(shader_obj.object_code);
	}

	var executable = linker.link();
	if (executable) {
		program_obj.link_status = true;
		program_obj.executable = executable;
	} else {
		return;	
	}

	//pull in symbols
	var symbols = executable.symbol_table;

	//reset uniforms
	program_obj.active_uniforms_count = 0;
	program_obj.active_uniforms = [];
	program_obj.active_uniforms_values = [];
	
	//reset attributes
	program_obj.active_attributes_count = 0;
	program_obj.active_attributes = [];

	for (var i in symbols) {
		var symbol = symbols[i];

		switch (symbol.type) {
			case 'uniform':
				var uniform_obj = new cnvgl_uniform(symbol);
				uniform_obj.location = program_obj.active_uniforms_count;
				program_obj.active_uniforms.push(uniform_obj);
				program_obj.active_uniforms_count++;
				program_obj.active_uniforms_values[uniform_obj.location] = [0, 0, 0, 0];
				break;

			case 'attribute':
				var attribute_obj = new cnvgl_attribute(symbol);
				attribute_obj.location = program_obj.active_attributes_count;
				program_obj.active_attributes.push(attribute_obj);
				program_obj.active_attributes_count++;
				break;

			default:
				debugger;
		}
	}

}

