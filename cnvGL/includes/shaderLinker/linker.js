
function ShaderLinker() {
	this.construct();
}

function __ShaderLinker() {
	this.ShaderLinker = function() {
	}

	this.initializeProgram = function(program_obj) {
		program_obj.link_status = false;

		program_obj.attribute_locations = program_obj.default_attribute_locations;
		program_obj.attributes = new Array(program_obj.max_attributes);

		program_obj.uniform_locations = {};
		program_obj.uniforms = new Array(program_obj.max_uniforms);

		program_obj.varying_locations = {};
		program_obj.varying = new Array(program_obj.max_varying);
		
		program_obj.object_code = null;
	}

	this.addSymbols = function(locations, symbols) {
		for (var i = 0; i < symbols.length; i++) {
			var symbol = symbols[i];
			if (typeof locations[symbol] == 'undefined') {
				var pos = this.findNewSymbolLocation(locations);
				if (pos === false) {
					return false;	
				}
				locations[symbol] = pos;
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

	this.link = function(program_obj, shader_objs) {

		var shader;

		if (!program_obj.vertex_object_code) {
			program_obj.vertex_object_code = '';
		}
		if (!program_obj.fragment_object_code) {
			program_obj.fragment_object_code = '';
		}

		for (var i in shader_objs) {
			shader = shader_objs[i];
			if (!this.addSymbols(program_obj.attribute_locations, shader.attributes)) {
				return false;	
			}
			if (!this.addSymbols(program_obj.uniform_locations, shader.uniforms)) {
				return false;	
			}
			if (!this.addSymbols(program_obj.varying_locations, shader.varying)) {
				return false;	
			}

			if (shader.type == GL_VERTEX_SHADER) {
				program_obj.vertex_object_code += shader.object_code;				
			} else {
				program_obj.fragment_object_code += shader.object_code;
			}
		}

		program_obj.link_status = true;
		return true;
	}
}
__ShaderLinker.prototype = new pClass;
ShaderLinker.prototype = new __ShaderLinker;

