
function cnvgl_shader() {

	//status markers
	this.deleting = false;
	this.compile_status = false;
	this.info_log = '';

	//attached programs
	this.programs = {};

	//program communication	
	this.source = null;

	this.symbol_table = [];
	this.object_code = null;

	this.construct();
}

cnvgl_shader.prototype = new pClass;