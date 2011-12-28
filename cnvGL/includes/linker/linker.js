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

(function(glsl, ARB) {

	function addAttributes(program_obj, shader_obj) {
		var attribs, i, j, attrib, current;

		attribs = shader_obj.object_code.vertex.attrib;
		current = 0;

		for (i = 0; i < attribs.length; i++) {
			attrib = attribs[i];
			attrib_obj = new cnvgl_program_var(attrib.name, current, attrib.type_size);
			current += attrib.size;

			program_obj.active_attributes.push(attrib_obj);
		}
	}

	function addUniforms(program_obj, shader_obj) {
		var uniforms, i, j, uniform, current;

		constants = shader_obj.object_code.constants;
		uniforms = shader_obj.object_code.program.local;
		current = 0;

		for (i = 0; i < constants.length; i++) {
			uniform = constants[i];
			uniform_obj = new cnvgl_program_var("", current, 1);
			current++;

			program_obj.active_uniforms.push(uniform_obj);
		}

		for (i = 0; i < uniforms.length; i++) {
			uniform = uniforms[i];

			uniform_obj = new cnvgl_program_var(uniform.name, current, uniform.type_size);
			current += uniform.size;

			program_obj.active_uniforms.push(uniform_obj);
		}
	}

	function linkObject(program_obj, shader_obj) {
		var result, output;
		addAttributes(program_obj, shader_obj);
		addUniforms(program_obj, shader_obj);

		//do translation into native javascript
		result = ARB.translate(shader_obj.object_code, 'javascript');
		output = result ? ARB.output : null;

		return output;
	}

	function link(program_obj) {
		var i, status;
		status = 1;
		for (i = 0; i < program_obj.attached_shaders_count; i++) {
			shader_obj = program_obj.attached_shaders[i];
			shader_obj.exec = linkObject(program_obj, shader_obj);
			status &= !!shader_obj.exec;
		}
		return status;
	}

	/**
	 * External interface
	 */
	glsl.link = link;

}(glsl, ARB));

