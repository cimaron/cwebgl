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

(function(glsl, ARB, StdIO) {
		  
	var sprintf;

	sprint = StdIO.sprintf;

	function reindex(shader_obj, name, old_index, new_index, size, symbol) {
		var i, j, f, ins, code, diff;

		diff = new_index - old_index;

		if (diff == 0) {
			return;
		}

		symbol.location = new_index;

		code = shader_obj.object_code.body;
		for (i = 0; i < code.length; i++) {
			ins = code[i];

			//not an instruction object
			if (!ins.d) {
				continue;
			}

			//each operand
			for (j = 0; j < glsl.IR.operands.length; j++) {
				f = glsl.IR.operands[j];
				if (ins[f] && ins[f].name == name
					&& ins[f].offset >= old_index && ins[f].offset < old_index + size) {
					ins[f].addOffset(diff);
				}
			}
		}
	}

	function addVarying(program_obj, shader_obj) {
		var attribs, i, attrib, location;

		attribs = shader_obj.object_code.fragment.attrib;

		for (i = 0; i < attribs.length; i++) {
			attrib = attribs[i];

			//check if already declared
			if (attrib_obj = program_obj.getActiveVarying(attrib.name)) {

				//already exists as different type
				if (attrib_obj.size != attrib.type_size) {
					throw new Error(sprintf("Varying '%s' redeclared with different type", attrib.name));
				}

				continue;
			}

			location = program_obj.getOpenSlot(program_obj.varying);
			attrib_obj = new cnvgl_program_var(attrib.name, location, attrib.type_size);
			program_obj.addActiveVarying(attrib_obj);
		}

		//adjust addresses
		for (i = attribs.length - 1; i >= 0; i--) {
			attrib = attribs[i];
			attrib_obj = program_obj.getActiveVarying(attrib.name);
			reindex(shader_obj, attrib.name, attrib.location, attrib_obj.location, attrib.size, attrib);
		}
	}

	function addAttributes(program_obj, shader_obj) {
		var attribs, i, j, attrib, location;

		attribs = shader_obj.object_code.vertex.attrib;

		for (i = 0; i < attribs.length; i++) {
			attrib = attribs[i];

			//check if already declared
			if (attrib_obj = program_obj.getActiveAttribute(attrib.name)) {
				if (attrib_obj.size != attrib.type_size) {
					throw new Error(sprintf("Attribute '%s' redeclared with different type", attrib.name));
				}
			
				continue;
			}

			//get new location and reindex
			if ((location = program_obj.attributes.bound[attrib.name]) == undefined) {
				location = program_obj.getOpenSlot(program_obj.attributes);			
			}

			attrib_obj = new cnvgl_program_var(attrib.name, location, attrib.type_size);
			program_obj.addActiveAttribute(attrib_obj);
		}
		
		//adjust addresses
		for (i = attribs.length - 1; i >= 0; i--) {
			attrib = attribs[i];
			attrib_obj = program_obj.getActiveAttribute(attrib.name);
			reindex(shader_obj, attrib.name, attrib.location, attrib_obj.location, attrib.size, attrib);
		}
	}

	function addUniforms(program_obj, shader_obj) {
		var constants, uniforms, i, c, uniform, uniform_obj, location;

		constants = shader_obj.object_code.constants;
		uniforms = shader_obj.object_code.program.local;

		c = 0;
		for (i = 0; i < constants.length; i++) {
			uniform = constants[i];

			//check if already declared
			if (program_obj.getActiveUniform(uniform.value)) {
				continue;
			}

			//get new location and reindex
			if (i % 4 == 0) {
				location = program_obj.getOpenSlot(program_obj.uniforms);
				uniform_obj = new cnvgl_program_var('$constant'+c, location, 1);
				program_obj.addActiveUniform(uniform_obj);
				c++;
			} else {
				uniform_obj.slots++;
			}
		}

		for (i = 0; i < uniforms.length; i++) {
			uniform = uniforms[i];

			//check if already declared
			if (uniform_obj = program_obj.getActiveUniform(uniform.name)) {

				if (uniform_obj.size != uniform.type_size) {
					throw new Error(sprintf("Uniform '%s' redeclared with different type", uniform.name));
				}

				continue;
			}

			//get new location and reindex
			location = program_obj.getOpenSlot(program_obj.uniforms);

			uniform_obj = new cnvgl_program_var(uniform.name, location, uniform.type_size);
			program_obj.addActiveUniform(uniform_obj);
		}

		//adjust addresses
		for (i = uniforms.length - 1; i >= 0; i--) {
			uniform = uniforms[i];
			uniform_obj = program_obj.getActiveUniform(uniform.name);
			reindex(shader_obj, uniform.out, uniform.location, uniform_obj.location, uniform.size, uniform);
		}

		//adjust addresses
		for (i = c - 1; i >= 0; i--) {
			uniform = constants[i];
			uniform_obj = program_obj.getActiveUniform('$constant'+i);
			reindex(shader_obj, uniform.name, uniform.location, uniform_obj.location, uniform.size, uniform);
		}

	}

	function linkObject(program_obj, shader_obj) {
		var result, output;

		try {
			addAttributes(program_obj, shader_obj);
			addUniforms(program_obj, shader_obj);
			addVarying(program_obj, shader_obj);
		} catch (e) {
			glsl.errors.push(e);
			return false;
		}

		//do translation into native javascript
		result = ARB.translate(shader_obj.object_code, 'javascript');
		output = result ? ARB.output : null;

		return output;
	}

	function link(program_obj) {
		var i, status, shader_obj;
		status = 1;

		//reset
		program_obj.reset();

		for (i = 0; i < program_obj.attached_shaders.length; i++) {
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

}(glsl, ARB, StdIO));

