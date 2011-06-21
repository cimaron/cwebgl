
function cnvgl_vertex_attribute(name, definition) {

	this.definition = definition;

	this.name = name ? name : '';

	this.enabled = false;

	this.index = null;
	this.size = 4;
	this.type = GL_FLOAT;

	//@todo: find out if this default is correct (glVertexAttribPointer)
	this.normalized = GL_FALSE;

	this.stride = 0;
	this.offset = 0;

	this.construct();
}

cnvgl_vertex_attribute.prototype = new pClass;
