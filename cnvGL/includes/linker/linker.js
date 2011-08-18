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


GlslLinker = (function() {

	//Internal Constructor
	function Initializer() {
		//public:
		this.status = false;
		this.errors = [];
		this.input = [];
		this.program = null;

		this.fragment = null;
		this.vertex = null;
	}

	var linker = jClass('linker', Initializer);

	//public:

	linker.linker = function() {
	}

	linker.link = function(program) {

		this.program = program;
		this.fragment = '';
		this.vertex = '';

		this.status = false;
		this.errors = [];

		for (var i = 0; i < this.input.length; i++) {
			this.merge(this.input[i]);
		}

		this.buildExecutable(this.fragment, 1);
		this.buildExecutable(this.vertex, 2);

		this.status = 1;
	}

	linker.addObjectCode = function(object) {
		this.input.push(object);
	}

	linker.merge = function(shader) {
		var code = this.processSymbols(shader);
		if (shader.mode == 1) {
			code = code.replace(/@fragment.main@/g, '__fragment_main');
			this.fragment += code;
		} else {
			code = code.replace(/@vertex.main@/g, '__vertex_main');
			this.vertex += code;
		}
	}

	linker.processSymbols = function(shader) {

		var symbol_table = shader.symbol_table.table.data;
		var code = shader.object_code;
		var location = 0;

		for (var name in symbol_table) {

			var entry = symbol_table[name];

			switch (entry.qualifier_name) {

				//external communication (special cases)

				case 'uniform':
					var uniform_obj = new cnvgl_uniform(entry);
					uniform_obj.location = this.program.active_uniforms_count;
					this.program.active_uniforms.push(uniform_obj);
					this.program.active_uniforms_count++;
					code = this.replaceSymbol(code, entry.object_name, '__uniform['+uniform_obj.location+']');						
					break;

				case 'attribute':
					var attribute_obj = new cnvgl_attribute(entry);
					attribute_obj.location = this.program.active_attributes_count;
					this.program.active_attributes.push(attribute_obj);
					this.program.active_attributes_count++;
					code = this.replaceSymbol(code, entry.object_name, 'this.gl_PerVertex['+attribute_obj.location+']');
					break;

				case 'out':
					code = this.replaceSymbol(code, entry.object_name, "this._out['"+entry.name+"']");
					break;

				default:
					if (entry.typedef == 0) {
						code = this.replaceSymbol(code, entry.object_name, entry.name);
					}
			}
		}

		return code;
	}

	linker.replaceSymbol = function(code, object_name, repl) {
		return code.replace(new RegExp(object_name, 'g'), repl);
	}

	linker.buildExecutable = function(__code, __mode) {

		var __uniform = this.program.active_uniforms_values;

		eval(__code);

		if (__mode == 1) {
			this.program.fragment_program = __fragment_main;
		} else {
			this.program.vertex_program = __vertex_main;
		}
	}

	return linker.Constructor;

})();

