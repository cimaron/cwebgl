
function cnvgl_buffer() {

	this.data = null;

	this.usage = null;
	this.target = null;
	this.access = null;

	this.construct();
}

cnvgl_buffer.prototype = new pClass('cnvgl_buffer');