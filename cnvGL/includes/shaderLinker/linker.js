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

//----------------------------------------------------------------------------------------
//	class ShaderLinker
//----------------------------------------------------------------------------------------

function ShaderLinker(program_obj) {

	//member variables:
	this.program_obj = null;

	//Call constructor
	this.construct(program_obj);
}

//----------------------------------------------------------------------------------------
//	Class Magic
//----------------------------------------------------------------------------------------

__ShaderLinker = new pClass;
ShaderLinker.prototype = __ShaderLinker;

//----------------------------------------------------------------------------------------
//	Methods
//----------------------------------------------------------------------------------------

__ShaderLinker.ShaderLinker = function(program_obj) {
	this.program_obj = program_obj;
	this.initialize(program_obj);
}

//public:

__ShaderLinker.initialize = function(program_obj) {
	program_obj.link_status = false;

	program_obj.attribute_locations = program_obj.default_attribute_locations;
	program_obj.attributes = new Array(program_obj.max_attributes);

	program_obj.uniform_locations = {};
	program_obj.uniforms = new Array(program_obj.max_uniforms);

	program_obj.varying_locations = {};
	program_obj.varying = new Array(program_obj.max_varying);
}


__ShaderLinker.link = function(shader_objs, type) {

	var oc, ex;

	if (type == GL_VERTEX_SHADER) {
		oc = 'vertex_object_code';
		ex = 'vertex_executable';
	} else {
		oc = 'fragment_object_code';
		ex = 'fragment_executable';
	}

	this.program_obj[oc] = this.buildObjectCode(shader_objs);
	this.program_obj[ex] = this.buildExecutable(this.program_obj[oc]);

	this.program_obj.link_status = true;
	return true;
}

__ShaderLinker.buildObjectCode = function(shader_objs) {
	var out = '';
	for (var i in shader_objs) {
		var shader = shader_objs[i];
		if (!this.addSymbols(shader.symbol_table)) {
			return false;
		}
		out += shader.object_code;
	}
	out += this._includeObjectCode();
	return out;
}

__ShaderLinker.buildExecutable = function(__object_code) {
	var __data;
	eval(__object_code);
	return main;
}

__ShaderLinker.addSymbols = function(symbols) {
	for (var i = 0; i < symbols.length; i++) {
		var symbol = symbols[i];
		
		if (symbol.type == 'attribute') {
			var locations = this.program_obj.attribute_locations;
			var list = this.program_obj.attributes;
			var data = new cnvgl_vertex_attribute(symbol.name, symbol);
		}
		if (symbol.type == 'uniform') {
			var locations = this.program_obj.uniform_locations;
			var list = this.program_obj.uniforms;
			var data = new cnvgl_uniform_variable(symbol.name, symbol);
		}
		if (symbol.type == 'varying') {
			var locations = this.program_obj.varying_locations;			
			var list = this.program_obj.varying;
			var data = new cnvgl_varying_variable(symbol.name, symbol);
		}

		if (typeof locations[symbol.name] == 'undefined') {
			var pos = this.findNewSymbolLocation(locations);
			if (pos === false) {
				return false;
			}
			locations[symbol.name] = pos;
			list[pos] = data;
		}
	}
	return true;
}


__ShaderLinker.findNewSymbolLocation = function(list) {
	var found = [];
	for (var i in list) {
		found[list[i]] = i;
	}
	//don't hardcode here
	for (var i = 0; i < 32; i++) {
		if (!found[i]) {
			return i;	
		}
	}
	return false;
}

//private:

__ShaderLinker._includeObjectCode = function() {
	var include = 
	"var mult4x4 = function(a, b) {\n"+
	"	return mat4.multiply(a, b, [])\n"+
	"};\n";
	return include;
}

