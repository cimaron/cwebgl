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
		this.external = {};

		this.sizes = {};
	}

	var linker = jClass('linker', Initializer);

	//public:

	linker.linker = function() {
		this.addExternalReference('@gl_Position@', 'this.vertex[\'%s\']');
		this.addExternalReference('@gl_FragDepth@', 'this.fragment[\'%s\']');
		this.addExternalReference('@gl_FragColor@', 'this.fragment[\'%s\']');
		this.addExternalReference('@dot@', 'vec3.dot');
		this.addExternalReference('@max@', 'Math.max');
		this.addExternalReference('@texture2D@', 'this._%s');

		this.sizes.float = 1;
		this.sizes.vec2 = 2;
		this.sizes.vec3 = 3;
		this.sizes.vec4 = 4;
		this.sizes.mat4 = 16;
	};

	linker.addExternalReference = function(object_name, output) {
		if (!this.external[output]) {
			this.external[output] = [];
		}
		this.external[output].push(object_name);
	};

	linker.link = function(program) {
		var i;
		this.program = program;
		this.fragment = '';
		this.vertex = '';

		this.status = false;
		this.errors = [];

		for (i = 0; i < this.input.length; i++) {
			this.processAttributes(this.input[i]);
			this.merge(this.input[i]);
		}

		this.buildExecutable(this.fragment, 1);
		this.buildExecutable(this.vertex, 2);

		this.status = 1;
	};

	linker.addObjectCode = function(object) {
		this.input.push(object);
	};

	linker.merge = function(shader) {
		var code = this.processSymbols(shader);
		if (shader.mode == 1) {
			code = code.replace(/@fragment.main@/g, '__fragment_main');
			this.fragment += code;
		} else {
			code = code.replace(/@vertex.main@/g, '__vertex_main');
			this.vertex += code;
		}
	};
	
	linker.processAttributes = function(shader) {
		var symbol_table, name, entry;
		symbol_table = shader.symbol_table.table.data;

		//look for active attributes in symbol table and match them to bound attributes
		for (name in symbol_table) {
			entry = symbol_table[name];
			if (entry.qualifier_name == 'attribute' && this.program.attributes[name]) {
				attrib_obj = this.program.attributes[name];
				this.addActiveAttribute(attrib_obj);
			}
		}
	};
	
	linker.addActiveAttribute = function(attrib_obj) {
		var i;
		if (typeof attrib_obj.location != 'number') {
			for (i = 0; i <= this.program.active_attributes_values.length; i++) {
				if (typeof this.program.active_attributes_values[i] == 'undefined') {
					break;
				}
			}
			attrib_obj.location = i;
		}
		i = attrib_obj.location;
		this.program.active_attributes[attrib_obj.name] = attrib_obj;
		this.program.active_attributes_values[attrib_obj.location] = null;
		this.program.active_attributes_count++;
	};

	linker.processSymbols = function(shader) {
		var symbol_table, code, location, name, entry, uniform_obj, attrib_obj, i, e;

		symbol_table = shader.symbol_table.table.data;
		code = shader.object_code;
		location = 0;

		for (name in symbol_table) {

			entry = symbol_table[name];

			switch (entry.qualifier_name) {

				//external communication (special cases)

				case 'uniform':
					uniform_obj = new cnvgl_uniform(entry);
					uniform_obj.location = this.program.active_uniforms_count;
					this.program.active_uniforms.push(uniform_obj);
					this.program.active_uniforms_count++;
					code = this.replaceSymbol(code, entry.object_name, 'this._uniforms['+uniform_obj.location+']');						
					break;

				case 'attribute':
					if (this.program.active_attributes[entry.name]) {
						attrib_obj = this.program.active_attributes[entry.name];
						attrib_obj.definition = entry;
					} else {
						attrib_obj = new cnvgl_attribute(entry.name, entry);
						this.addActiveAttribute(attrib_obj);
					}
					attrib_obj.size = this.sizes[entry.type];
					code = this.replaceSymbol(code, entry.object_name, 'this.vertex.attributes['+attrib_obj.location+']');
					break;

				case 'out':
					code = this.replaceSymbol(code, entry.object_name, "this._out['"+entry.name+"']");
					break;

				case 'varying':
					if (shader.mode == 1) {
						code = this.replaceSymbol(code, entry.object_name, "this.fragment.varying['"+entry.name+"']");
					} else {
						code = this.replaceSymbol(code, entry.object_name, "this.vertex.varying['"+entry.name+"']");
					}
					break;

				default:
					//search for external object references
					for (i in this.external) {
						if (this.external[i].indexOf(entry.object_name) != -1) {
							e = i.replace('%s', entry.name);
							code = this.replaceSymbol(code, entry.object_name, e);
							continue;
						}
					}

					//nothing found, just replace symbol
					if (entry.typedef == 0) {
						code = this.replaceSymbol(code, entry.object_name, entry.name);
					}
			}
		}

		return code;
	};

	linker.replaceSymbol = function(code, object_name, repl) {
		return code.replace(new RegExp(object_name, 'g'), repl);
	};

	linker.buildExecutable = function(__code, __mode) {

		eval(__code);

		if (__mode == 1) {
			this.program.fragment_program = __fragment_main;
		} else {
			this.program.vertex_program = __vertex_main;
		}
	};

	return linker.Constructor;

}());

