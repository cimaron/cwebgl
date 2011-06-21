
function ShaderLinker(program_obj) {

	this.program_obj = null;

	this.construct(program_obj);
}

function __ShaderLinker() {
	
	this.ShaderLinker = function(program_obj) {
		this.program_obj = program_obj;
		this.initialize(program_obj);
	}

	this.initialize = function(program_obj) {
		program_obj.link_status = false;

		program_obj.attribute_locations = program_obj.default_attribute_locations;
		program_obj.attributes = new Array(program_obj.max_attributes);

		program_obj.uniform_locations = {};
		program_obj.uniforms = new Array(program_obj.max_uniforms);

		program_obj.varying_locations = {};
		program_obj.varying = new Array(program_obj.max_varying);
		
		program_obj.object_code = null;
	}

	this.addSymbols = function(symbols) {
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

	this.findNewSymbolLocation = function(list) {
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

	this.link = function(shader_objs) {

		if (!this.program_obj.vertex_object_code) {
			this.program_obj.vertex_object_code = '';
		}
		if (!this.program_obj.fragment_object_code) {
			this.program_obj.fragment_object_code = '';
		}

		for (var i in shader_objs) {

			var shader = shader_objs[i];
			
			if (!this.addSymbols(shader.symbol_table)) {
				return false;
			}

			if (shader.type == GL_VERTEX_SHADER) {
				this.program_obj.vertex_object_code += shader.object_code;				
			} else {
				this.program_obj.fragment_object_code += shader.object_code;
			}
		}

		this.program_obj.link_status = true;
		return true;
	}
}
__ShaderLinker.prototype = new pClass;
ShaderLinker.prototype = new __ShaderLinker;

