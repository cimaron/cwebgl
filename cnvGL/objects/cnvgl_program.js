
function cnvgl_program() {

	//status markers
	this.deleting = null;
	this.link_status = null;
	this.validate_status = null;
	this.info_log = '';

	//attached shaders
	this.vertex_shaders = {};
	this.fragment_shaders = {};

	//arbitrary value (doesn't really matter in software mode)
	this.max_attributes = cnvgl_device.GL_MAX_VERTEX_ATTRIBS;
	this.max_uniforms = 32;
	this.max_varying = 32;

	//corresponds to nVidia implementation
	this.default_attribute_locations = {
		gl_Vertex			: 0,
		gl_Normal			: 2,
		gl_Color			: 3,
		gl_SecondaryColor	: 4,
		gl_FogCoord			: 5,
		gl_MultiTexCoord0	: 8,
		gl_MultiTexCoord1	: 9,
		gl_MultiTexCoord2	: 10,
		gl_MultiTexCoord3	: 11,
		gl_MultiTexCoord4	: 12,
		gl_MultiTexCoord5	: 13,
		gl_MultiTexCoord6	: 14,
		gl_MultiTexCoord7	: 15
	};

	//shader communication
	this.uniform_locations = {
	};
	this.uniforms = new Array(this.max_uniforms);

	this.attribute_locations = this.default_attribute_locations;
	this.attributes = new Array(this.max_attributes);

	this.varying_locations = {
	};
	this.varying = new Array(this.max_varying);

	this.vertex_object_code = null;
	this.fragment_object_code = null;
	
	this.vertex_executable = null;
	this.fragment_executable = null;

	this.construct();
}

cnvgl_program.prototype = new pClass;