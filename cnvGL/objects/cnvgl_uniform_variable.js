
function cnvgl_uniform_variable(name, definition) {

	this.definition = definition;
	this.name = name ? name : '';
	this.data = null;
	this.size = null;
	this.type = null;
	this.pointer = null;

	this.construct();
}

cnvgl_uniform_variable.prototype = new pClass;
